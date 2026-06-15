import { Injectable } from "@nestjs/common";
import { Prisma } from "../../../../../prisma/generated/client";
import {
	ForumTopicStatus,
	ReviewStatus,
	SearchEntityType,
	VoteType,
} from "../../../../../prisma/generated/enums";
import {
	SearchQueryDto,
	SearchSort,
	SearchType,
} from "../../../../application/search/dtos/search-query.dto";
import {
	SearchResultDto,
	SearchResultItem,
} from "../../../../application/search/dtos/search-result.dto";
import { SearchRepositoryProps } from "../../../../application/search/repositories/search.repository";
import { PrismaService } from "../prisma.service";

type SearchRow = SearchResultItem & {
	totalCount: bigint;
	relevanceRank: number;
	popularityRank: number;
};

const searchTextSql = Prisma.sql`immutable_unaccent(lower(
	coalesce("title", '') || ' ' ||
	coalesce("brandName", '') || ' ' ||
	coalesce("modelName", '') || ' ' ||
	coalesce("versionName", '') || ' ' ||
	coalesce("year"::text, '')
))`;

@Injectable()
export class PrismaSearchRepository extends SearchRepositoryProps {
	constructor(private prisma: PrismaService) {
		super();
	}

	async search(params: SearchQueryDto): Promise<SearchResultDto> {
		const page = params.page ?? 1;
		const limit = params.limit ?? 10;
		const offset = (page - 1) * limit;
		const query = params.q?.trim() ?? "";
		const entityType = this.toEntityType(params.type ?? SearchType.ALL);
		const typeFilter = entityType
			? Prisma.sql`AND "entityType" = ${entityType}::"SearchEntityType"`
			: Prisma.empty;
		const orderBy = this.orderBy(params.sort ?? SearchSort.RELEVANCE);

		const rows = query
			? await this.prisma.$queryRaw<SearchRow[]>(Prisma.sql`
				WITH ranked AS (
					SELECT
						"id", "entityId", "entityType", "title", "excerpt",
						"authorName", "brandName", "modelName", "versionName",
						"year", "slug", "score", "votesCount", "commentsCount",
						"createdAt",
						LEAST(ts_rank_cd(
							"searchVector",
							websearch_to_tsquery('portuguese', immutable_unaccent(${query})),
							32
						) * 4, 1) AS "textRank",
						similarity(${searchTextSql}, immutable_unaccent(lower(${query}))) AS "trigramRank",
						LEAST(
							ln((1 + GREATEST("votesCount", 0) * 2 + GREATEST("commentsCount", 0))::double precision) / 8,
							1
						) AS "popularityRank",
						1 / (1 + EXTRACT(EPOCH FROM (CURRENT_TIMESTAMP - "createdAt")) / 2592000) AS "recencyRank"
					FROM "search_documents"
					WHERE (
						"searchVector" @@ websearch_to_tsquery('portuguese', immutable_unaccent(${query}))
						OR ${searchTextSql} % immutable_unaccent(lower(${query}))
					)
					${typeFilter}
				), scored AS (
					SELECT *,
						("textRank" * 0.72 + "trigramRank" * 0.18 + "popularityRank" * 0.07 + "recencyRank" * 0.03) AS "relevanceRank"
					FROM ranked
				)
				SELECT *, COUNT(*) OVER() AS "totalCount"
				FROM scored
				ORDER BY ${orderBy}
				LIMIT ${limit} OFFSET ${offset}
			`)
			: await this.prisma.$queryRaw<SearchRow[]>(Prisma.sql`
				SELECT
					"id", "entityId", "entityType", "title", "excerpt",
					"authorName", "brandName", "modelName", "versionName",
					"year", "slug", "score", "votesCount", "commentsCount",
					"createdAt", 0::double precision AS "relevanceRank",
					LEAST(
						ln((1 + GREATEST("votesCount", 0) * 2 + GREATEST("commentsCount", 0))::double precision) / 8,
						1
					) AS "popularityRank",
					COUNT(*) OVER() AS "totalCount"
				FROM "search_documents"
				WHERE TRUE ${typeFilter}
				ORDER BY ${orderBy}
				LIMIT ${limit} OFFSET ${offset}
			`);

		const total = Number(rows[0]?.totalCount ?? 0);
		const items = rows.map((row) => ({
			id: row.id,
			entityId: row.entityId,
			entityType: row.entityType,
			title: row.title,
			excerpt: row.excerpt,
			authorName: row.authorName,
			brandName: row.brandName,
			modelName: row.modelName,
			versionName: row.versionName,
			year: row.year,
			slug: row.slug,
			score: row.score,
			votesCount: row.votesCount,
			commentsCount: row.commentsCount,
			createdAt: row.createdAt,
		}));

		return {
			items,
			meta: {
				page,
				limit,
				total,
				totalPages: Math.ceil(total / limit),
			},
		};
	}

	async indexReview(reviewId: string): Promise<void> {
		const review = await this.prisma.review.findUnique({
			where: { id: reviewId },
			include: {
				user: { select: { username: true } },
				carVersionYear: {
					include: {
						carVersion: {
							include: { model: { include: { brand: true } } },
						},
					},
				},
				votes: { select: { type: true } },
				_count: { select: { comments: true } },
			},
		});

		if (!review || review.status !== ReviewStatus.PUBLISHED) {
			await this.removeReview(reviewId);
			return;
		}

		const votesCount = review.votes.reduce(
			(total, vote) => total + (vote.type === VoteType.UP ? 1 : -1),
			0,
		);
		const vehicle = review.carVersionYear.carVersion;
		const data = {
			title: review.title,
			content: review.content,
			excerpt: this.excerpt(review.content),
			authorName: review.user.username,
			brandName: vehicle.model.brand.name,
			modelName: vehicle.model.name,
			versionName: vehicle.versionName,
			year: review.carVersionYear.year,
			slug: review.slug,
			score: review.score,
			votesCount,
			commentsCount: review._count.comments,
			createdAt: review.createdAt,
		};

		await this.prisma.searchDocument.upsert({
			where: {
				entityId_entityType: { entityId: review.id, entityType: SearchEntityType.REVIEW },
			},
			create: { entityId: review.id, entityType: SearchEntityType.REVIEW, ...data },
			update: data,
		});
	}

	async indexTopic(topicId: string): Promise<void> {
		const topic = await this.prisma.forumTopic.findUnique({
			where: { id: topicId },
			include: {
				author: { select: { username: true } },
				_count: {
					select: {
						posts: { where: { status: "PUBLISHED", deletedAt: null } },
					},
				},
			},
		});

		if (
			!topic ||
			topic.status !== ForumTopicStatus.PUBLISHED ||
			topic.deletedAt
		) {
			await this.removeTopic(topicId);
			return;
		}

		const data = {
			title: topic.title,
			content: topic.content,
			excerpt: this.excerpt(topic.content),
			authorName: topic.author.username,
			brandName: null,
			modelName: null,
			versionName: null,
			year: null,
			slug: topic.slug,
			score: 0,
			votesCount: topic.upvotes - topic.downvotes,
			commentsCount: topic._count.posts,
			createdAt: topic.createdAt,
		};

		await this.prisma.searchDocument.upsert({
			where: {
				entityId_entityType: { entityId: topic.id, entityType: SearchEntityType.TOPIC },
			},
			create: { entityId: topic.id, entityType: SearchEntityType.TOPIC, ...data },
			update: data,
		});
	}

	async removeReview(reviewId: string): Promise<void> {
		await this.remove(reviewId, SearchEntityType.REVIEW);
	}

	async removeTopic(topicId: string): Promise<void> {
		await this.remove(topicId, SearchEntityType.TOPIC);
	}

	async reindexAll(): Promise<{ reviews: number; topics: number }> {
		const [reviews, topics] = await Promise.all([
			this.prisma.review.findMany({
				where: { status: ReviewStatus.PUBLISHED },
				select: { id: true },
			}),
			this.prisma.forumTopic.findMany({
				where: { status: ForumTopicStatus.PUBLISHED, deletedAt: null },
				select: { id: true },
			}),
		]);

		await this.prisma.searchDocument.deleteMany();

		for (const review of reviews) await this.indexReview(review.id);
		for (const topic of topics) await this.indexTopic(topic.id);

		return { reviews: reviews.length, topics: topics.length };
	}

	private async remove(entityId: string, entityType: SearchEntityType) {
		await this.prisma.searchDocument.deleteMany({ where: { entityId, entityType } });
	}

	private toEntityType(type: SearchType): SearchEntityType | null {
		if (type === SearchType.REVIEW) return SearchEntityType.REVIEW;
		if (type === SearchType.TOPIC) return SearchEntityType.TOPIC;
		return null;
	}

	private orderBy(sort: SearchSort): Prisma.Sql {
		if (sort === SearchSort.RECENT) {
			return Prisma.sql`"createdAt" DESC, "relevanceRank" DESC`;
		}
		if (sort === SearchSort.POPULAR) {
			return Prisma.sql`"popularityRank" DESC, "score" DESC, "createdAt" DESC`;
		}
		return Prisma.sql`"relevanceRank" DESC, "votesCount" DESC, "commentsCount" DESC, "score" DESC, "createdAt" DESC`;
	}

	private excerpt(content: string): string {
		const normalized = content.replace(/\s+/g, " ").trim();
		return normalized.length > 180
			? `${normalized.slice(0, 177).trimEnd()}...`
			: normalized;
	}
}

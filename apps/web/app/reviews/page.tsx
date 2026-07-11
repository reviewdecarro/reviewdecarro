import { Suspense } from "react";
import { fetchPublicReviewsPage } from "@/api/reviews";
import { fetchReviewSearch, type SearchSort } from "@/api/search";
import { HeroCommunity } from "@/components/HeroCommunity";
import { PaginationControls } from "@/components/PaginationControls";
import { SearchResultsControls } from "@/components/SearchResultsControls";
import { FeaturedReviewBanner } from "./FeaturedReviewBanner";
import { ReviewsFilter } from "./ReviewsFilter";
import { ReviewsSearchInput } from "./ReviewsSearchInput";

type ReviewsPageProps = {
	searchParams: Promise<{
		q?: string | string[];
		sort?: string | string[];
		page?: string | string[];
	}>;
};

export default async function ReviewsPage({ searchParams }: ReviewsPageProps) {
	const { q, sort: sortParam, page: pageParam } = await searchParams;
	const query = (Array.isArray(q) ? q[0] : q)?.trim() ?? "";
	const isSearching = query.length > 0;
	const rawSort = Array.isArray(sortParam) ? sortParam[0] : sortParam;
	const sort: SearchSort = ["recent", "popular"].includes(rawSort ?? "")
		? (rawSort as SearchSort)
		: "relevance";
	const rawPage = Number(Array.isArray(pageParam) ? pageParam[0] : pageParam);
	const page = Number.isInteger(rawPage) && rawPage > 0 ? rawPage : 1;
	const searchResult = isSearching
		? await fetchReviewSearch({ q: query, sort, page })
		: null;
	const listing = isSearching
		? null
		: await fetchPublicReviewsPage({ page, limit: 12 });
	const reviews = searchResult?.items ?? listing?.items ?? [];
	const total = searchResult?.meta.total ?? listing?.meta.total ?? 0;
	const featured = isSearching ? undefined : (listing?.featured ?? undefined);
	const items = reviews.map((review) => ({ review }));
	const reviewsLabel = total === 1 ? "avaliação encontrada" : "avaliações encontradas";

	return (
		<>
			<HeroCommunity
				title="Avaliações da Comunidade"
				subtitle="Descubra opiniões reais de quem realmente dirigiu"
				buttonLabel="+ Nova avaliação"
				buttonHref="/reviews/new"
				searchControl={
					<Suspense
						fallback={
							<div className="h-[58px] w-full rounded-lg border border-white/20 bg-white/10" />
						}
					>
						<ReviewsSearchInput key={query} initialQuery={query} />
					</Suspense>
				}
			/>
			<main className="flex-1" style={{ background: "var(--bg)" }}>
				<div className="max-w-[1100px] mx-auto px-6 py-10">
					<div className="mb-8">
						<h1
							className="font-display font-extrabold text-3xl"
							style={{ color: "var(--text)" }}
						>
							{total} {reviewsLabel}
						</h1>
					</div>

					{isSearching && searchResult ? (
						<SearchResultsControls
							sort={sort}
							page={searchResult.meta.page}
							totalPages={searchResult.meta.totalPages}
						/>
					) : null}

					{featured && (
						<div className="mb-8">
							<FeaturedReviewBanner review={featured} />
						</div>
					)}

					{items.length > 0 ? (
						<ReviewsFilter items={items} />
					) : reviews.length === 0 ? (
						<div
							className="rounded-xl border px-5 py-6"
							style={{
								background: "var(--surface)",
								borderColor: "var(--border)",
							}}
						>
							<p className="text-[14px]" style={{ color: "var(--text-muted)" }}>
								{isSearching
									? `Nenhuma avaliação encontrada para “${query}”.`
									: "Ainda não há avaliações publicadas."}
							</p>
						</div>
					) : null}

					{!isSearching && listing && listing.meta.totalPages > 1 ? (
						<div className="mt-8 flex justify-end">
							<PaginationControls
								page={listing.meta.page}
								totalPages={listing.meta.totalPages}
							/>
						</div>
					) : null}
				</div>
			</main>
		</>
	);
}

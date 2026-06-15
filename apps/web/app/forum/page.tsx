import { Suspense } from "react";
import { fetchForumTopics } from "@/api/forum";
import { fetchTopicSearch, type SearchSort } from "@/api/search";
import { HeroCommunity } from "@/components/HeroCommunity";
import { ForumSearchInput } from "./ForumSearchInput";
import { ForumPage } from "./forum-page";

type ForumRoutePageProps = {
	searchParams: Promise<{
		q?: string | string[];
		sort?: string | string[];
		page?: string | string[];
	}>;
};

export default async function ForumRoutePage({
	searchParams,
}: ForumRoutePageProps) {
	const { q, sort: sortParam, page: pageParam } = await searchParams;
	const query = (Array.isArray(q) ? q[0] : q)?.trim() ?? "";
	const rawSort = Array.isArray(sortParam) ? sortParam[0] : sortParam;
	const sort: SearchSort = ["recent", "popular"].includes(rawSort ?? "")
		? (rawSort as SearchSort)
		: "relevance";
	const rawPage = Number(Array.isArray(pageParam) ? pageParam[0] : pageParam);
	const page = Number.isInteger(rawPage) && rawPage > 0 ? rawPage : 1;
	const searchResult = query
		? await fetchTopicSearch({ q: query, sort, page })
		: null;
	const threads = searchResult?.items ?? (await fetchForumTopics());

	return (
		<>
			<HeroCommunity
				title="Fórum da comunidade"
				subtitle="Compartilhe experiências, tire dúvidas e conecte-se com entusiastas"
				buttonLabel="+ Criar tópico"
				buttonHref="/forum/new"
				searchControl={
					<Suspense
						fallback={
							<div className="h-[58px] w-full rounded-lg border border-white/20 bg-white/10" />
						}
					>
						<ForumSearchInput key={query} initialQuery={query} />
					</Suspense>
				}
			/>
			<main className="flex-1" style={{ background: "var(--bg)" }}>
				<ForumPage
					data={{ threads }}
					query={query}
					total={searchResult?.meta.total}
					sort={sort}
					page={searchResult?.meta.page}
					totalPages={searchResult?.meta.totalPages}
				/>
			</main>
		</>
	);
}

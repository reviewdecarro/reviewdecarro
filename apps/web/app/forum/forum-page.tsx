import { ForumThreadRow } from "@/components/ForumThreadRow";
import { SearchResultsControls } from "@/components/SearchResultsControls";
import type { SearchSort } from "@/api/search";
import type { ForumTopicSummary } from "@/types";

type ForumPageProps = {
	data: {
		threads: ForumTopicSummary[];
	};
	query: string;
	total?: number;
	sort: SearchSort;
	page?: number;
	totalPages?: number;
};

export function ForumPage({ data, query, total, sort, page, totalPages }: ForumPageProps) {
	const resultCount = total ?? data.threads.length;
	return (
		<div className="max-w-[1100px] mx-auto px-6 py-10">
			<div className="grid gap-8">
				<section className="w-full">
					<div className="mb-7">
						<h1
							className="font-display font-extrabold text-[28px] mb-1.5"
							style={{ color: "var(--text)" }}
						>
							{resultCount}{" "}
							{resultCount === 1 ? "tópico encontrado" : "tópicos encontrados"}
						</h1>
						<p className="text-[14px]" style={{ color: "var(--text-muted)" }}>
							Dúvidas, discussões e relatos da comunidade PapoAuto.
						</p>
					</div>

					{query ? (
						<SearchResultsControls
							sort={sort}
							page={page ?? 1}
							totalPages={totalPages ?? 0}
						/>
					) : null}

					<div
						className="rounded-xl overflow-hidden border"
						style={{
							background: "var(--palette-white)",
							borderColor: "var(--border)",
						}}
					>
						{data.threads.map((thread) => (
							<ForumThreadRow key={thread.id} thread={thread} />
						))}

						{data.threads.length === 0 ? (
							<div
								className="py-10 text-center text-[14px]"
								style={{ color: "var(--text-muted)" }}
							>
								{query
									? `Nenhum tópico encontrado para “${query}”.`
									: "Ainda não há tópicos publicados."}
							</div>
						) : null}
					</div>
				</section>
			</div>
		</div>
	);
}

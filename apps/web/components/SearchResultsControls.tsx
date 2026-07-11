"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { SearchSort } from "@/api/search";
import { PaginationControls } from "./PaginationControls";

type SearchResultsControlsProps = {
	sort: SearchSort;
	page: number;
	totalPages: number;
};

export function SearchResultsControls({ sort, page, totalPages }: SearchResultsControlsProps) {
	const pathname = usePathname();
	const router = useRouter();
	const searchParams = useSearchParams();

	function changeSort(nextSort: SearchSort) {
		const params = new URLSearchParams(searchParams.toString());
		params.set("sort", nextSort);
		params.delete("page");
		router.replace(`${pathname}?${params.toString()}`, { scroll: false });
	}

	return (
		<div className="mb-6 flex flex-wrap items-center justify-between gap-3">
			<label className="flex items-center gap-2 text-sm text-[var(--text-muted)]">
				Ordenar por
				<select
					value={sort}
					onChange={(event) => changeSort(event.target.value as SearchSort)}
					className="rounded-lg border border-[var(--border)] bg-white px-3 py-2 text-[var(--text)]"
				>
					<option value="relevance">Relevância</option>
					<option value="recent">Mais recentes</option>
					<option value="popular">Mais populares</option>
				</select>
			</label>

			<PaginationControls page={page} totalPages={totalPages} />
		</div>
	);
}

"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { SearchSort } from "@/api/search";

type SearchResultsControlsProps = {
	sort: SearchSort;
	page: number;
	totalPages: number;
};

export function SearchResultsControls({ sort, page, totalPages }: SearchResultsControlsProps) {
	const pathname = usePathname();
	const router = useRouter();
	const searchParams = useSearchParams();

	function navigate(next: { sort?: SearchSort; page?: number }) {
		const params = new URLSearchParams(searchParams.toString());
		if (next.sort) params.set("sort", next.sort);
		if (next.page && next.page > 1) params.set("page", String(next.page));
		else params.delete("page");
		router.replace(`${pathname}?${params.toString()}`, { scroll: false });
	}

	return (
		<div className="mb-6 flex flex-wrap items-center justify-between gap-3">
		<label className="flex items-center gap-2 text-sm text-[var(--text-muted)]">
			Ordenar por
			<select
				value={sort}
				onChange={(event) => navigate({ sort: event.target.value as SearchSort, page: 1 })}
				className="rounded-lg border border-[var(--border)] bg-white px-3 py-2 text-[var(--text)]"
			>
				<option value="relevance">Relevância</option>
				<option value="recent">Mais recentes</option>
				<option value="popular">Mais populares</option>
			</select>
		</label>

		{totalPages > 1 ? (
			<div className="flex items-center gap-2 text-sm">
				<button
					type="button"
					disabled={page <= 1}
					onClick={() => navigate({ page: page - 1 })}
					className="rounded-lg border border-[var(--border)] bg-white px-3 py-2 disabled:cursor-not-allowed disabled:opacity-50"
				>
					Anterior
				</button>
				<span className="text-[var(--text-muted)]">{page} de {totalPages}</span>
				<button
					type="button"
					disabled={page >= totalPages}
					onClick={() => navigate({ page: page + 1 })}
					className="rounded-lg border border-[var(--border)] bg-white px-3 py-2 disabled:cursor-not-allowed disabled:opacity-50"
				>
					Próxima
				</button>
			</div>
		) : null}
		</div>
	);
}

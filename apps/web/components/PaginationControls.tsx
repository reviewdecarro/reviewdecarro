"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

type PaginationControlsProps = {
	page: number;
	totalPages: number;
};

export function PaginationControls({ page, totalPages }: PaginationControlsProps) {
	const pathname = usePathname();
	const router = useRouter();
	const searchParams = useSearchParams();

	if (totalPages <= 1) {
		return null;
	}

	function goToPage(next: number) {
		const params = new URLSearchParams(searchParams.toString());
		if (next > 1) params.set("page", String(next));
		else params.delete("page");
		router.replace(`${pathname}?${params.toString()}`, { scroll: false });
	}

	return (
		<div className="flex items-center gap-2 text-sm">
			<button
				type="button"
				disabled={page <= 1}
				onClick={() => goToPage(page - 1)}
				className="rounded-lg border border-[var(--border)] bg-white px-3 py-2 disabled:cursor-not-allowed disabled:opacity-50"
			>
				Anterior
			</button>
			<span className="text-[var(--text-muted)]">
				{page} de {totalPages}
			</span>
			<button
				type="button"
				disabled={page >= totalPages}
				onClick={() => goToPage(page + 1)}
				className="rounded-lg border border-[var(--border)] bg-white px-3 py-2 disabled:cursor-not-allowed disabled:opacity-50"
			>
				Próximo
			</button>
		</div>
	);
}

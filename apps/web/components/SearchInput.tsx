"use client";

import { Search } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

type SearchInputProps = {
	initialQuery: string;
	label: string;
	placeholder: string;
};

const SEARCH_DEBOUNCE_MS = 300;

export function SearchInput({ initialQuery, label, placeholder }: SearchInputProps) {
	const pathname = usePathname();
	const router = useRouter();
	const searchParams = useSearchParams();
	const currentQuery = searchParams.get("q") ?? "";
	const [query, setQuery] = useState(initialQuery);

	useEffect(() => {
		const timeoutId = window.setTimeout(() => {
			const normalizedQuery = query.trim();
			if (normalizedQuery === currentQuery.trim()) return;

			const nextSearchParams = new URLSearchParams(searchParams.toString());
			if (normalizedQuery) nextSearchParams.set("q", normalizedQuery);
			else nextSearchParams.delete("q");
			nextSearchParams.delete("page");

			const nextQueryString = nextSearchParams.toString();
			router.replace(nextQueryString ? `${pathname}?${nextQueryString}` : pathname, {
				scroll: false,
			});
		}, SEARCH_DEBOUNCE_MS);

		return () => window.clearTimeout(timeoutId);
	}, [currentQuery, pathname, query, router, searchParams]);

	return (
		<label className="relative block w-full">
			<span className="sr-only">{label}</span>
			<Search
				size={20}
				strokeWidth={1.8}
				className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
			/>
			<input
				type="search"
				value={query}
				onChange={(event) => setQuery(event.target.value)}
				placeholder={placeholder}
				className="w-full rounded-lg border border-white/20 bg-white/10 py-4 pl-12 pr-4 text-white backdrop-blur-sm placeholder:text-gray-400 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-accent"
			/>
		</label>
	);
}

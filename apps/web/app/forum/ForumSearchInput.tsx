import { SearchInput } from "@/components/SearchInput";

type ForumSearchInputProps = {
	initialQuery: string;
};

export function ForumSearchInput({ initialQuery }: ForumSearchInputProps) {
	return (
		<SearchInput
			initialQuery={initialQuery}
			label="Buscar tópicos"
			placeholder="Buscar por título ou conteúdo..."
		/>
	);
}

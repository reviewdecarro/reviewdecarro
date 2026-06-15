import { SearchInput } from "@/components/SearchInput";

type ReviewsSearchInputProps = {
	initialQuery: string;
};

export function ReviewsSearchInput({ initialQuery }: ReviewsSearchInputProps) {
	return (
		<SearchInput
			initialQuery={initialQuery}
			label="Buscar avaliações"
			placeholder="Buscar por marca, modelo, versão ou conteúdo..."
		/>
	);
}

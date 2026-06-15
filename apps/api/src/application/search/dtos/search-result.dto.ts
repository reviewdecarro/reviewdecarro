export type SearchResultItem = {
	id: string;
	entityId: string;
	entityType: "REVIEW" | "TOPIC";
	title: string;
	excerpt: string | null;
	authorName: string | null;
	brandName: string | null;
	modelName: string | null;
	versionName: string | null;
	year: number | null;
	slug: string;
	score: number;
	votesCount: number;
	commentsCount: number;
	createdAt: Date;
};

export type SearchResultDto = {
	items: SearchResultItem[];
	meta: {
		page: number;
		limit: number;
		total: number;
		totalPages: number;
	};
};

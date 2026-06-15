import { notFound } from "next/navigation";
import { fetchForumTopicBySlug } from "@/api/forum";
import { ThreadDetailClient } from "./thread-detail-client";

type ThreadPageProps = {
	params: Promise<{
		slug: string;
	}>;
};

export default async function ThreadPage({ params }: ThreadPageProps) {
	const { slug } = await params;
	const thread = await fetchForumTopicBySlug(slug);

	if (!thread) {
		notFound();
	}

	return (
		<main className="flex-1" style={{ background: "var(--bg)" }}>
			<ThreadDetailClient thread={thread} />
		</main>
	);
}

import { notFound } from "next/navigation";
import { Footer } from "@/components/Footer";
import { Nav } from "@/components/Nav";
import { fetchForumTopicBySlug } from "@/lib/forum";
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
    <>
      <Nav />
      <main className="flex-1" style={{ background: "var(--bg)" }}>
        <ThreadDetailClient thread={thread} />
      </main>
      <Footer />
    </>
  );
}

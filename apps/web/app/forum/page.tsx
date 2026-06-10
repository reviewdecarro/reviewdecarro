import { HeroCommunity } from "@/components/HeroCommunity";
import { fetchForumTopics } from "@/lib/forum";
import { ForumPage } from "./forum-page";

export default async function ForumRoutePage() {
  const threads = await fetchForumTopics();

  return (
    <>
      <HeroCommunity />
      <main className="flex-1" style={{ background: "var(--bg)" }}>
        <ForumPage data={{ threads }} />
      </main>
    </>
  );
}

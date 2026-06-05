import { Footer } from "@/components/Footer";
import { HeroCommunity } from "@/components/HeroCommunity";
import { Nav } from "@/components/Nav";
import { fetchForumTopics } from "@/lib/forum";
import { ForumPage } from "./forum-page";

export default async function ForumRoutePage() {
  const threads = await fetchForumTopics();

  return (
    <>
      <Nav />
      <HeroCommunity />
      <main className="flex-1" style={{ background: "var(--bg)" }}>
        <ForumPage data={{ threads }} />
      </main>
      <Footer />
    </>
  );
}

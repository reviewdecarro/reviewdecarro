import { HeroCommunity } from "@/components/HeroCommunity";
import { fetchForumTopics } from "@/lib/forum";
import { ForumPage } from "./forum-page";

export default async function ForumRoutePage() {
  const threads = await fetchForumTopics();

  return (
    <>
      <HeroCommunity
        title="Fórum da comunidade"
        subtitle="Compartilhe experiências, tire dúvidas e conecte-se com entusiastas"
        buttonLabel="+ Criar tópico"
        buttonHref="/forum/new"
      />
      <main className="flex-1" style={{ background: "var(--bg)" }}>
        <ForumPage data={{ threads }} />
      </main>
    </>
  );
}

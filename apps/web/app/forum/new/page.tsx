import { Footer } from "@/components/Footer";
import { Nav } from "@/components/Nav";
import { NewThreadForm } from "./new-thread-form";

export default function NewForumThreadPage() {
  return (
    <>
      <Nav />
      <main className="flex-1" style={{ background: "var(--bg)" }}>
        <div className="max-w-[760px] mx-auto px-6 py-10">
          <div className="mb-6">
            <h1
              className="font-display font-extrabold text-[28px] mb-2"
              style={{ color: "var(--text)" }}
            >
              Criar um tópico
            </h1>
            <p className="text-[14px]" style={{ color: "var(--text-muted)" }}>
              Abra um novo tópico no fórum usando sua sessão autenticada.
            </p>
          </div>
          <NewThreadForm />
        </div>
      </main>
      <Footer />
    </>
  );
}

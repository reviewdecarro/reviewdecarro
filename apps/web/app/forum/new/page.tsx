import { Footer } from "@/components/Footer";
import { Nav } from "@/components/Nav";
import { NewThreadForm } from "./new-thread-form";

export default function NewForumThreadPage() {
  return (
    <>
      <Nav />
      <main
        className="flex-1 px-4 py-8 sm:px-6 sm:py-12"
        style={{ background: "var(--bg)" }}
      >
        <div className="mx-auto flex w-full max-w-[980px] flex-col gap-6">
          <div>
            <h1
              className="font-display text-3xl font-extrabold"
              style={{ color: "var(--text)" }}
            >
              Criar um tópico
            </h1>
            <p
              className="mt-1 text-[14px]"
              style={{ color: "var(--text-muted)" }}
            >
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

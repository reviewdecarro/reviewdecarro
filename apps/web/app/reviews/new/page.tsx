import { Footer } from "@/components/Footer";
import { Nav } from "@/components/Nav";
import { NewReviewForm } from "./new-review-form";

export default function NewReviewPage() {
  return (
    <>
      <Nav />
      <main
        className="flex-1 px-4 py-8 sm:px-6 sm:py-12"
        style={{ background: "var(--bg)" }}
      >
        <div className="mx-auto flex w-full max-w-[760px] flex-col gap-6">
          <div>
            <h1
              className="font-display text-3xl font-extrabold"
              style={{ color: "var(--text)" }}
            >
              Nova avaliação
            </h1>
            <p
              className="mt-1 text-[14px]"
              style={{ color: "var(--text-muted)" }}
            >
              Envie uma nova review usando sua sessão autenticada.
            </p>
          </div>

          <NewReviewForm />
        </div>
      </main>
      <Footer />
    </>
  );
}

import type { Metadata } from "next";
import { AdminClient } from "./admin-client";

export const metadata: Metadata = {
  title: "Admin | PapoAuto",
};

export default function AdminPage() {
  return (
    <>
      <main className="flex-1" style={{ background: "var(--bg)" }}>
        <div className="max-w-[1100px] mx-auto px-4 sm:px-6 py-8 sm:py-10">
          <AdminClient />
        </div>
      </main>
    </>
  );
}

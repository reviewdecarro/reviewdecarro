import type { Metadata } from "next";
import { Footer } from "@/components/Footer";
import { Nav } from "@/components/Nav";
import { ProfileClient } from "./profile-client";

export const metadata: Metadata = {
  title: "Meu perfil | PapoAuto",
};

export default function ProfilePage() {
  return (
    <>
      <Nav />
      <main className="flex-1" style={{ background: "var(--bg)" }}>
        <div className="max-w-[1100px] mx-auto px-4 sm:px-6 py-8 sm:py-10">
          <ProfileClient />
        </div>
      </main>
      <Footer />
    </>
  );
}

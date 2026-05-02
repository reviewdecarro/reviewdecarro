import type { Metadata } from 'next';
import './globals.css';
import { AuthSessionProvider } from '@/hooks/use-auth-session';

export const metadata: Metadata = {
  title: 'PapoAuto — Avaliações de Carros e Comunidade',
  description: 'Comunidade automotiva para todos.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className="min-h-screen flex flex-col font-sans">
        <AuthSessionProvider>{children}</AuthSessionProvider>
      </body>
    </html>
  );
}

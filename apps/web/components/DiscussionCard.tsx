"use client";

import { Clock, MessageSquare, TrendingUp } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import type { ForumTopicSummary } from "@/types";

type DiscussionCardProps = {
  thread: ForumTopicSummary;
};

export function DiscussionCard({ thread }: DiscussionCardProps) {
  const [hovered, setHovered] = useState(false);
  const voteCount = thread.upvotes ?? thread.votes ?? 0;

  return (
    <Link
      href={`/forum/${thread.slug}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="block rounded-xl p-4 transition-all duration-200"
      style={{
        background: "var(--surface)",
        border: "1px solid var(--border)",
        borderLeft: "4px solid var(--accent)",
        boxShadow: hovered ? "0 6px 24px rgba(0,0,0,0.10)" : "none",
        transform: hovered ? "translateY(-2px)" : "none",
      }}
    >
      {/* Linha de topo: ícone trending + badge de categoria */}
      <div className="flex items-center gap-2 mb-2">
        <TrendingUp
          size={14}
          strokeWidth={1.8}
          style={{ color: "var(--text-muted)" }}
        />
        {thread.category && (
          <span
            className="text-[11px] font-semibold uppercase px-2 py-0.5 rounded"
            style={{
              background: "var(--surface-2)",
              color: "var(--text-muted)",
            }}
          >
            {thread.category}
          </span>
        )}
      </div>

      {/* Número de votos */}
      <div
        className="text-2xl font-extrabold mb-1"
        style={{ color: "var(--text)" }}
      >
        {voteCount}
      </div>

      {/* Título */}
      <p
        className="font-bold text-sm leading-snug line-clamp-2 mb-3"
        style={{ color: "var(--text)" }}
      >
        {thread.title}
      </p>

      {/* Rodapé: author · clock · date · comments */}
      <div
        className="flex items-center gap-1.5 text-xs flex-wrap"
        style={{ color: "var(--text-muted)" }}
      >
        <span>{thread.author}</span>
        <span>·</span>
        <Clock size={12} strokeWidth={1.8} />
        <span>{thread.date}</span>
        <span>·</span>
        <MessageSquare size={12} strokeWidth={1.8} />
        <span>{thread.comments}</span>
      </div>
    </Link>
  );
}

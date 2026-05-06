"use client";

import { MessageSquareMore } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { API_BASE_URL } from "@/lib/api";
import type { ForumTopicSummary } from "@/types";
import { VoteButton } from "./VoteButton";

type ForumThreadRowProps = {
  thread: ForumTopicSummary;
};

export function ForumThreadRow({ thread }: ForumThreadRowProps) {
  const [voted, setVoted] = useState(false);
  const [votes, setVotes] = useState(thread.votes);
  const [isVoting, setIsVoting] = useState(false);

  async function handleVote(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();

    if (isVoting) {
      return;
    }

    const nextVoted = !voted;
    const nextVotes = votes + (nextVoted ? 1 : -1);

    setIsVoting(true);
    setVotes(nextVotes);
    setVoted(nextVoted);

    try {
      const response = await fetch(`${API_BASE_URL}/forum/topics/${thread.id}/vote`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ value: "UP" }),
      });

      if (!response.ok) {
        throw new Error();
      }
    } catch {
      setVotes(votes);
      setVoted(voted);
    } finally {
      setIsVoting(false);
    }
  }

  return (
    <Link
      href={`/forum/${thread.slug}`}
      className="flex items-center gap-3.5 py-3.5 border-b rounded-lg px-2.5 transition-colors duration-100"
      style={{ borderColor: "var(--border)" }}
      onMouseEnter={(e) =>
        (e.currentTarget.style.background = "var(--surface-2)")
      }
      onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
    >
      <div className="flex-shrink-0">
        <VoteButton count={votes} voted={voted} onVote={handleVote} />
      </div>

      <div className="flex-1 min-w-0">
        <div
          className="text-[14px] font-medium leading-snug mb-1"
          style={
            { color: "var(--text)", textWrap: "pretty" } as React.CSSProperties
          }
        >
          {thread.title}
        </div>
        <div
          className="text-[12px] flex flex-wrap items-center gap-2"
          style={{ color: "var(--text-light)" }}
        >
          {/* <span className="font-medium" style={{ color: catColor }}>{thread.category}</span> */}
          <span>·</span>
          <span className="font-medium" style={{ color: "var(--accent)" }}>
            {thread.author}
          </span>
          <span>·</span>
          <span>{thread.date}</span>
        </div>
      </div>

      <div
        className="flex-shrink-0 flex items-center gap-1.5 text-[13px]"
        style={{ color: "var(--text-muted)" }}
      >
        <MessageSquareMore size={14} strokeWidth={1.8} />
        {thread.comments}
      </div>
    </Link>
  );
}

"use client";

import Link from "next/link";
import { ChevronLeft, LoaderCircle, MessageSquarePlus } from "lucide-react";
import { useRouter } from "next/navigation";
import { type FormEvent, useState } from "react";
import { MarkdownEditor } from "@/components/MarkdownEditor";
import { MarkdownViewer } from "@/components/MarkdownViewer";
import { VoteButton } from "@/components/VoteButton";
import { useAuthSession } from "@/hooks/use-auth-session";
import { API_BASE_URL } from "@/lib/api";
import type { ForumPost, ForumTopicDetail } from "@/types";

type ThreadDetailClientProps = {
  thread: ForumTopicDetail;
};

const MAX_MARKDOWN_LENGTH = 20_000;

function ForumReplyCard({ post, depth = 0 }: { post: ForumPost; depth?: number }) {
  return (
    <div className={depth > 0 ? "mt-4 ml-4 border-l pl-4" : ""} style={{ borderColor: "var(--border)" }}>
      <article
        className="rounded-2xl border px-5 py-5"
        style={{
          background: "var(--surface)",
          borderColor: "var(--border)",
        }}
      >
        <div
          className="flex flex-wrap items-center gap-2 text-[13px] mb-3"
          style={{ color: "var(--text-muted)" }}
        >
          <span className="font-semibold" style={{ color: "var(--text)" }}>
            {post.author}
          </span>
          <span>•</span>
          <span>{post.date}</span>
        </div>
        <div
          className="[&_p]:text-[15px] [&_p]:leading-7 [&_ul]:pl-5 [&_ol]:pl-5"
          style={{ color: "var(--text)" }}
        >
          <MarkdownViewer value={post.content} />
        </div>
      </article>

      {post.replies.map((reply) => (
        <ForumReplyCard key={reply.id} post={reply} depth={depth + 1} />
      ))}
    </div>
  );
}

export function ThreadDetailClient({ thread }: ThreadDetailClientProps) {
  const router = useRouter();
  const { isCheckingSession, isLoggedIn } = useAuthSession();
  const [voted, setVoted] = useState(false);
  const [votes, setVotes] = useState(thread.votes);
  const [content, setContent] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [isVoting, setIsVoting] = useState(false);

  async function handleVote() {
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

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!content.trim()) {
      setError("Escreva uma resposta antes de publicar.");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const response = await fetch(`${API_BASE_URL}/forum/topics/${thread.id}/posts`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content }),
      });

      const data = (await response.json()) as { message?: string };

      if (!response.ok) {
        throw new Error(data.message ?? "Não foi possível publicar a resposta.");
      }

      setContent("");
      router.refresh();
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Não foi possível publicar a resposta.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="max-w-[1100px] mx-auto px-6 py-10">
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
        <section className="min-w-0">
          <Link
            href="/forum"
            className="inline-flex items-center gap-2 text-[13px] font-semibold mb-5"
            style={{ color: "var(--accent)" }}
          >
            <ChevronLeft size={15} strokeWidth={2.2} />
            Back to forum
          </Link>

          <article
            className="rounded-2xl border p-6 mb-6"
            style={{
              background: "var(--surface)",
              borderColor: "var(--border)",
            }}
          >
            <div className="flex items-start gap-4 mb-5">
              <VoteButton count={votes} voted={voted} onVote={handleVote} />
              <div className="min-w-0">
                <h1
                  className="font-display font-extrabold text-[30px] leading-tight mb-3"
                  style={{ color: "var(--text)", textWrap: "balance" }}
                >
                  {thread.title}
                </h1>
                <div
                  className="flex flex-wrap items-center gap-2 text-[13px]"
                  style={{ color: "var(--text-muted)" }}
                >
                  <span className="font-semibold" style={{ color: "var(--text)" }}>
                    {thread.author}
                  </span>
                  <span>•</span>
                  <span>{thread.date}</span>
                  <span>•</span>
                  <span>{thread.comments} replies</span>
                </div>
              </div>
            </div>

            <div
              className="[&_h1]:font-display [&_h2]:font-display [&_h3]:font-display [&_p]:text-[15px] [&_p]:leading-7 [&_ul]:pl-5 [&_ol]:pl-5"
              style={{ color: "var(--text)" }}
            >
              <MarkdownViewer value={thread.content} />
            </div>
          </article>

          <div className="mb-4 flex items-center justify-between">
            <h2
              className="font-display font-extrabold text-[22px]"
              style={{ color: "var(--text)" }}
            >
              Replies
            </h2>
            <span className="text-[13px]" style={{ color: "var(--text-muted)" }}>
              {thread.comments} total
            </span>
          </div>

          <div className="flex flex-col gap-4">
            {thread.posts.length > 0 ? (
              thread.posts.map((post) => <ForumReplyCard key={post.id} post={post} />)
            ) : (
              <div
                className="rounded-2xl border px-5 py-6"
                style={{
                  background: "var(--surface)",
                  borderColor: "var(--border)",
                }}
              >
                <p className="text-[14px]" style={{ color: "var(--text-muted)" }}>
                  Ainda não há respostas. Seja o primeiro a contribuir.
                </p>
              </div>
            )}
          </div>
        </section>

        <aside className="h-fit">
          {isCheckingSession ? (
            <div
              className="rounded-2xl border px-5 py-6"
              style={{
                background: "var(--surface)",
                borderColor: "var(--border)",
              }}
            >
              <p className="text-[14px]" style={{ color: "var(--text-muted)" }}>
                Loading session...
              </p>
            </div>
          ) : !isLoggedIn ? (
            <div
              className="rounded-2xl border px-5 py-6"
              style={{
                background: "var(--surface)",
                borderColor: "var(--border)",
              }}
            >
              <div className="flex items-center gap-2 mb-3">
                <MessageSquarePlus
                  size={18}
                  strokeWidth={2}
                  style={{ color: "var(--accent)" }}
                />
                <h2
                  className="font-display font-extrabold text-[20px]"
                  style={{ color: "var(--text)" }}
                >
                  Join the discussion
                </h2>
              </div>
              <p className="text-[14px] mb-5" style={{ color: "var(--text-muted)" }}>
                Sign in to publish your own reply in markdown.
              </p>
              <Link
                href="/login"
                className="inline-flex items-center justify-center rounded-lg px-4 py-2 text-[13px] font-semibold text-white"
                style={{ background: "var(--accent)" }}
              >
                Log in
              </Link>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="rounded-2xl border px-5 py-6"
              style={{
                background: "var(--surface)",
                borderColor: "var(--border)",
              }}
            >
              <div className="flex items-center gap-2 mb-4">
                <MessageSquarePlus
                  size={18}
                  strokeWidth={2}
                  style={{ color: "var(--accent)" }}
                />
                <h2
                  className="font-display font-extrabold text-[20px]"
                  style={{ color: "var(--text)" }}
                >
                  Your reply
                </h2>
              </div>

              {error ? (
                <div
                  className="rounded-xl px-4 py-3 mb-4 text-[13px] border"
                  style={{
                    background: "oklch(0.97 0.04 25)",
                    borderColor: "oklch(0.88 0.08 25)",
                    color: "oklch(0.45 0.17 25)",
                  }}
                >
                  {error}
                </div>
              ) : null}

              <MarkdownEditor
                value={content}
                onChange={(value) => setContent(value.slice(0, MAX_MARKDOWN_LENGTH))}
                placeholder="Share your experience, recommendation, or counterpoint..."
                maxLength={MAX_MARKDOWN_LENGTH}
                height={360}
              />
              <p className="mt-2 text-[12px]" style={{ color: "var(--text-light)" }}>
                {content.length}/{MAX_MARKDOWN_LENGTH} characters
              </p>

              <div className="mt-4 flex justify-end">
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-[14px] font-semibold text-white"
                  style={{
                    background: submitting
                      ? "oklch(0.68 0.10 38)"
                      : "var(--accent)",
                  }}
                >
                  {submitting ? (
                    <>
                      <LoaderCircle
                        className="animate-spin"
                        size={16}
                        strokeWidth={2}
                      />
                      Publishing...
                    </>
                  ) : (
                    "Publish reply"
                  )}
                </button>
              </div>
            </form>
          )}
        </aside>
      </div>
    </div>
  );
}

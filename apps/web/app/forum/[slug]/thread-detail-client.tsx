"use client";

import Link from "next/link";
import {
  ChevronLeft,
  LoaderCircle,
  MessageSquarePlus,
  Reply,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { type FormEvent, useOptimistic, useState } from "react";
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
const INLINE_REPLY_MAX_LENGTH = 12_000;

type LocalForumPost = ForumPost & {
  optimistic?: boolean;
  voted?: boolean;
  voteCount?: number;
};

type OptimisticReplyAction =
  | {
      type: "add";
      parentPostId: string;
      reply: LocalForumPost;
    }
  | {
      type: "add-root";
      reply: LocalForumPost;
    }
  | {
      type: "remove";
      replyId: string;
    }
  | {
      type: "vote";
      postId: string;
      voted: boolean;
      voteCount: number;
    };

type ForumReplyCardProps = {
  post: LocalForumPost;
  topicId: string;
  onOptimisticReply(parentPostId: string, content: string): string;
  onRollbackReply(replyId: string): void;
  onVote(post: LocalForumPost): Promise<void>;
  onRequireLogin(): void;
  depth?: number;
};

function insertReplyIntoTree(
  posts: LocalForumPost[],
  parentPostId: string,
  reply: LocalForumPost,
): LocalForumPost[] {
  return posts.map((post) => {
    if (post.id === parentPostId) {
      return {
        ...post,
        replies: [reply, ...post.replies],
      };
    }

    if (post.replies.length === 0) {
      return post;
    }

    return {
      ...post,
      replies: insertReplyIntoTree(post.replies, parentPostId, reply),
    };
  });
}

function removeReplyFromTree(
  posts: LocalForumPost[],
  replyId: string,
): LocalForumPost[] {
  return posts
    .filter((post) => post.id !== replyId)
    .map((post) => ({
      ...post,
      replies: removeReplyFromTree(post.replies, replyId),
    }));
}

function countPostsInTree(posts: LocalForumPost[]): number {
  return posts.reduce(
    (total, post) => total + 1 + countPostsInTree(post.replies),
    0,
  );
}

function updatePostInTree(
  posts: LocalForumPost[],
  postId: string,
  updater: (post: LocalForumPost) => LocalForumPost,
): LocalForumPost[] {
  return posts.map((post) => {
    if (post.id === postId) {
      return updater(post);
    }

    if (post.replies.length === 0) {
      return post;
    }

    return {
      ...post,
      replies: updatePostInTree(post.replies, postId, updater),
    };
  });
}

function buildOptimisticReply({
  replyId,
  topicId,
  author,
  content,
  parentPostId = null,
}: {
  replyId: string;
  topicId: string;
  author: string;
  content: string;
  parentPostId?: string | null;
}): LocalForumPost {
  const now = new Date().toISOString();

  return {
    id: replyId,
    topicId,
    authorId: "current-user",
    parentPostId,
    content,
    upvotes: 0,
    downvotes: 0,
    createdAt: now,
    updatedAt: now,
    author,
    date: "agora",
    replies: [],
    optimistic: true,
  };
}

function ForumReplyComposer({
  topicId,
  postId,
  onOptimisticReply,
  onRollbackReply,
  onRequireLogin,
}: {
  topicId: string;
  postId: string;
  onOptimisticReply(parentPostId: string, content: string): string;
  onRollbackReply(replyId: string): void;
  onRequireLogin(): void;
}) {
  const router = useRouter();
  const { isCheckingSession, isLoggedIn } = useAuthSession();
  const [isOpen, setIsOpen] = useState(false);
  const [content, setContent] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!content.trim()) {
      setError("Escreva uma resposta antes de publicar.");
      return;
    }

    setSubmitting(true);
    setError("");
    const trimmedContent = content.trim();
    const optimisticReplyId = onOptimisticReply(postId, trimmedContent);
    setContent("");
    setIsOpen(false);

    try {
      const response = await fetch(
        `${API_BASE_URL}/forum/topics/${topicId}/posts/${postId}/replies`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ content: trimmedContent }),
        },
      );

      const data = (await response.json()) as { message?: string };

      if (!response.ok) {
        throw new Error(data.message ?? "Não foi possível publicar a resposta.");
      }

      router.refresh();
    } catch (submitError) {
      onRollbackReply(optimisticReplyId);
      setContent(trimmedContent);
      setIsOpen(true);
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Não foi possível publicar a resposta.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (isCheckingSession) {
    return null;
  }

  if (!isOpen) {
    return isLoggedIn ? (
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="mt-3 inline-flex items-center gap-2 rounded-lg px-3 py-2 text-[12px] font-semibold transition-colors duration-150"
        style={{
          background: "var(--surface-2)",
          border: "1px solid var(--border)",
          color: "var(--text-muted)",
        }}
      >
        <Reply size={14} strokeWidth={2} />
        Responder
      </button>
    ) : (
      <button
        type="button"
        onClick={onRequireLogin}
        className="mt-3 inline-flex items-center gap-2 rounded-lg px-3 py-2 text-[12px] font-semibold transition-colors duration-150"
        style={{
          background: "var(--surface-2)",
          border: "1px solid var(--border)",
          color: "var(--text-muted)",
        }}
      >
        <Reply size={14} strokeWidth={2} />
        Entrar para responder
      </button>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-4 rounded-2xl border px-4 py-4"
      style={{
        background: "var(--bg)",
        borderColor: "var(--border)",
      }}
    >
      <div className="flex items-center gap-2 mb-3">
        <Reply size={15} strokeWidth={2} style={{ color: "var(--accent)" }} />
        <h3
          className="font-display font-bold text-[16px]"
          style={{ color: "var(--text)" }}
        >
          Responder
        </h3>
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
        onChange={(value) =>
          setContent(value.slice(0, INLINE_REPLY_MAX_LENGTH))
        }
        placeholder="Escreva sua réplica, complemento ou contraponto..."
        maxLength={INLINE_REPLY_MAX_LENGTH}
        height={260}
      />
      <p className="mt-2 text-[12px]" style={{ color: "var(--text-light)" }}>
        {content.length}/{INLINE_REPLY_MAX_LENGTH} caracteres
      </p>

      <div className="mt-4 flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => {
            setIsOpen(false);
            setError("");
            setContent("");
          }}
          className="inline-flex items-center justify-center rounded-lg px-3 py-2 text-[13px] font-semibold"
          style={{
            background: "var(--surface-2)",
            color: "var(--text-muted)",
          }}
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={submitting}
          className="inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-[13px] font-semibold text-white"
          style={{
            background: submitting ? "oklch(0.68 0.10 38)" : "var(--accent)",
          }}
        >
          {submitting ? (
            <>
              <LoaderCircle className="animate-spin" size={15} strokeWidth={2} />
              Publicando...
            </>
          ) : (
            "Publicar resposta"
          )}
        </button>
      </div>
    </form>
  );
}

function ForumReplyCard({
  post,
  topicId,
  onOptimisticReply,
  onRollbackReply,
  onVote,
  onRequireLogin,
  depth = 0,
}: ForumReplyCardProps) {
  return (
    <div
      className={depth > 0 ? "mt-4 ml-4 border-l pl-4" : ""}
      style={{ borderColor: "var(--border)" }}
    >
      <article
        className="rounded-2xl border px-5 py-5"
        style={{
          background: "var(--surface)",
          borderColor: "var(--border)",
        }}
      >
        <div className="mb-4 flex items-start gap-4">
          <VoteButton
            count={post.voteCount ?? post.upvotes - post.downvotes}
            voted={post.voted ?? false}
            onVote={() => {
              void onVote(post);
            }}
          />
          <div className="min-w-0 flex-1">
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

            {post.optimistic ? (
              <p
                className="mt-3 text-[12px]"
                style={{ color: "var(--text-light)" }}
              >
                Enviando resposta...
              </p>
            ) : null}

            <ForumReplyComposer
              topicId={topicId}
              postId={post.id}
              onOptimisticReply={onOptimisticReply}
              onRollbackReply={onRollbackReply}
              onRequireLogin={onRequireLogin}
            />
          </div>
        </div>
      </article>

      {post.replies.map((reply) => (
        <ForumReplyCard
          key={reply.id}
          post={reply}
          topicId={topicId}
          onOptimisticReply={onOptimisticReply}
          onRollbackReply={onRollbackReply}
          onVote={onVote}
          onRequireLogin={onRequireLogin}
          depth={depth + 1}
        />
      ))}
    </div>
  );
}

export function ThreadDetailClient({ thread }: ThreadDetailClientProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { authUser, isCheckingSession, isLoggedIn } = useAuthSession();
  const [voted, setVoted] = useState(false);
  const [votes, setVotes] = useState(thread.votes);
  const [content, setContent] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [isVoting, setIsVoting] = useState(false);
  const [posts, updatePostsOptimistically] = useOptimistic(
    thread.posts,
    (currentPosts, action: OptimisticReplyAction) => {
      if (action.type === "add-root") {
        return [action.reply, ...currentPosts];
      }

      if (action.type === "add") {
        return insertReplyIntoTree(
          currentPosts,
          action.parentPostId,
          action.reply,
        );
      }

      if (action.type === "vote") {
        return updatePostInTree(currentPosts, action.postId, (post) => ({
          ...post,
          voted: action.voted,
          voteCount: action.voteCount,
        }));
      }

      return removeReplyFromTree(currentPosts, action.replyId);
    },
  );
  const replyCount = countPostsInTree(posts);

  function redirectToLogin() {
    const next = encodeURIComponent(pathname);
    router.push(`/login?next=${next}`);
  }

  function handleOptimisticReply(parentPostId: string, replyContent: string) {
    const optimisticReplyId = `optimistic-${crypto.randomUUID()}`;
    const optimisticReply = buildOptimisticReply({
      replyId: optimisticReplyId,
      topicId: thread.id,
      author: authUser?.username ?? "Você",
      content: replyContent,
      parentPostId,
    });

    updatePostsOptimistically({
      type: "add",
      parentPostId,
      reply: optimisticReply,
    });

    return optimisticReplyId;
  }

  function handleRollbackReply(replyId: string) {
    updatePostsOptimistically({
      type: "remove",
      replyId,
    });
  }

  async function handlePostVote(post: LocalForumPost) {
    if (!isLoggedIn) {
      redirectToLogin();
      return;
    }

    const currentVoted = post.voted ?? false;
    const currentVoteCount = post.voteCount ?? post.upvotes - post.downvotes;
    const nextVoted = !currentVoted;
    const nextVoteCount = currentVoteCount + (nextVoted ? 1 : -1);

    updatePostsOptimistically({
      type: "vote",
      postId: post.id,
      voted: nextVoted,
      voteCount: nextVoteCount,
    });

    try {
      const response = await fetch(`${API_BASE_URL}/forum/posts/${post.id}/vote`, {
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

      router.refresh();
    } catch {
      updatePostsOptimistically({
        type: "vote",
        postId: post.id,
        voted: currentVoted,
        voteCount: currentVoteCount,
      });
    }
  }

  function handleOptimisticRootReply(replyContent: string) {
    const optimisticReplyId = `optimistic-${crypto.randomUUID()}`;
    const optimisticReply = buildOptimisticReply({
      replyId: optimisticReplyId,
      topicId: thread.id,
      author: authUser?.username ?? "Você",
      content: replyContent,
    });

    updatePostsOptimistically({
      type: "add-root",
      reply: optimisticReply,
    });

    return optimisticReplyId;
  }

  async function handleVote() {
    if (!isLoggedIn) {
      redirectToLogin();
      return;
    }

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
    const trimmedContent = content.trim();
    const optimisticReplyId = handleOptimisticRootReply(trimmedContent);
    setContent("");

    try {
      const response = await fetch(`${API_BASE_URL}/forum/topics/${thread.id}/posts`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content: trimmedContent }),
      });

      const data = (await response.json()) as { message?: string };

      if (!response.ok) {
        throw new Error(data.message ?? "Não foi possível publicar a resposta.");
      }

      router.refresh();
    } catch (submitError) {
      handleRollbackReply(optimisticReplyId);
      setContent(trimmedContent);
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
            Voltar para o fórum
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
                  <span>{replyCount} respostas</span>
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
              Respostas
            </h2>
            <span className="text-[13px]" style={{ color: "var(--text-muted)" }}>
              {replyCount} no total
            </span>
          </div>

          <div className="flex flex-col gap-4">
            {posts.length > 0 ? (
              posts.map((post) => (
                <ForumReplyCard
                  key={post.id}
                  post={post}
                  topicId={thread.id}
                  onOptimisticReply={handleOptimisticReply}
                  onRollbackReply={handleRollbackReply}
                  onVote={handlePostVote}
                  onRequireLogin={redirectToLogin}
                />
              ))
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
                Carregando sessão...
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
                  Entre na conversa
                </h2>
              </div>
              <p className="text-[14px] mb-5" style={{ color: "var(--text-muted)" }}>
                Faça login para publicar sua própria resposta em markdown.
              </p>
              <button
                type="button"
                onClick={redirectToLogin}
                className="inline-flex items-center justify-center rounded-lg px-4 py-2 text-[13px] font-semibold text-white"
                style={{ background: "var(--accent)" }}
              >
                Fazer login
              </button>
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
                  Sua resposta
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
                      Publicando...
                    </>
                  ) : (
                    "Publicar resposta"
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

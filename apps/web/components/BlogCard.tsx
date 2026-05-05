import Link from "next/link";
import type { BlogPost } from "@/types";

type BlogCardProps = {
  post: BlogPost;
};

export function BlogCard({ post }: BlogCardProps) {
  return (
    <Link
      href="/"
      className="block rounded-xl border p-4 transition-colors duration-150"
      style={{
        background: "var(--surface)",
        borderColor: "var(--border)",
      }}
    >
      <div
        className="text-[11px] font-semibold uppercase tracking-[0.08em]"
        style={{ color: "var(--accent)" }}
      >
        {post.category}
      </div>
      <div
        className="mt-2 font-display font-bold text-[15px] leading-snug"
        style={
          { color: "var(--text)", textWrap: "pretty" } as React.CSSProperties
        }
      >
        {post.title}
      </div>
      <div
        className="mt-3 flex items-center justify-between text-[12px]"
        style={{ color: "var(--text-light)" }}
      >
        <span>{post.date}</span>
        <span>{post.readTime}</span>
      </div>
    </Link>
  );
}

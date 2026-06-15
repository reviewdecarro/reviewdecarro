import type { ReactNode } from "react";
import Link from "next/link";

type SectionHeaderProps = {
  title: string;
  action?: string;
  href?: string;
  icon?: ReactNode;
};

export function SectionHeader({ title, action, href, icon }: SectionHeaderProps) {
  return (
    <div className="mb-4 flex items-center justify-between">
      <h2
        className="font-display font-extrabold text-[22px] leading-none flex items-center gap-2"
        style={{ color: "var(--text)" }}
      >
        {icon}
        {title}
      </h2>
      {action && href ? (
        <Link
          href={href}
          className="border-none bg-transparent text-[13px] font-medium"
          style={{ color: "var(--accent)" }}
        >
          {action}
        </Link>
      ) : action ? (
        <button
          type="button"
          className="border-none bg-transparent text-[13px] font-medium"
          style={{ color: "var(--accent)" }}
        >
          {action}
        </button>
      ) : null}
    </div>
  );
}

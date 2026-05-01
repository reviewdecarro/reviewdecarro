import Link from "next/link";

export function Footer() {
	return (
		<footer className="border-t mt-auto" style={{ borderColor: "var(--border)", background: "var(--bg)" }}>
			<div className="max-w-[1100px] mx-auto px-6 py-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
				<div>
					<div className="font-display font-extrabold text-[18px]" style={{ color: "var(--text)" }}>
						PapoAuto
					</div>
					<p className="text-[13px]" style={{ color: "var(--text-muted)" }}>
						Car reviews, forum discussions, and community highlights.
					</p>
				</div>
				<div className="flex items-center gap-4 text-[13px]" style={{ color: "var(--text-muted)" }}>
					<Link href="/" className="hover:opacity-80">
						Home
					</Link>
					<Link href="/reviews" className="hover:opacity-80">
						Reviews
					</Link>
					<Link href="/login" className="hover:opacity-80">
						Login
					</Link>
				</div>
			</div>
		</footer>
	);
}

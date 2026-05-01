import type { CSSProperties } from "react";

type CarPlaceholderProps = {
	brand: string;
	model: string;
	segment: string;
	className?: string;
};

const segmentAccent: Record<string, string> = {
	SUV: "oklch(0.60 0.15 165)",
	Sedan: "oklch(0.57 0.17 148)",
	Pickup: "oklch(0.65 0.16 78)",
	EV: "oklch(0.60 0.17 250)",
	Hatchback: "oklch(0.60 0.17 28)",
};

export function CarPlaceholder({
	brand,
	model,
	segment,
	className = "",
}: CarPlaceholderProps) {
	const accent = segmentAccent[segment] ?? "oklch(0.60 0.17 28)";
	const style = {
		"--accent": accent,
	} as CSSProperties;

	return (
		<div
			className={`relative overflow-hidden ${className}`}
			style={{
				...style,
				background:
					"linear-gradient(145deg, color-mix(in oklab, var(--accent) 82%, white) 0%, color-mix(in oklab, var(--accent) 40%, black) 100%)",
			}}
		>
			<div
				className="absolute inset-0 opacity-20"
				style={{
					backgroundImage:
						"radial-gradient(circle at 20% 20%, white 0, transparent 35%), radial-gradient(circle at 80% 0%, white 0, transparent 30%), linear-gradient(135deg, transparent 0 40%, rgba(255,255,255,0.16) 40% 60%, transparent 60% 100%)",
				}}
			/>
			<div className="absolute inset-0 flex items-end p-4">
				<div className="w-full rounded-2xl border border-white/15 bg-black/10 backdrop-blur-[1px] p-4 text-white">
					<div className="text-[12px] uppercase tracking-[0.16em] text-white/70">
						{segment}
					</div>
					<div className="font-display font-extrabold text-[22px] leading-tight mt-1">
						{brand} {model}
					</div>
					<div className="mt-4 h-14 flex items-end justify-center">
						<svg
							width="220"
							height="56"
							viewBox="0 0 220 56"
							fill="none"
							aria-hidden="true"
						>
							<path
								d="M34 35c5-10 14-18 29-18h61c10 0 18 4 23 10l7 8c2 2 4 3 7 3h17c6 0 11 5 11 11v2H20c-6 0-10-5-10-10 0-3 2-5 4-6l20-0Z"
								fill="rgba(255,255,255,0.92)"
							/>
							<path
								d="M82 18h29c8 0 14 3 19 8l4 5H73l9-13Z"
								fill="rgba(255,255,255,0.22)"
							/>
							<circle cx="62" cy="46" r="8" fill="rgba(255,255,255,0.95)" />
							<circle cx="62" cy="46" r="3" fill="rgba(0,0,0,0.24)" />
							<circle cx="160" cy="46" r="8" fill="rgba(255,255,255,0.95)" />
							<circle cx="160" cy="46" r="3" fill="rgba(0,0,0,0.24)" />
						</svg>
					</div>
				</div>
			</div>
		</div>
	);
}

type SectionHeaderProps = {
	title: string;
	action?: string;
};

export function SectionHeader({ title, action }: SectionHeaderProps) {
	return (
		<div className="mb-4 flex items-center justify-between">
			<h2
				className="font-display font-extrabold text-[22px] leading-none"
				style={{ color: "var(--text)" }}
			>
				{title}
			</h2>
			{action ? (
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

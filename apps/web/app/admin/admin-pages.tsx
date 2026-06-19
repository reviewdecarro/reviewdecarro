"use client";

import {
	ArrowLeft,
	CalendarDays,
	ExternalLink,
	LoaderCircle,
	RefreshCw,
	Search,
	Trash2,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { type ReactNode, useEffect, useMemo, useState } from "react";
import {
	deleteAdminForumTopic,
	deleteAdminReview,
	deleteAdminUser,
	fetchAdminForumTopic,
	fetchAdminForumTopics,
	fetchAdminReview,
	fetchAdminReviews,
	fetchAdminSummary,
	fetchAdminUser,
	fetchAdminUsers,
	type AdminForumTopic,
	type AdminListResponse,
	type AdminQuery,
	type AdminReview,
	type AdminSummary,
	type AdminUser,
} from "@/api/admin";

type ResourceKind = "users" | "reviews" | "forum";

type SearchPageProps = {
	initialQuery: string;
	initialPage: number;
	initialLimit: number;
};

type DetailPageProps = {
	id: string;
};

const resourceConfig = {
	users: {
		title: "Usuários",
		description: "Gerencie contas cadastradas e remova usuários quando necessário.",
		listHref: "/admin/users",
		searchPlaceholder: "Buscar por nome ou e-mail...",
		deleteLabel: "Excluir usuário",
	},
	reviews: {
		title: "Avaliações",
		description: "Acompanhe avaliações publicadas pela comunidade.",
		listHref: "/admin/reviews",
		searchPlaceholder: "Buscar por título, conteúdo ou autor...",
		deleteLabel: "Excluir avaliação",
	},
	forum: {
		title: "Fórum",
		description: "Modere tópicos criados no fórum da comunidade.",
		listHref: "/admin/forum",
		searchPlaceholder: "Buscar por título, conteúdo ou autor...",
		deleteLabel: "Excluir tópico",
	},
} satisfies Record<ResourceKind, Record<string, string>>;

export function AdminSummaryPage() {
	const [summary, setSummary] = useState<AdminSummary | null>(null);
	const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");

	useEffect(() => {
		let active = true;

		async function loadSummary() {
			try {
				setStatus("loading");
				const data = await fetchAdminSummary();
				if (active) {
					setSummary(data);
					setStatus("ready");
				}
			} catch {
				if (active) setStatus("error");
			}
		}

		void loadSummary();

		return () => {
			active = false;
		};
	}, []);

	const stats = [
		{
			label: "Usuários",
			value: numberFromSummary(summary, ["users", "totalUsers", "usersCount"]),
			href: "/admin/users",
		},
		{
			label: "Avaliações",
			value: numberFromSummary(summary, [
				"reviews",
				"totalReviews",
				"reviewsCount",
			]),
			href: "/admin/reviews",
		},
		{
			label: "Tópicos do fórum",
			value: numberFromSummary(summary, [
				"forumTopics",
				"topics",
				"totalTopics",
				"topicsCount",
			]),
			href: "/admin/forum",
		},
	];

	return (
		<div className="grid gap-5">
			<PageHeader
				title="Painel de administração"
				description="Resumo operacional do PapoAuto."
			/>

			{status === "error" ? (
				<Notice tone="danger">
					Não foi possível carregar o resumo administrativo.
				</Notice>
			) : null}

			<div className="grid gap-3 sm:grid-cols-3">
				{stats.map((stat) => (
					<Link
						key={stat.label}
						href={stat.href}
						className="rounded-xl border px-5 py-4 transition hover:-translate-y-0.5 hover:shadow-sm"
						style={{
							background: "var(--palette-white)",
							borderColor: "var(--border)",
						}}
					>
						<p className="text-[12px]" style={{ color: "var(--text-muted)" }}>
							{stat.label}
						</p>
						<p
							className="font-display mt-1 text-[30px] font-extrabold"
							style={{ color: "var(--text)" }}
						>
							{status === "loading" ? "..." : stat.value}
						</p>
						<p className="mt-1 text-[12px]" style={{ color: "var(--accent)" }}>
							Abrir gestão
						</p>
					</Link>
				))}
			</div>

			<div
				className="rounded-xl border px-5 py-5"
				style={{
					background: "var(--palette-white)",
					borderColor: "var(--border)",
				}}
			>
				<h2
					className="font-display text-[18px] font-extrabold"
					style={{ color: "var(--text)" }}
				>
					Ações rápidas
				</h2>
				<div className="mt-4 grid gap-3 sm:grid-cols-3">
					<QuickLink href="/admin/users" label="Revisar usuários" />
					<QuickLink href="/admin/reviews" label="Moderar avaliações" />
					<QuickLink href="/admin/forum" label="Moderar fórum" />
				</div>
			</div>
		</div>
	);
}

export function AdminUsersPage(props: SearchPageProps) {
	return (
		<AdminListPage<AdminUser>
			{...props}
			kind="users"
			fetchItems={fetchAdminUsers}
			deleteItem={deleteAdminUser}
			getTitle={(user) => user.username ?? user.email ?? user.id}
			getSubtitle={(user) => user.email ?? formatRoles(user.roles)}
			getMeta={(user) => [
				formatRoles(user.roles),
				formatDate(user.createdAt),
			]}
		/>
	);
}

export function AdminReviewsPage(props: SearchPageProps) {
	return (
		<AdminListPage<AdminReview>
			{...props}
			kind="reviews"
			fetchItems={fetchAdminReviews}
			deleteItem={deleteAdminReview}
			getTitle={(review) => review.title ?? review.slug ?? review.id}
			getSubtitle={(review) => review.author?.username ?? "Autor não informado"}
			getMeta={(review) => [
				typeof review.score === "number" ? `Nota ${review.score}` : "",
				typeof review.commentsCount === "number"
					? `${review.commentsCount} comentários`
					: "",
				formatDate(review.createdAt),
			]}
		/>
	);
}

export function AdminForumPage(props: SearchPageProps) {
	return (
		<AdminListPage<AdminForumTopic>
			{...props}
			kind="forum"
			fetchItems={fetchAdminForumTopics}
			deleteItem={deleteAdminForumTopic}
			getTitle={(topic) => topic.title ?? topic.slug ?? topic.id}
			getSubtitle={(topic) => topic.author?.username ?? "Autor não informado"}
			getMeta={(topic) => [
				typeof topic.postsCount === "number"
					? `${topic.postsCount} respostas`
					: "",
				formatDate(topic.createdAt),
			]}
		/>
	);
}

export function AdminUserDetailPage({ id }: DetailPageProps) {
	return (
		<AdminDetailPage<AdminUser>
			id={id}
			kind="users"
			fetchItem={fetchAdminUser}
			deleteItem={deleteAdminUser}
			getTitle={(user) => user.username ?? user.email ?? user.id}
			getSubtitle={(user) => user.email ?? formatRoles(user.roles)}
			publicHref={() => null}
			highlights={(user) => [
				{ label: "E-mail", value: user.email ?? "-" },
				{ label: "Perfis", value: formatRoles(user.roles) || "-" },
				{
					label: "Avaliações",
					value:
						typeof user.metrics?.reviewsCount === "number"
							? String(user.metrics.reviewsCount)
							: "-",
				},
				{
					label: "Tópicos",
					value:
						typeof user.metrics?.forumTopicsCount === "number"
							? String(user.metrics.forumTopicsCount)
							: "-",
				},
				{ label: "Criado em", value: formatDate(user.createdAt) || "-" },
			]}
		/>
	);
}

export function AdminReviewDetailPage({ id }: DetailPageProps) {
	return (
		<AdminDetailPage<AdminReview>
			id={id}
			kind="reviews"
			fetchItem={fetchAdminReview}
			deleteItem={deleteAdminReview}
			getTitle={(review) => review.title ?? review.slug ?? review.id}
			getSubtitle={(review) => review.author?.username ?? "Autor não informado"}
			publicHref={(review) => (review.slug ? `/reviews/${review.slug}` : null)}
			highlights={(review) => [
				{ label: "Autor", value: review.author?.username ?? "-" },
				{
					label: "Nota",
					value: typeof review.score === "number" ? String(review.score) : "-",
				},
				{
					label: "Comentários",
					value:
						typeof review.metrics?.commentsCount === "number"
							? String(review.metrics.commentsCount)
							: "-",
				},
				{ label: "Criada em", value: formatDate(review.createdAt) || "-" },
			]}
		/>
	);
}

export function AdminForumDetailPage({ id }: DetailPageProps) {
	return (
		<AdminDetailPage<AdminForumTopic>
			id={id}
			kind="forum"
			fetchItem={fetchAdminForumTopic}
			deleteItem={deleteAdminForumTopic}
			getTitle={(topic) => topic.title ?? topic.slug ?? topic.id}
			getSubtitle={(topic) => topic.author?.username ?? "Autor não informado"}
			publicHref={(topic) => (topic.slug ? `/forum/${topic.slug}` : null)}
			highlights={(topic) => [
				{ label: "Autor", value: topic.author?.username ?? "-" },
				{
					label: "Respostas",
					value: String(topic.metrics?.postsCount ?? topic.postsCount ?? "-"),
				},
				{
					label: "Votos",
					value:
						typeof topic.metrics?.upvotes === "number" &&
						typeof topic.metrics?.downvotes === "number"
							? `${topic.metrics.upvotes} / ${topic.metrics.downvotes}`
							: "-",
				},
				{ label: "Criado em", value: formatDate(topic.createdAt) || "-" },
			]}
		/>
	);
}

type AdminListPageProps<T extends { id: string }> = SearchPageProps & {
	kind: ResourceKind;
	fetchItems(query: AdminQuery): Promise<AdminListResponse<T>>;
	deleteItem(id: string): Promise<void>;
	getTitle(item: T): string;
	getSubtitle(item: T): string;
	getMeta(item: T): string[];
};

function AdminListPage<T extends { id: string }>({
	initialQuery,
	initialPage,
	initialLimit,
	kind,
	fetchItems,
	deleteItem,
	getTitle,
	getSubtitle,
	getMeta,
}: AdminListPageProps<T>) {
	const config = resourceConfig[kind];
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();
	const [result, setResult] = useState<AdminListResponse<T> | null>(null);
	const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
	const [deletingId, setDeletingId] = useState<string | null>(null);

	const queryKey = useMemo(
		() => `${initialQuery}:${initialPage}:${initialLimit}`,
		[initialQuery, initialPage, initialLimit],
	);

	useEffect(() => {
		let active = true;

		async function loadItems() {
			try {
				setStatus("loading");
				const data = await fetchItems({
					q: initialQuery,
					page: initialPage,
					limit: initialLimit,
				});
				if (active) {
					setResult(data);
					setStatus("ready");
				}
			} catch {
				if (active) setStatus("error");
			}
		}

		void loadItems();

		return () => {
			active = false;
		};
	}, [fetchItems, initialLimit, initialPage, initialQuery, queryKey]);

	function updateUrl(next: { q?: string; page?: number; limit?: number }) {
		const params = new URLSearchParams(searchParams.toString());
		const nextQuery = next.q ?? initialQuery;
		const nextPage = next.page ?? initialPage;
		const nextLimit = next.limit ?? initialLimit;

		if (nextQuery.trim()) params.set("q", nextQuery.trim());
		else params.delete("q");
		if (nextPage > 1) params.set("page", String(nextPage));
		else params.delete("page");
		params.set("limit", String(nextLimit));

		router.replace(`${pathname}?${params.toString()}`, { scroll: false });
	}

	async function handleDelete(item: T) {
		if (!window.confirm(`Excluir "${getTitle(item)}"? Esta ação não pode ser desfeita.`)) {
			return;
		}

		try {
			setDeletingId(item.id);
			await deleteItem(item.id);
			setResult((current) =>
				current
					? {
							...current,
							items: current.items.filter((candidate) => candidate.id !== item.id),
							total: Math.max(0, current.total - 1),
						}
					: current,
			);
			router.refresh();
		} finally {
			setDeletingId(null);
		}
	}

	return (
		<div className="grid gap-5">
			<PageHeader title={config.title} description={config.description} />
			<SearchToolbar
				initialQuery={initialQuery}
				initialLimit={initialLimit}
				placeholder={config.searchPlaceholder}
				onSubmit={(q) => updateUrl({ q, page: 1 })}
				onLimitChange={(limit) => updateUrl({ limit, page: 1 })}
			/>

			{status === "error" ? (
				<Notice tone="danger">Não foi possível carregar os dados.</Notice>
			) : null}

			<div
				className="overflow-hidden rounded-xl border"
				style={{
					background: "var(--palette-white)",
					borderColor: "var(--border)",
				}}
			>
				<div className="border-b px-4 py-3" style={{ borderColor: "var(--border)" }}>
					<p className="text-[13px]" style={{ color: "var(--text-muted)" }}>
						{status === "loading"
							? "Carregando..."
							: `${result?.total ?? 0} registros encontrados`}
					</p>
				</div>

				{status === "loading" ? (
					<LoadingBlock />
				) : result?.items.length ? (
					<div className="divide-y" style={{ borderColor: "var(--border)" }}>
						{result.items.map((item) => (
							<div
								key={item.id}
								className="grid gap-3 px-4 py-4 md:grid-cols-[minmax(0,1fr)_auto]"
							>
								<div className="min-w-0">
									<Link
										href={`${config.listHref}/${item.id}`}
										className="font-semibold hover:underline"
										style={{ color: "var(--text)" }}
									>
										{getTitle(item)}
									</Link>
									<p
										className="mt-1 truncate text-[13px]"
										style={{ color: "var(--text-muted)" }}
									>
										{getSubtitle(item)}
									</p>
									<div className="mt-2 flex flex-wrap gap-2">
										{getMeta(item)
											.filter(Boolean)
											.map((meta) => (
												<span
													key={meta}
													className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-[12px]"
													style={{
														background: "var(--surface)",
														color: "var(--text-muted)",
													}}
												>
													<CalendarDays size={12} strokeWidth={1.8} />
													{meta}
												</span>
											))}
									</div>
								</div>
								<div className="flex items-center gap-2 md:justify-end">
									<Link
										href={`${config.listHref}/${item.id}`}
										className="rounded-lg border px-3 py-2 text-[13px] font-semibold"
										style={{
											borderColor: "var(--border)",
											color: "var(--text)",
										}}
									>
										Detalhes
									</Link>
									<button
										type="button"
										disabled={deletingId === item.id}
										onClick={() => void handleDelete(item)}
										className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-[13px] font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
										style={{ background: "var(--danger)" }}
									>
										{deletingId === item.id ? (
											<LoaderCircle size={14} className="animate-spin" />
										) : (
											<Trash2 size={14} />
										)}
										Excluir
									</button>
								</div>
							</div>
						))}
					</div>
				) : (
					<EmptyBlock>Nenhum registro encontrado.</EmptyBlock>
				)}
			</div>

			{result ? (
				<Pagination
					page={result.page}
					totalPages={result.totalPages}
					onPageChange={(page) => updateUrl({ page })}
				/>
			) : null}
		</div>
	);
}

type AdminDetailPageProps<T extends { id: string }> = {
	id: string;
	kind: ResourceKind;
	fetchItem(id: string): Promise<T | null>;
	deleteItem(id: string): Promise<void>;
	getTitle(item: T): string;
	getSubtitle(item: T): string;
	publicHref(item: T): string | null;
	highlights(item: T): Array<{ label: string; value: string }>;
};

function AdminDetailPage<T extends { id: string }>({
	id,
	kind,
	fetchItem,
	deleteItem,
	getTitle,
	getSubtitle,
	publicHref,
	highlights,
}: AdminDetailPageProps<T>) {
	const config = resourceConfig[kind];
	const router = useRouter();
	const [item, setItem] = useState<T | null>(null);
	const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
	const [isDeleting, setIsDeleting] = useState(false);

	useEffect(() => {
		let active = true;

		async function loadItem() {
			try {
				setStatus("loading");
				const data = await fetchItem(id);
				if (active) {
					setItem(data);
					setStatus(data ? "ready" : "error");
				}
			} catch {
				if (active) setStatus("error");
			}
		}

		void loadItem();

		return () => {
			active = false;
		};
	}, [fetchItem, id]);

	async function handleDelete() {
		if (!item) return;
		if (!window.confirm(`Excluir "${getTitle(item)}"? Esta ação não pode ser desfeita.`)) {
			return;
		}

		try {
			setIsDeleting(true);
			await deleteItem(item.id);
			router.push(config.listHref);
			router.refresh();
		} finally {
			setIsDeleting(false);
		}
	}

	const href = item ? publicHref(item) : null;

	return (
		<div className="grid gap-5">
			<div>
				<Link
					href={config.listHref}
					className="inline-flex items-center gap-1.5 text-[13px] font-semibold"
					style={{ color: "var(--accent)" }}
				>
					<ArrowLeft size={14} />
					Voltar
				</Link>
			</div>

			{status === "loading" ? <LoadingBlock /> : null}

			{status === "error" ? (
				<Notice tone="danger">Registro não encontrado ou indisponível.</Notice>
			) : null}

			{item ? (
				<>
					<div
						className="rounded-xl border px-5 py-5"
						style={{
							background: "var(--palette-white)",
							borderColor: "var(--border)",
						}}
					>
						<div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_auto]">
							<div className="min-w-0">
								<h1
									className="font-display text-[28px] font-extrabold leading-tight"
									style={{ color: "var(--text)" }}
								>
									{getTitle(item)}
								</h1>
								<p
									className="mt-1 text-[14px]"
									style={{ color: "var(--text-muted)" }}
								>
									{getSubtitle(item)}
								</p>
							</div>
							<div className="flex flex-wrap items-start gap-2 md:justify-end">
								{href ? (
									<Link
										href={href}
										className="inline-flex items-center gap-1.5 rounded-lg border px-3 py-2 text-[13px] font-semibold"
										style={{
											borderColor: "var(--border)",
											color: "var(--text)",
										}}
									>
										<ExternalLink size={14} />
										Ver público
									</Link>
								) : null}
								<button
									type="button"
									disabled={isDeleting}
									onClick={() => void handleDelete()}
									className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-[13px] font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
									style={{ background: "var(--danger)" }}
								>
									{isDeleting ? (
										<LoaderCircle size={14} className="animate-spin" />
									) : (
										<Trash2 size={14} />
									)}
									{config.deleteLabel}
								</button>
							</div>
						</div>
					</div>

					<div className="grid gap-3 sm:grid-cols-3">
						{highlights(item).map((highlight) => (
							<div
								key={highlight.label}
								className="rounded-xl border px-4 py-3"
								style={{
									background: "var(--palette-white)",
									borderColor: "var(--border)",
								}}
							>
								<p
									className="text-[12px]"
									style={{ color: "var(--text-muted)" }}
								>
									{highlight.label}
								</p>
								<p
									className="mt-1 truncate text-[15px] font-semibold"
									style={{ color: "var(--text)" }}
								>
									{highlight.value}
								</p>
							</div>
						))}
					</div>

					<div
						className="rounded-xl border px-5 py-5"
						style={{
							background: "var(--palette-white)",
							borderColor: "var(--border)",
						}}
					>
						<h2
							className="font-display text-[18px] font-extrabold"
							style={{ color: "var(--text)" }}
						>
							Dados
						</h2>
						<div className="mt-4 grid gap-3">
							{Object.entries(item).map(([key, value]) => (
								<div
									key={key}
									className="grid gap-1 rounded-lg px-3 py-2 sm:grid-cols-[180px_minmax(0,1fr)]"
									style={{ background: "var(--surface)" }}
								>
									<p
										className="text-[12px] font-semibold"
										style={{ color: "var(--text-muted)" }}
									>
										{key}
									</p>
									<p
										className="min-w-0 break-words text-[13px]"
										style={{ color: "var(--text)" }}
									>
										{formatUnknown(value)}
									</p>
								</div>
							))}
						</div>
					</div>
				</>
			) : null}
		</div>
	);
}

function PageHeader({
	title,
	description,
}: {
	title: string;
	description: string;
}) {
	return (
		<div>
			<h1
				className="font-display text-[28px] font-extrabold leading-tight"
				style={{ color: "var(--text)" }}
			>
				{title}
			</h1>
			<p className="mt-1 text-[14px]" style={{ color: "var(--text-muted)" }}>
				{description}
			</p>
		</div>
	);
}

function SearchToolbar({
	initialQuery,
	initialLimit,
	placeholder,
	onSubmit,
	onLimitChange,
}: {
	initialQuery: string;
	initialLimit: number;
	placeholder: string;
	onSubmit(query: string): void;
	onLimitChange(limit: number): void;
}) {
	return (
		<form
			key={initialQuery}
			className="grid gap-3 rounded-xl border p-3 md:grid-cols-[minmax(0,1fr)_auto]"
			style={{
				background: "var(--palette-white)",
				borderColor: "var(--border)",
			}}
			onSubmit={(event) => {
				event.preventDefault();
				const formData = new FormData(event.currentTarget);
				onSubmit(String(formData.get("q") ?? ""));
			}}
		>
			<label className="relative block">
				<Search
					size={16}
					className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2"
					style={{ color: "var(--text-muted)" }}
				/>
				<input
					name="q"
					defaultValue={initialQuery}
					placeholder={placeholder}
					className="h-11 w-full rounded-lg border bg-white pl-9 pr-3 text-[14px] outline-none"
					style={{
						borderColor: "var(--border)",
						color: "var(--text)",
					}}
				/>
			</label>
			<div className="flex flex-wrap gap-2">
				<select
					value={initialLimit}
					onChange={(event) => onLimitChange(Number(event.target.value))}
					className="h-11 rounded-lg border bg-white px-3 text-[14px]"
					style={{
						borderColor: "var(--border)",
						color: "var(--text)",
					}}
					aria-label="Registros por página"
				>
					<option value={10}>10 por página</option>
					<option value={20}>20 por página</option>
					<option value={50}>50 por página</option>
				</select>
				<button
					type="submit"
					className="inline-flex h-11 items-center gap-2 rounded-lg px-4 text-[14px] font-semibold text-white"
					style={{ background: "var(--accent)" }}
				>
					<Search size={16} />
					Buscar
				</button>
			</div>
		</form>
	);
}

function Pagination({
	page,
	totalPages,
	onPageChange,
}: {
	page: number;
	totalPages: number;
	onPageChange(page: number): void;
}) {
	if (totalPages <= 1) return null;

	return (
		<div className="flex flex-wrap items-center justify-end gap-2">
			<button
				type="button"
				disabled={page <= 1}
				onClick={() => onPageChange(page - 1)}
				className="rounded-lg border bg-white px-3 py-2 text-[13px] font-semibold disabled:cursor-not-allowed disabled:opacity-50"
				style={{ borderColor: "var(--border)", color: "var(--text)" }}
			>
				Anterior
			</button>
			<span className="text-[13px]" style={{ color: "var(--text-muted)" }}>
				Página {page} de {totalPages}
			</span>
			<button
				type="button"
				disabled={page >= totalPages}
				onClick={() => onPageChange(page + 1)}
				className="rounded-lg border bg-white px-3 py-2 text-[13px] font-semibold disabled:cursor-not-allowed disabled:opacity-50"
				style={{ borderColor: "var(--border)", color: "var(--text)" }}
			>
				Próxima
			</button>
		</div>
	);
}

function QuickLink({ href, label }: { href: string; label: string }) {
	return (
		<Link
			href={href}
			className="flex items-center justify-between rounded-lg border px-4 py-3 text-[14px] font-semibold"
			style={{
				borderColor: "var(--border)",
				color: "var(--text)",
			}}
		>
			{label}
			<ExternalLink size={15} style={{ color: "var(--accent)" }} />
		</Link>
	);
}

function Notice({
	children,
	tone,
}: {
	children: ReactNode;
	tone: "danger" | "neutral";
}) {
	return (
		<div
			className="rounded-xl border px-4 py-3 text-[14px]"
			style={{
				background: tone === "danger" ? "rgba(239,68,68,0.08)" : "var(--palette-white)",
				borderColor: tone === "danger" ? "var(--danger)" : "var(--border)",
				color: tone === "danger" ? "var(--danger)" : "var(--text-muted)",
			}}
		>
			{children}
		</div>
	);
}

function LoadingBlock() {
	return (
		<div
			className="flex items-center gap-2 rounded-xl border px-5 py-6 text-[14px]"
			style={{
				background: "var(--palette-white)",
				borderColor: "var(--border)",
				color: "var(--text-muted)",
			}}
		>
			<LoaderCircle size={16} className="animate-spin" />
			Carregando...
		</div>
	);
}

function EmptyBlock({ children }: { children: ReactNode }) {
	return (
		<div className="px-5 py-8 text-center text-[14px]" style={{ color: "var(--text-muted)" }}>
			<RefreshCw size={18} className="mx-auto mb-2 opacity-60" />
			{children}
		</div>
	);
}

function numberFromSummary(summary: AdminSummary | null, keys: string[]) {
	if (!summary) return "...";

	for (const key of keys) {
		const value = summary[key as keyof AdminSummary];
		if (typeof value === "number") return value.toLocaleString("pt-BR");
	}

	return "0";
}

function formatRoles(roles: AdminUser["roles"]) {
	if (!roles?.length) return "";

	return roles
		.map((role) => role)
		.filter(Boolean)
		.join(", ");
}

function formatDate(value: unknown) {
	if (typeof value !== "string") return "";

	const date = new Date(value);
	if (Number.isNaN(date.getTime())) return "";

	return new Intl.DateTimeFormat("pt-BR", {
		day: "2-digit",
		month: "short",
		year: "numeric",
		hour: "2-digit",
		minute: "2-digit",
	}).format(date);
}

function formatUnknown(value: unknown): string {
	if (value === null || value === undefined) return "-";
	if (typeof value === "string") return value;
	if (typeof value === "number" || typeof value === "boolean") return String(value);

	try {
		return JSON.stringify(value, null, 2);
	} catch {
		return String(value);
	}
}

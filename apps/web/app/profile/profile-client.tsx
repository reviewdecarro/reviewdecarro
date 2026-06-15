"use client";

import {
	FileText,
	LayoutGrid,
	LoaderCircle,
	Mail,
	MessageSquareMore,
	PenLine,
	Star,
	UserRound,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { startTransition, useEffect, useMemo, useState } from "react";
import { API_BASE_URL } from "@/api/api";
import { fetchPublicReviews } from "@/api/reviews";
import { MarkdownViewer } from "@/components/MarkdownViewer";
import { ReviewCard } from "@/components/ReviewCard";
import { useAuthSession } from "@/hooks/use-auth-session";
import type { ForumComment, PublicReview, Thread } from "@/types";

type ProfileTab = "resumo" | "avaliacoes" | "forum" | "comentarios";

const tabs: Array<{ id: ProfileTab; label: string; icon: typeof LayoutGrid }> =
	[
		{ id: "resumo", label: "Resumo", icon: LayoutGrid },
		{ id: "avaliacoes", label: "Avaliações", icon: Star },
		{ id: "forum", label: "Fórum", icon: MessageSquareMore },
		{ id: "comentarios", label: "Comentários", icon: FileText },
	];

function getInitials(username: string) {
	return username
		.split(/[^a-zA-Z0-9]+/)
		.filter(Boolean)
		.slice(0, 2)
		.map((part) => part[0]?.toUpperCase() ?? "")
		.join("")
		.slice(0, 2);
}

function formatScore(score: number) {
	return score.toFixed(1);
}

export function ProfileClient() {
	const router = useRouter();
	const { authUser, isCheckingSession, isLoggedIn, removeAuthUser } =
		useAuthSession();
	const [activeTab, setActiveTab] = useState<ProfileTab>("resumo");
	const [liveReviews, setLiveReviews] = useState<PublicReview[]>([]);
	const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
	const [deleteConfirmation, setDeleteConfirmation] = useState("");
	const [deleteError, setDeleteError] = useState("");
	const [isDeletingAccount, setIsDeletingAccount] = useState(false);

	const userHandle = authUser?.username ?? "";

	useEffect(() => {
		let active = true;

		async function loadUserReviews() {
			if (!userHandle) {
				if (active) {
					setLiveReviews([]);
				}
				return;
			}

			const items = await fetchPublicReviews();
			const normalizedHandle = userHandle.trim().toLowerCase();

			if (active) {
				setLiveReviews(
					items.filter(
						(review) => review.author.trim().toLowerCase() === normalizedHandle,
					),
				);
			}
		}

		void loadUserReviews();

		return () => {
			active = false;
		};
	}, [userHandle]);

	const userReviews = liveReviews;
	const userThreads: Thread[] = [];
	const userComments: ForumComment[] = [];
	const averageScore = useMemo(() => {
		if (!userReviews.length) return 0;

		return (
			userReviews.reduce((sum, review) => sum + review.score, 0) /
			userReviews.length
		);
	}, [userReviews]);

	const recentReview = userReviews[0] ?? null;
	const recentThread = userThreads[0] ?? null;
	const recentComment = userComments[0] ?? null;
	const recentReviewHref = recentReview?.slug
		? `/reviews/${recentReview.slug}`
		: null;
	const isDeleteConfirmationValid =
		deleteConfirmation.trim() === authUser?.username;

	async function handleDeleteAccount() {
		if (!authUser) {
			return;
		}

		if (!isDeleteConfirmationValid) {
			setDeleteError(`Digite ${authUser.username} para confirmar a exclusão.`);
			return;
		}

		setDeleteError("");
		setIsDeletingAccount(true);

		try {
			const response = await fetch(`${API_BASE_URL}/users`, {
				method: "DELETE",
				credentials: "include",
			});

			if (!response.ok) {
				let message = "Não foi possível excluir sua conta agora.";
				const contentType = response.headers.get("content-type") ?? "";

				if (contentType.includes("application/json")) {
					const data = (await response.json()) as { message?: string };
					message = data.message ?? message;
				}

				throw new Error(message);
			}

			removeAuthUser();
			startTransition(() => {
				router.push("/");
			});
		} catch (deleteAccountError) {
			setDeleteError(
				deleteAccountError instanceof Error
					? deleteAccountError.message
					: "Não foi possível excluir sua conta agora.",
			);
		} finally {
			setIsDeletingAccount(false);
		}
	}

	if (isCheckingSession) {
		return (
			<div
				className="rounded-2xl border p-6 text-[14px]"
				style={{
					background: "var(--surface)",
					borderColor: "var(--border)",
					color: "var(--text-muted)",
				}}
			>
				<LoaderCircle size={16} className="mr-2 inline animate-spin" />
				Validando sua sessão...
			</div>
		);
	}

	if (!isLoggedIn || !authUser) {
		return (
			<div
				className="rounded-2xl border p-6"
				style={{
					background: "var(--surface)",
					borderColor: "var(--border)",
				}}
			>
				<div className="flex items-start gap-3">
					<div
						className="flex h-10 w-10 items-center justify-center rounded-xl"
						style={{
							background: "var(--accent-light)",
							color: "var(--accent)",
						}}
					>
						<UserRound size={18} strokeWidth={2} />
					</div>
					<div className="min-w-0">
						<h2
							className="text-[16px] font-semibold"
							style={{ color: "var(--text)" }}
						>
							Acesse sua conta para ver seu perfil
						</h2>
						<p
							className="mt-1 text-[14px]"
							style={{ color: "var(--text-muted)" }}
						>
							Seus dados, avaliações, publicações e comentários aparecem aqui
							após o login.
						</p>
						<Link
							href="/login"
							className="mt-4 inline-flex items-center gap-2 rounded-lg px-4 py-2 text-[14px] font-semibold text-white"
							style={{ background: "var(--accent)" }}
						>
							Entrar
						</Link>
					</div>
				</div>
			</div>
		);
	}

	const hasContent =
		userReviews.length || userThreads.length || userComments.length;

	return (
		<div className="grid gap-6">
			<section
				className="rounded-2xl border p-6"
				style={{
					background: "var(--surface)",
					borderColor: "var(--border)",
				}}
			>
				<div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
					<div className="flex items-start gap-4">
						<div
							className="flex h-16 w-16 items-center justify-center rounded-2xl text-[18px] font-bold"
							style={{
								background: "var(--accent-light)",
								color: "var(--accent)",
							}}
						>
							{getInitials(authUser.username) || "U"}
						</div>
						<div className="min-w-0">
							<p
								className="text-[12px] font-semibold uppercase tracking-wide"
								style={{ color: "var(--text-muted)" }}
							>
								Seu perfil
							</p>
							<h1
								className="mt-1 text-[28px] font-display font-extrabold leading-tight"
								style={{ color: "var(--text)" }}
							>
								{authUser.username}
							</h1>
							<p
								className="mt-2 flex flex-wrap items-center gap-2 text-[14px]"
								style={{ color: "var(--text-muted)" }}
							>
								<Mail size={14} strokeWidth={2} />
								{authUser.email}
							</p>
						</div>
					</div>

					<div className="flex flex-wrap gap-3">
						<Link
							href="/reviews/new"
							className="inline-flex items-center gap-2 rounded-lg px-4 py-2 text-[14px] font-semibold text-white"
							style={{ background: "var(--accent)" }}
						>
							<PenLine size={16} strokeWidth={2} />
							Nova avaliação
						</Link>
					</div>
				</div>

				<div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
					{[
						{ label: "Avaliações", value: userReviews.length },
						{ label: "Publicações", value: userThreads.length },
						{ label: "Comentários", value: userComments.length },
						{
							label: "Média",
							value: userReviews.length ? formatScore(averageScore) : "0.0",
						},
					].map((item) => (
						<div
							key={item.label}
							className="rounded-xl border px-4 py-3"
							style={{
								background: "var(--bg)",
								borderColor: "var(--border)",
							}}
						>
							<p className="text-[12px]" style={{ color: "var(--text-muted)" }}>
								{item.label}
							</p>
							<p
								className="mt-1 text-[22px] font-display font-extrabold"
								style={{ color: "var(--text)" }}
							>
								{item.value}
							</p>
						</div>
					))}
				</div>
			</section>

			<section
				className="grid gap-3 rounded-2xl border p-2"
				style={{ background: "var(--surface)", borderColor: "var(--border)" }}
			>
				<div className="flex flex-wrap gap-2">
					{tabs.map((tab) => {
						const Icon = tab.icon;
						const active = activeTab === tab.id;

						return (
							<button
								key={tab.id}
								type="button"
								onClick={() => setActiveTab(tab.id)}
								className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-[14px] font-semibold"
								style={{
									background: active ? "var(--accent)" : "var(--surface-2)",
									color: active ? "white" : "var(--text-muted)",
								}}
							>
								<Icon size={16} strokeWidth={2} />
								{tab.label}
							</button>
						);
					})}
				</div>
			</section>

			{activeTab === "resumo" && (
				<section className="grid gap-4 lg:grid-cols-3">
					<div
						className="rounded-2xl border p-5"
						style={{
							background: "var(--surface)",
							borderColor: "var(--border)",
						}}
					>
						<h2
							className="text-[16px] font-semibold"
							style={{ color: "var(--text)" }}
						>
							Última avaliação
						</h2>
						{recentReview ? (
							recentReviewHref ? (
								<Link
									href={recentReviewHref}
									className="mt-4 grid gap-2 rounded-xl border px-4 py-4 transition-all hover:-translate-y-0.5 hover:shadow-sm"
									style={{
										background: "var(--bg)",
										borderColor: "var(--border)",
									}}
								>
									<p
										className="text-[14px] font-medium"
										style={{ color: "var(--text)" }}
									>
										{recentReview.title}
									</p>
									<p
										className="text-[13px]"
										style={{ color: "var(--text-muted)" }}
									>
										{recentReview.vehicle
											? `${recentReview.vehicle.brand} ${recentReview.vehicle.model} ${recentReview.vehicle.year}`
											: "Avaliação publicada"}{" "}
										• {recentReview.date}
									</p>
								</Link>
							) : (
								<div className="mt-4 grid gap-2">
									<p
										className="text-[14px] font-medium"
										style={{ color: "var(--text)" }}
									>
										{recentReview.title}
									</p>
									<p
										className="text-[13px]"
										style={{ color: "var(--text-muted)" }}
									>
										{recentReview.vehicle
											? `${recentReview.vehicle.brand} ${recentReview.vehicle.model} ${recentReview.vehicle.year}`
											: "Avaliação publicada"}{" "}
										• {recentReview.date}
									</p>
								</div>
							)
						) : (
							<p
								className="mt-3 text-[14px]"
								style={{ color: "var(--text-muted)" }}
							>
								Você ainda não publicou avaliações.
							</p>
						)}
					</div>

					<div
						className="rounded-2xl border p-5"
						style={{
							background: "var(--surface)",
							borderColor: "var(--border)",
						}}
					>
						<h2
							className="text-[16px] font-semibold"
							style={{ color: "var(--text)" }}
						>
							Última publicação
						</h2>
						{recentThread ? (
							<div className="mt-4 grid gap-2">
								<p
									className="text-[14px] font-medium"
									style={{ color: "var(--text)" }}
								>
									{recentThread.title}
								</p>
								<p
									className="text-[13px]"
									style={{ color: "var(--text-muted)" }}
								>
									{recentThread.comments} comentários • {recentThread.votes}{" "}
									votos
								</p>
							</div>
						) : (
							<p
								className="mt-3 text-[14px]"
								style={{ color: "var(--text-muted)" }}
							>
								Você ainda não publicou no fórum.
							</p>
						)}
					</div>

					<div
						className="rounded-2xl border p-5"
						style={{
							background: "var(--surface)",
							borderColor: "var(--border)",
						}}
					>
						<h2
							className="text-[16px] font-semibold"
							style={{ color: "var(--text)" }}
						>
							Último comentário
						</h2>
						{recentComment ? (
							<div className="mt-4 grid gap-2">
								<p className="text-[14px]" style={{ color: "var(--text)" }}>
									{recentComment.body}
								</p>
								<p
									className="text-[13px]"
									style={{ color: "var(--text-muted)" }}
								>
									{recentComment.contextType === "review"
										? "Avaliação"
										: "Fórum"}{" "}
									• {recentComment.contextTitle}
								</p>
							</div>
						) : (
							<p
								className="mt-3 text-[14px]"
								style={{ color: "var(--text-muted)" }}
							>
								Você ainda não comentou.
							</p>
						)}
					</div>
				</section>
			)}

			{activeTab === "avaliacoes" && (
				<section className="grid gap-4">
					<h2
						className="text-[16px] font-semibold"
						style={{ color: "var(--text)" }}
					>
						Suas avaliações
					</h2>
					{userReviews.length ? (
						<div className="grid gap-4 md:grid-cols-2">
							{userReviews.map((review) => {
								return <ReviewCard key={review.id} review={review} compact />;
							})}
						</div>
					) : (
						<div
							className="rounded-2xl border p-5"
							style={{
								background: "var(--surface)",
								borderColor: "var(--border)",
							}}
						>
							<p className="text-[14px]" style={{ color: "var(--text-muted)" }}>
								Sem avaliações publicadas ainda.
							</p>
							<Link
								href="/reviews/new"
								className="mt-4 inline-flex items-center gap-2 rounded-lg px-4 py-2 text-[14px] font-semibold text-white"
								style={{ background: "var(--accent)" }}
							>
								<PenLine size={16} strokeWidth={2} />
								Criar avaliação
							</Link>
						</div>
					)}
				</section>
			)}

			{activeTab === "forum" && (
				<section className="grid gap-4">
					<h2
						className="text-[16px] font-semibold"
						style={{ color: "var(--text)" }}
					>
						Suas publicações no fórum
					</h2>
					{userThreads.length ? (
						<div className="grid gap-3">
							{userThreads.map((thread) => (
								<div
									key={thread.id}
									className="rounded-2xl border p-5"
									style={{
										background: "var(--surface)",
										borderColor: "var(--border)",
									}}
								>
									<div className="flex flex-wrap items-center justify-between gap-3">
										<p
											className="text-[14px] font-semibold"
											style={{ color: "var(--text)" }}
										>
											{thread.title}
										</p>
										<p
											className="text-[12px]"
											style={{ color: "var(--text-muted)" }}
										>
											{thread.date}
										</p>
									</div>
									<div
										className="mt-3 flex flex-wrap gap-3 text-[13px]"
										style={{ color: "var(--text-muted)" }}
									>
										<span>{thread.category}</span>
										<span>·</span>
										<span>{thread.votes} votos</span>
										<span>·</span>
										<span>{thread.comments} comentários</span>
										<span>·</span>
										<span>{thread.views} visualizações</span>
									</div>
									{thread.body ? (
										<div className="mt-4">
											<MarkdownViewer value={thread.body} />
										</div>
									) : null}
								</div>
							))}
						</div>
					) : (
						<div
							className="rounded-2xl border p-5"
							style={{
								background: "var(--surface)",
								borderColor: "var(--border)",
							}}
						>
							<p className="text-[14px]" style={{ color: "var(--text-muted)" }}>
								Sem publicações no fórum ainda.
							</p>
						</div>
					)}
				</section>
			)}

			{activeTab === "comentarios" && (
				<section className="grid gap-4">
					<h2
						className="text-[16px] font-semibold"
						style={{ color: "var(--text)" }}
					>
						Seus comentários
					</h2>
					{userComments.length ? (
						<div className="grid gap-3">
							{userComments.map((comment) => (
								<div
									key={comment.id}
									className="rounded-2xl border p-5"
									style={{
										background: "var(--surface)",
										borderColor: "var(--border)",
									}}
								>
									<div className="flex flex-wrap items-center justify-between gap-3">
										<p
											className="text-[13px] font-semibold"
											style={{ color: "var(--text)" }}
										>
											{comment.contextTitle}
										</p>
										<p
											className="text-[12px]"
											style={{ color: "var(--text-muted)" }}
										>
											{comment.date}
										</p>
									</div>
									<p
										className="mt-3 text-[14px]"
										style={{ color: "var(--text-muted)" }}
									>
										{comment.body}
									</p>
									<p
										className="mt-3 text-[12px]"
										style={{ color: "var(--text-muted)" }}
									>
										{comment.contextType === "review"
											? "Comentário em avaliação"
											: "Comentário no fórum"}
									</p>
								</div>
							))}
						</div>
					) : (
						<div
							className="rounded-2xl border p-5"
							style={{
								background: "var(--surface)",
								borderColor: "var(--border)",
							}}
						>
							<p className="text-[14px]" style={{ color: "var(--text-muted)" }}>
								Sem comentários ainda.
							</p>
						</div>
					)}
				</section>
			)}

			{!hasContent && (
				<div
					className="rounded-2xl border p-5"
					style={{ background: "var(--surface)", borderColor: "var(--border)" }}
				>
					<p className="text-[14px]" style={{ color: "var(--text-muted)" }}>
						Quando suas avaliações, publicações e comentários estiverem
						sincronizados com o backend, eles aparecerão aqui.
					</p>
				</div>
			)}

			<section
				className="rounded-2xl border p-6"
				style={{
					background: "oklch(0.98 0.01 30)",
					borderColor: "oklch(0.88 0.05 28)",
				}}
			>
				<div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
					<div className="max-w-2xl">
						<p
							className="text-[12px] font-semibold uppercase tracking-wide"
							style={{ color: "oklch(0.52 0.15 28)" }}
						>
							Zona de perigo
						</p>
						<h2
							className="mt-2 text-[20px] font-display font-extrabold"
							style={{ color: "var(--text)" }}
						>
							Excluir conta
						</h2>
						<p
							className="mt-2 text-[14px]"
							style={{ color: "var(--text-muted)" }}
						>
							Essa ação remove sua conta permanentemente e encerra sua sessão
							atual. Não há como desfazer depois.
						</p>
					</div>

					<button
						type="button"
						onClick={() => {
							setShowDeleteConfirm((current) => !current);
							setDeleteError("");
							setDeleteConfirmation("");
						}}
						className="inline-flex items-center justify-center rounded-lg px-4 py-2 text-[14px] font-semibold text-white"
						style={{ background: "oklch(0.57 0.2 27)" }}
					>
						{showDeleteConfirm ? "Cancelar" : "Deletar minha conta"}
					</button>
				</div>

				{showDeleteConfirm ? (
					<div
						className="mt-5 rounded-2xl border p-5"
						style={{
							background: "var(--surface)",
							borderColor: "oklch(0.88 0.05 28)",
						}}
					>
						<label
							htmlFor="delete-account-confirmation"
							className="block text-[13px] font-medium"
							style={{ color: "var(--text)" }}
						>
							Digite <strong>{authUser.username}</strong> para confirmar
						</label>
						<input
							id="delete-account-confirmation"
							type="text"
							value={deleteConfirmation}
							onChange={(event) => setDeleteConfirmation(event.target.value)}
							className="mt-3 w-full rounded-xl border px-4 py-3 text-[14px] outline-none transition-colors duration-150"
							style={{
								background: "var(--bg)",
								borderColor: "var(--border)",
								color: "var(--text)",
							}}
							placeholder={authUser.username}
						/>

						{deleteError ? (
							<div
								className="mt-3 rounded-xl border px-4 py-3 text-[13px]"
								style={{
									background: "oklch(0.97 0.04 25)",
									borderColor: "oklch(0.88 0.08 25)",
									color: "oklch(0.45 0.17 25)",
								}}
							>
								{deleteError}
							</div>
						) : null}

						<div className="mt-4 flex flex-wrap gap-3">
							<button
								type="button"
								onClick={() => {
									setShowDeleteConfirm(false);
									setDeleteError("");
									setDeleteConfirmation("");
								}}
								className="rounded-lg border px-4 py-2 text-[14px] font-semibold"
								style={{
									borderColor: "var(--border)",
									color: "var(--text-muted)",
								}}
							>
								Manter conta
							</button>
							<button
								type="button"
								onClick={handleDeleteAccount}
								disabled={isDeletingAccount}
								className="inline-flex items-center gap-2 rounded-lg px-4 py-2 text-[14px] font-semibold text-white disabled:cursor-not-allowed disabled:opacity-70"
								style={{ background: "oklch(0.57 0.2 27)" }}
							>
								{isDeletingAccount ? (
									<>
										<LoaderCircle size={16} className="animate-spin" />
										Excluindo conta...
									</>
								) : (
									"Confirmar exclusão"
								)}
							</button>
						</div>
					</div>
				) : null}
			</section>
		</div>
	);
}

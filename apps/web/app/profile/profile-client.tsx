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
import { useMemo, useState } from "react";
import { ReviewCard } from "@/components/ReviewCard";
import { useAuthSession } from "@/hooks/use-auth-session";
import { comments, getCarById, reviews, threads } from "@/lib/data";

type ProfileTab = "resumo" | "avaliacoes" | "forum" | "comentarios";

const tabs: Array<{ id: ProfileTab; label: string; icon: typeof LayoutGrid }> = [
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
	const { authUser, isCheckingSession, isLoggedIn } = useAuthSession();
	const [activeTab, setActiveTab] = useState<ProfileTab>("resumo");

	const userHandle = authUser?.username ?? "";

	const userReviews = useMemo(
		() => reviews.filter((review) => review.author === userHandle),
		[userHandle],
	);
	const userThreads = useMemo(
		() => threads.filter((thread) => thread.author === userHandle),
		[userHandle],
	);
	const userComments = useMemo(
		() => comments.filter((comment) => comment.author === userHandle),
		[userHandle],
	);
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

	const hasContent = userReviews.length || userThreads.length || userComments.length;

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

			<section className="grid gap-3 rounded-2xl border p-2" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
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
					<div className="rounded-2xl border p-5" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
						<h2 className="text-[16px] font-semibold" style={{ color: "var(--text)" }}>
							Última avaliação
						</h2>
						{recentReview ? (
							<div className="mt-4 grid gap-2">
								<p className="text-[14px] font-medium" style={{ color: "var(--text)" }}>
									{recentReview.title}
								</p>
								<p className="text-[13px]" style={{ color: "var(--text-muted)" }}>
									{getCarById(recentReview.carId)?.brand} {getCarById(recentReview.carId)?.model} • {recentReview.date}
								</p>
							</div>
						) : (
							<p className="mt-3 text-[14px]" style={{ color: "var(--text-muted)" }}>
								Você ainda não publicou avaliações.
							</p>
						)}
					</div>

					<div className="rounded-2xl border p-5" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
						<h2 className="text-[16px] font-semibold" style={{ color: "var(--text)" }}>
							Última publicação
						</h2>
						{recentThread ? (
							<div className="mt-4 grid gap-2">
								<p className="text-[14px] font-medium" style={{ color: "var(--text)" }}>
									{recentThread.title}
								</p>
								<p className="text-[13px]" style={{ color: "var(--text-muted)" }}>
									{recentThread.comments} comentários • {recentThread.votes} votos
								</p>
							</div>
						) : (
							<p className="mt-3 text-[14px]" style={{ color: "var(--text-muted)" }}>
								Você ainda não publicou no fórum.
							</p>
						)}
					</div>

					<div className="rounded-2xl border p-5" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
						<h2 className="text-[16px] font-semibold" style={{ color: "var(--text)" }}>
							Último comentário
						</h2>
						{recentComment ? (
							<div className="mt-4 grid gap-2">
								<p className="text-[14px]" style={{ color: "var(--text)" }}>
									{recentComment.body}
								</p>
								<p className="text-[13px]" style={{ color: "var(--text-muted)" }}>
									{recentComment.contextType === "review" ? "Avaliação" : "Fórum"} • {recentComment.contextTitle}
								</p>
							</div>
						) : (
							<p className="mt-3 text-[14px]" style={{ color: "var(--text-muted)" }}>
								Você ainda não comentou.
							</p>
						)}
					</div>
				</section>
			)}

			{activeTab === "avaliacoes" && (
				<section className="grid gap-4">
					<h2 className="text-[16px] font-semibold" style={{ color: "var(--text)" }}>
						Suas avaliações
					</h2>
					{userReviews.length ? (
						<div className="grid gap-4 md:grid-cols-2">
							{userReviews.map((review) => {
								const car = getCarById(review.carId);
								if (!car) return null;
								return <ReviewCard key={review.id} review={review} car={car} compact />;
							})}
						</div>
					) : (
						<div className="rounded-2xl border p-5" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
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
					<h2 className="text-[16px] font-semibold" style={{ color: "var(--text)" }}>
						Suas publicações no fórum
					</h2>
					{userThreads.length ? (
						<div className="grid gap-3">
							{userThreads.map((thread) => (
								<div
									key={thread.id}
									className="rounded-2xl border p-5"
									style={{ background: "var(--surface)", borderColor: "var(--border)" }}
								>
									<div className="flex flex-wrap items-center justify-between gap-3">
										<p className="text-[14px] font-semibold" style={{ color: "var(--text)" }}>
											{thread.title}
										</p>
										<p className="text-[12px]" style={{ color: "var(--text-muted)" }}>
											{thread.date}
										</p>
									</div>
									<div className="mt-3 flex flex-wrap gap-3 text-[13px]" style={{ color: "var(--text-muted)" }}>
										<span>{thread.category}</span>
										<span>·</span>
										<span>{thread.votes} votos</span>
										<span>·</span>
										<span>{thread.comments} comentários</span>
										<span>·</span>
										<span>{thread.views} visualizações</span>
									</div>
								</div>
							))}
						</div>
					) : (
						<div className="rounded-2xl border p-5" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
							<p className="text-[14px]" style={{ color: "var(--text-muted)" }}>
								Sem publicações no fórum ainda.
							</p>
						</div>
					)}
				</section>
			)}

			{activeTab === "comentarios" && (
				<section className="grid gap-4">
					<h2 className="text-[16px] font-semibold" style={{ color: "var(--text)" }}>
						Seus comentários
					</h2>
					{userComments.length ? (
						<div className="grid gap-3">
							{userComments.map((comment) => (
								<div
									key={comment.id}
									className="rounded-2xl border p-5"
									style={{ background: "var(--surface)", borderColor: "var(--border)" }}
								>
									<div className="flex flex-wrap items-center justify-between gap-3">
										<p className="text-[13px] font-semibold" style={{ color: "var(--text)" }}>
											{comment.contextTitle}
										</p>
										<p className="text-[12px]" style={{ color: "var(--text-muted)" }}>
											{comment.date}
										</p>
									</div>
									<p className="mt-3 text-[14px]" style={{ color: "var(--text-muted)" }}>
										{comment.body}
									</p>
									<p className="mt-3 text-[12px]" style={{ color: "var(--text-muted)" }}>
										{comment.contextType === "review" ? "Comentário em avaliação" : "Comentário no fórum"}
									</p>
								</div>
							))}
						</div>
					) : (
						<div className="rounded-2xl border p-5" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
							<p className="text-[14px]" style={{ color: "var(--text-muted)" }}>
								Sem comentários ainda.
							</p>
						</div>
					)}
				</section>
			)}

			{!hasContent && (
				<div className="rounded-2xl border p-5" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
					<p className="text-[14px]" style={{ color: "var(--text-muted)" }}>
						Quando suas avaliações, publicações e comentários estiverem sincronizados com o backend, eles aparecerão aqui.
					</p>
				</div>
			)}
		</div>
	);
}

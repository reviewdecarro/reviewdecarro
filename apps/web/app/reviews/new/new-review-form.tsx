"use client";

import {
	CheckCircle2,
	LoaderCircle,
	LockKeyhole,
	Plus,
	Sparkles,
	Star,
} from "lucide-react";
import Link from "next/link";
import { type FormEvent, useEffect, useMemo, useState } from "react";
import { useAuthSession } from "@/hooks/use-auth-session";
import { API_BASE_URL } from "@/lib/api";

type RatingCategory =
	| "CONSUMPTION"
	| "MAINTENANCE"
	| "RELIABILITY"
	| "COMFORT"
	| "PERFORMANCE"
	| "TECHNOLOGY"
	| "FINISH"
	| "RESALE_VALUE";

type BrandOption = {
	id: string;
	name: string;
	slug: string;
	createdAt: string;
};

type ModelOption = {
	id: string;
	name: string;
	slug: string;
	brandId: string;
	createdAt: string;
};

type VersionOption = {
	id: string;
	modelId: string;
	year: number;
	versionName: string;
	engine: string | null;
	transmission: string | null;
	slug: string;
	createdAt: string;
};

type RatingOption = {
	category: RatingCategory;
	label: string;
};

const ratingOptions: RatingOption[] = [
	{ category: "CONSUMPTION", label: "Consumo" },
	{ category: "MAINTENANCE", label: "Manutenção" },
	{ category: "RELIABILITY", label: "Confiabilidade" },
	{ category: "COMFORT", label: "Conforto" },
	{ category: "PERFORMANCE", label: "Performance" },
	{ category: "TECHNOLOGY", label: "Tecnologia" },
	{ category: "FINISH", label: "Acabamento" },
	{ category: "RESALE_VALUE", label: "Valor de revenda" },
];

type CreateReviewPayload = {
	carVersionId: string;
	title: string;
	content: string;
	pros?: string;
	cons?: string;
	ownershipTimeMonths?: number;
	kmDriven?: number;
	ratings: { category: RatingCategory; value: number }[];
};

type SubmitState = {
	status: "idle" | "submitting" | "success" | "error";
	message: string;
};

type ApiResponse<T> = {
	[key: string]: T;
};

async function fetchJson<T>(path: string): Promise<T> {
	const response = await fetch(`${API_BASE_URL}${path}`, {
		credentials: "include",
		cache: "no-store",
	});

	if (!response.ok) {
		throw new Error("Falha ao carregar os dados do veículo.");
	}

	const data = (await response.json()) as ApiResponse<T>;
	const value = Object.values(data)[0];

	if (!value) {
		throw new Error("Falha ao carregar os dados do veículo.");
	}

	return value;
}

export function NewReviewForm() {
	const { authUser, isCheckingSession, isLoggedIn } = useAuthSession();
	const [brands, setBrands] = useState<BrandOption[]>([]);
	const [models, setModels] = useState<ModelOption[]>([]);
	const [versions, setVersions] = useState<VersionOption[]>([]);
	const [selectedBrandSlug, setSelectedBrandSlug] = useState("");
	const [selectedModelSlug, setSelectedModelSlug] = useState("");
	const [selectedYear, setSelectedYear] = useState("");
	const [isLoadingBrands, setIsLoadingBrands] = useState(true);
	const [isLoadingModels, setIsLoadingModels] = useState(false);
	const [isLoadingVersions, setIsLoadingVersions] = useState(false);
	const [state, setState] = useState<SubmitState>({
		status: "idle",
		message: "",
	});
	const [payload, setPayload] = useState<CreateReviewPayload>({
		carVersionId: "",
		title: "",
		content: "",
		pros: "",
		cons: "",
		ownershipTimeMonths: undefined,
		kmDriven: undefined,
		ratings: ratingOptions.map(({ category }) => ({ category, value: 0 })),
	});

	useEffect(() => {
		let active = true;

		async function loadBrands() {
			try {
				const data = await fetchJson<BrandOption[]>("/brands");

				if (active) {
					setBrands(data);
				}
			} catch {
				if (active) {
					setBrands([]);
				}
			} finally {
				if (active) {
					setIsLoadingBrands(false);
				}
			}
		}

		void loadBrands();

		return () => {
			active = false;
		};
	}, []);

	useEffect(() => {
		let active = true;

		async function loadBrandDetails() {
			if (!selectedBrandSlug) {
				setModels([]);
				return;
			}

			setIsLoadingModels(true);

			try {
				const brand = await fetchJson<{ models: ModelOption[] }>(
					`/brands/${selectedBrandSlug}`,
				);

				if (active) {
					setModels(brand.models ?? []);
				}
			} catch {
				if (active) {
					setModels([]);
				}
			} finally {
				if (active) {
					setIsLoadingModels(false);
				}
			}
		}

		void loadBrandDetails();

		return () => {
			active = false;
		};
	}, [selectedBrandSlug]);

	useEffect(() => {
		let active = true;

		async function loadModelDetails() {
			if (!selectedBrandSlug || !selectedModelSlug) {
				setVersions([]);
				return;
			}

			setIsLoadingVersions(true);

			try {
				const model = await fetchJson<{ carVersions: VersionOption[] }>(
					`/brands/${selectedBrandSlug}/models/${selectedModelSlug}`,
				);

				if (active) {
					setVersions(model.carVersions ?? []);
				}
			} catch {
				if (active) {
					setVersions([]);
				}
			} finally {
				if (active) {
					setIsLoadingVersions(false);
				}
			}
		}

		void loadModelDetails();

		return () => {
			active = false;
		};
	}, [selectedBrandSlug, selectedModelSlug]);

	const yearOptions = useMemo(() => {
		return Array.from(new Set(versions.map((version) => version.year))).sort(
			(a, b) => b - a,
		);
	}, [versions]);

	const selectedVersion =
		(selectedYear &&
			versions.find((version) => String(version.year) === selectedYear)) ||
		null;

	const canSubmit =
		selectedVersion !== null &&
		payload.title.trim().length >= 3 &&
		payload.content.trim().length >= 10 &&
		payload.ratings.every((rating) => rating.value > 0);

	const overallScore = useMemo(() => {
		const total = payload.ratings.reduce(
			(sum, rating) => sum + rating.value,
			0,
		);
		return total > 0 ? Number((total / payload.ratings.length).toFixed(1)) : 0;
	}, [payload.ratings]);

	function updateField<K extends keyof CreateReviewPayload>(
		field: K,
		value: CreateReviewPayload[K],
	) {
		setPayload((current) => ({ ...current, [field]: value }));
	}

	function updateRating(category: RatingCategory, value: number) {
		setPayload((current) => ({
			...current,
			ratings: current.ratings.map((rating) =>
				rating.category === category ? { ...rating, value } : rating,
			),
		}));
		setState({ status: "idle", message: "" });
	}

	function getRatingValue(category: RatingCategory) {
		return (
			payload.ratings.find((rating) => rating.category === category)?.value ?? 0
		);
	}

	async function handleSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();

		if (!selectedVersion) {
			setState({
				status: "error",
				message: "Selecione marca, modelo e ano para continuar.",
			});
			return;
		}

		setState({ status: "submitting", message: "" });

		try {
			const response = await fetch(`${API_BASE_URL}/reviews`, {
				method: "POST",
				credentials: "include",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					...payload,
					carVersionId: selectedVersion.id,
					score: overallScore,
					ratings: payload.ratings,
					pros: payload.pros?.trim() || undefined,
					cons: payload.cons?.trim() || undefined,
				}),
			});

			const data = (await response.json()) as {
				message?: string;
			};

			if (!response.ok) {
				throw new Error(data.message ?? "Falha ao criar a avaliação.");
			}

			setState({
				status: "success",
				message: data.message ?? "Review criada com sucesso.",
			});
		} catch (error) {
			setState({
				status: "error",
				message:
					error instanceof Error
						? error.message
						: "Falha ao criar a avaliação.",
			});
		}
	}

	function resetForm() {
		setSelectedBrandSlug("");
		setSelectedModelSlug("");
		setSelectedYear("");
		setModels([]);
		setVersions([]);
		setPayload({
			carVersionId: "",
			title: "",
			content: "",
			pros: "",
			cons: "",
			ownershipTimeMonths: undefined,
			kmDriven: undefined,
			ratings: ratingOptions.map(({ category }) => ({ category, value: 0 })),
		});
		setState({ status: "idle", message: "" });
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
						<LockKeyhole size={18} strokeWidth={2} />
					</div>
					<div className="min-w-0">
						<h2
							className="text-[16px] font-semibold"
							style={{ color: "var(--text)" }}
						>
							Entre para criar avaliações
						</h2>
						<p
							className="mt-1 text-[14px]"
							style={{ color: "var(--text-muted)" }}
						>
							Você precisa estar autenticado para publicar uma nova review.
						</p>
						<div className="mt-4 flex flex-wrap gap-3">
							<Link
								href="/login"
								className="inline-flex items-center gap-2 rounded-lg px-4 py-2 text-[14px] font-semibold text-white"
								style={{ background: "var(--accent)" }}
							>
								<CheckCircle2 size={16} strokeWidth={2} />
								Entrar
							</Link>
							<Link
								href="/"
								className="inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-[14px] font-semibold"
								style={{
									background: "var(--surface-2)",
									borderColor: "var(--border)",
									color: "var(--text-muted)",
								}}
							>
								Voltar
							</Link>
						</div>
					</div>
				</div>
			</div>
		);
	}

	if (state.status === "success") {
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
						<Sparkles size={18} strokeWidth={2} />
					</div>
					<div className="min-w-0">
						<h2
							className="text-[16px] font-semibold"
							style={{ color: "var(--text)" }}
						>
							Review criada com sucesso
						</h2>
						<p
							className="mt-1 text-[14px]"
							style={{ color: "var(--text-muted)" }}
						>
							{state.message}
						</p>
						<div className="mt-4 flex flex-wrap gap-3">
							<Link
								href="/reviews"
								className="inline-flex items-center gap-2 rounded-lg px-4 py-2 text-[14px] font-semibold text-white"
								style={{ background: "var(--accent)" }}
							>
								<Plus size={16} strokeWidth={2} />
								Ver avaliações
							</Link>
							<button
								type="button"
								onClick={resetForm}
								className="inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-[14px] font-semibold"
								style={{
									background: "var(--surface-2)",
									borderColor: "var(--border)",
									color: "var(--text-muted)",
								}}
							>
								Criar outra
							</button>
						</div>
					</div>
				</div>
			</div>
		);
	}

	return (
		<form
			onSubmit={handleSubmit}
			className="rounded-2xl border p-6"
			style={{
				background: "var(--surface)",
				borderColor: "var(--border)",
			}}
		>
			<div className="grid gap-4">
				<div className="grid gap-2">
					<label
						htmlFor="brand"
						className="text-[13px] font-medium"
						style={{ color: "var(--text-muted)" }}
					>
						Marca
					</label>
					<select
						id="brand"
						value={selectedBrandSlug}
						onChange={(event) => {
							setSelectedBrandSlug(event.target.value);
							setSelectedModelSlug("");
							setSelectedYear("");
							setModels([]);
							setVersions([]);
							setState({ status: "idle", message: "" });
						}}
						className="rounded-lg border px-3 py-2 text-[14px] outline-none"
						style={{
							background: "var(--bg)",
							borderColor: "var(--border)",
							color: "var(--text)",
						}}
						disabled={isLoadingBrands}
					>
						<option value="">
							{isLoadingBrands ? "Carregando marcas..." : "Selecione uma marca"}
						</option>
						{brands.map((brand) => (
							<option key={brand.id} value={brand.slug}>
								{brand.name}
							</option>
						))}
					</select>
				</div>

				<div className="grid gap-2">
					<label
						htmlFor="model"
						className="text-[13px] font-medium"
						style={{ color: "var(--text-muted)" }}
					>
						Modelo
					</label>
					<select
						id="model"
						value={selectedModelSlug}
						onChange={(event) => {
							setSelectedModelSlug(event.target.value);
							setSelectedYear("");
							setVersions([]);
							setState({ status: "idle", message: "" });
						}}
						className="rounded-lg border px-3 py-2 text-[14px] outline-none"
						style={{
							background: "var(--bg)",
							borderColor: "var(--border)",
							color: "var(--text)",
						}}
						disabled={!selectedBrandSlug || isLoadingModels}
					>
						<option value="">
							{!selectedBrandSlug
								? "Selecione uma marca primeiro"
								: isLoadingModels
									? "Carregando modelos..."
									: "Selecione um modelo"}
						</option>
						{models.map((model) => (
							<option key={model.id} value={model.slug}>
								{model.name}
							</option>
						))}
					</select>
				</div>

				<div className="grid gap-2">
					<label
						htmlFor="year"
						className="text-[13px] font-medium"
						style={{ color: "var(--text-muted)" }}
					>
						Ano
					</label>
					<select
						id="year"
						value={selectedYear}
						onChange={(event) => {
							const year = event.target.value;
							setSelectedYear(year);
							setPayload((current) => ({
								...current,
								carVersionId:
									versions.find((version) => String(version.year) === year)
										?.id ?? "",
							}));
							setState({ status: "idle", message: "" });
						}}
						className="rounded-lg border px-3 py-2 text-[14px] outline-none"
						style={{
							background: "var(--bg)",
							borderColor: "var(--border)",
							color: "var(--text)",
						}}
						disabled={!selectedModelSlug || isLoadingVersions}
					>
						<option value="">
							{!selectedModelSlug
								? "Selecione um modelo primeiro"
								: isLoadingVersions
									? "Carregando anos..."
									: "Selecione um ano"}
						</option>
						{yearOptions.map((year) => (
							<option key={year} value={year}>
								{year}
							</option>
						))}
					</select>
				</div>

				{selectedVersion && (
					<div
						className="rounded-xl border px-3 py-2 text-[13px]"
						style={{
							background: "var(--accent-light)",
							borderColor: "var(--accent)",
							color: "var(--accent)",
						}}
					>
						Versão selecionada: {selectedVersion.versionName}
					</div>
				)}

				<div className="grid gap-2">
					<label
						htmlFor="title"
						className="text-[13px] font-medium"
						style={{ color: "var(--text-muted)" }}
					>
						Título
					</label>
					<input
						id="title"
						value={payload.title}
						onChange={(event) => updateField("title", event.target.value)}
						className="rounded-lg border px-3 py-2 text-[14px] outline-none"
						style={{
							background: "var(--bg)",
							borderColor: "var(--border)",
							color: "var(--text)",
						}}
						required
						minLength={3}
					/>
				</div>

				<div className="grid gap-2">
					<label
						htmlFor="content"
						className="text-[13px] font-medium"
						style={{ color: "var(--text-muted)" }}
					>
						Conteúdo
					</label>
					<textarea
						id="content"
						value={payload.content}
						onChange={(event) => updateField("content", event.target.value)}
						className="min-h-36 rounded-lg border px-3 py-2 text-[14px] outline-none"
						style={{
							background: "var(--bg)",
							borderColor: "var(--border)",
							color: "var(--text)",
						}}
						required
						minLength={10}
					/>
				</div>

				<div
					className="grid gap-4 rounded-2xl border p-4"
					style={{
						background: "var(--bg)",
						borderColor: "var(--border)",
					}}
				>
					<div className="flex flex-wrap items-start justify-between gap-3">
						<div>
							<p
								className="text-[13px] font-medium"
								style={{ color: "var(--text-muted)" }}
							>
								Avaliação por categoria
							</p>
							<p
								className="mt-1 text-[13px]"
								style={{ color: "var(--text-muted)" }}
							>
								{payload.ratings.filter((rating) => rating.value > 0).length}/
								{ratingOptions.length} categorias avaliadas
							</p>
						</div>

						<div className="flex items-center gap-1">
							{Array.from({ length: 5 }).map((_, index) => {
								const active = index + 1 <= Math.round(overallScore);

								return (
									<Star
										key={index}
										size={16}
										strokeWidth={1.8}
										fill={active ? "currentColor" : "none"}
										color={active ? "var(--accent)" : "var(--text-muted)"}
									/>
								);
							})}
							<span
								className="ml-1 text-[13px] font-semibold"
								style={{ color: "var(--text)" }}
							>
								{overallScore > 0 ? overallScore.toFixed(1) : "0.0"}
							</span>
						</div>
					</div>

					<div className="grid gap-3">
						{ratingOptions.map(({ category, label }) => {
							const value = getRatingValue(category);

							return (
								<div
									key={category}
									className="flex flex-col gap-2 rounded-xl border px-3 py-3 sm:flex-row sm:items-center sm:justify-between"
									style={{
										background: "var(--surface)",
										borderColor: "var(--border)",
									}}
								>
									<div>
										<p
											className="text-[14px] font-semibold"
											style={{ color: "var(--text)" }}
										>
											{label}
										</p>
										{/* <p
											className="text-[12px]"
											style={{ color: "var(--text-muted)" }}
										>
											Selecione de 1 a 5 estrelas
										</p> */}
									</div>

									<div className="flex items-center gap-1">
										{Array.from({ length: 5 }).map((_, index) => {
											const starValue = index + 1;
											const active = starValue <= value;

											return (
												<button
													key={starValue}
													type="button"
													onClick={() => updateRating(category, starValue)}
													className="rounded-md p-1 transition-transform duration-150 hover:scale-105"
													aria-label={`${label}: ${starValue} estrela${starValue > 1 ? "s" : ""}`}
													title={`${starValue} estrela${starValue > 1 ? "s" : ""}`}
												>
													<Star
														size={18}
														strokeWidth={1.8}
														fill={active ? "currentColor" : "none"}
														color={active ? "var(--accent)" : "var(--border)"}
													/>
												</button>
											);
										})}
									</div>
								</div>
							);
						})}
					</div>
				</div>

				<div className="grid gap-2">
					<label
						htmlFor="ownershipTimeMonths"
						className="text-[13px] font-medium"
						style={{ color: "var(--text-muted)" }}
					>
						Meses de uso
					</label>
					<input
						id="ownershipTimeMonths"
						type="number"
						min="0"
						value={payload.ownershipTimeMonths ?? ""}
						onChange={(event) =>
							updateField(
								"ownershipTimeMonths",
								event.target.value ? Number(event.target.value) : undefined,
							)
						}
						className="rounded-lg border px-3 py-2 text-[14px] outline-none"
						style={{
							background: "var(--bg)",
							borderColor: "var(--border)",
							color: "var(--text)",
						}}
					/>
				</div>

				<div className="grid gap-4">
					<div className="grid gap-2">
						<label
							htmlFor="pros"
							className="text-[13px] font-medium"
							style={{ color: "var(--text-muted)" }}
						>
							Prós
						</label>
						<input
							id="pros"
							value={payload.pros ?? ""}
							onChange={(event) => updateField("pros", event.target.value)}
							className="min-h-12 rounded-lg border px-3 py-3 text-[14px] outline-none"
							style={{
								background: "var(--bg)",
								borderColor: "var(--border)",
								color: "var(--text)",
							}}
						/>
					</div>

					<div className="grid gap-2">
						<label
							htmlFor="cons"
							className="text-[13px] font-medium"
							style={{ color: "var(--text-muted)" }}
						>
							Contras
						</label>
						<input
							id="cons"
							value={payload.cons ?? ""}
							onChange={(event) => updateField("cons", event.target.value)}
							className="min-h-12 rounded-lg border px-3 py-3 text-[14px] outline-none"
							style={{
								background: "var(--bg)",
								borderColor: "var(--border)",
								color: "var(--text)",
							}}
						/>
					</div>

					<div className="grid gap-2">
						<label
							htmlFor="kmDriven"
							className="text-[13px] font-medium"
							style={{ color: "var(--text-muted)" }}
						>
							Quilometragem
						</label>
						<input
							id="kmDriven"
							type="number"
							min="0"
							value={payload.kmDriven ?? ""}
							onChange={(event) =>
								updateField(
									"kmDriven",
									event.target.value ? Number(event.target.value) : undefined,
								)
							}
							className="rounded-lg border px-3 py-2 text-[14px] outline-none"
							style={{
								background: "var(--bg)",
								borderColor: "var(--border)",
								color: "var(--text)",
							}}
						/>
					</div>
				</div>

				{state.status === "error" && (
					<p
						className="rounded-lg border px-3 py-2 text-[14px]"
						style={{
							background: "var(--accent-light)",
							borderColor: "var(--accent)",
							color: "var(--accent)",
						}}
					>
						{state.message}
					</p>
				)}

				<div className="flex flex-wrap gap-3 pt-2">
					<button
						type="submit"
						disabled={!canSubmit || state.status === "submitting"}
						className="inline-flex items-center gap-2 rounded-lg px-4 py-2 text-[14px] font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
						style={{ background: "var(--accent)" }}
					>
						{state.status === "submitting" ? (
							<LoaderCircle
								size={16}
								className="animate-spin"
								strokeWidth={2}
							/>
						) : (
							<Plus size={16} strokeWidth={2} />
						)}
						Publicar review
					</button>

					<Link
						href="/reviews"
						className="inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-[14px] font-semibold"
						style={{
							background: "var(--surface-2)",
							borderColor: "var(--border)",
							color: "var(--text-muted)",
						}}
					>
						Cancelar
					</Link>
				</div>
			</div>
		</form>
	);
}

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
import Select, { type SingleValue, type StylesConfig } from "react-select";
import { MarkdownEditor } from "@/components/MarkdownEditor";
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
	versionName: string;
	engine: string | null;
	transmission: string | null;
	slug: string;
	createdAt: string;
	years?: VersionYearOption[];
};

type VersionYearOption = {
	year: number;
	id: string;
};

type RatingOption = {
	category: RatingCategory;
	label: string;
};

type SelectOption = {
	value: string;
	label: string;
};

type VersionSelectOption = {
	value: string;
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
	carVersionYearId: string;
	title: string;
	content: string;
	pros?: string;
	cons?: string;
	ownershipTimeMonths?: number;
	kmDriven?: string;
	ratings: { category: RatingCategory; value: number }[];
};

type SubmitState = {
	status: "idle" | "submitting" | "success" | "error";
	message: string;
};

type ApiResponse<T> = {
	[key: string]: T;
};

const MAX_MARKDOWN_LENGTH = 20_000;

function parseMileage(value: string): number | undefined {
	const normalized = value
		.trim()
		.toLowerCase()
		.replace(/km$/, "")
		.replace(/[^\d]/g, "");

	if (!normalized) {
		return undefined;
	}

	const parsed = Number(normalized);

	return Number.isFinite(parsed) ? parsed : undefined;
}

const selectStyles: StylesConfig<SelectOption, false> = {
	control: (base, state) => ({
		...base,
		minHeight: "42px",
		borderRadius: "0.5rem",
		backgroundColor: "var(--bg)",
		borderColor: state.isFocused ? "var(--accent)" : "var(--border)",
		boxShadow: "none",
		"&:hover": {
			borderColor: state.isFocused ? "var(--accent)" : "var(--border)",
		},
	}),
	menu: (base) => ({
		...base,
		backgroundColor: "var(--surface)",
		border: "1px solid var(--border)",
		boxShadow: "0 10px 25px rgba(0, 0, 0, 0.08)",
		zIndex: 20,
	}),
	option: (base, state) => ({
		...base,
		backgroundColor: state.isSelected
			? "var(--accent-light)"
			: state.isFocused
				? "var(--surface-2)"
				: "var(--surface)",
		color: "var(--text)",
		"&:active": {
			backgroundColor: "var(--surface-2)",
		},
	}),
	singleValue: (base) => ({
		...base,
		color: "var(--text)",
	}),
	placeholder: (base) => ({
		...base,
		color: "var(--text-muted)",
	}),
	input: (base) => ({
		...base,
		color: "var(--text)",
	}),
	indicatorSeparator: (base) => ({
		...base,
		backgroundColor: "var(--border)",
	}),
	dropdownIndicator: (base) => ({
		...base,
		color: "var(--text-muted)",
		"&:hover": {
			color: "var(--text)",
		},
	}),
	clearIndicator: (base) => ({
		...base,
		color: "var(--text-muted)",
		"&:hover": {
			color: "var(--text)",
		},
	}),
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
	const [years, setYears] = useState<VersionYearOption[]>([]);
	const [versions, setVersions] = useState<VersionOption[]>([]);
	const [selectedBrandSlug, setSelectedBrandSlug] = useState("");
	const [selectedModelSlug, setSelectedModelSlug] = useState("");
	const [selectedYear, setSelectedYear] = useState("");
	const [selectedVersionId, setSelectedVersionId] = useState("");
	const [isLoadingBrands, setIsLoadingBrands] = useState(true);
	const [isLoadingModels, setIsLoadingModels] = useState(false);
	const [isLoadingYears, setIsLoadingYears] = useState(false);
	const [isLoadingVersions, setIsLoadingVersions] = useState(false);
	const [state, setState] = useState<SubmitState>({
		status: "idle",
		message: "",
	});
	const [payload, setPayload] = useState<CreateReviewPayload>({
		carVersionYearId: "",
		title: "",
		content: "",
		pros: "",
		cons: "",
		ownershipTimeMonths: undefined,
		kmDriven: "",
		ratings: ratingOptions.map(({ category }) => ({ category, value: 0 })),
	});
	const brandOptions = useMemo(
		() =>
			brands.map((brand) => ({
				value: brand.slug,
				label: brand.name,
			})),
		[brands],
	);
	const modelOptions = useMemo(
		() =>
			models.map((model) => ({
				value: model.slug,
				label: model.name,
			})),
		[models],
	);

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

		async function loadAvailableYears() {
			if (!selectedBrandSlug || !selectedModelSlug) {
				setYears([]);
				setSelectedYear("");
				setSelectedVersionId("");
				setVersions([]);
				return;
			}

			setIsLoadingYears(true);

			try {
				const data = await fetchJson<VersionYearOption[]>(
					`/brands/${selectedBrandSlug}/models/${selectedModelSlug}/years`,
				);
				if (active) {
					setYears(data ?? []);
				}
			} catch {
				if (active) {
					setYears([]);
				}
			} finally {
				if (active) {
					setIsLoadingYears(false);
				}
			}
		}

		void loadAvailableYears();

		return () => {
			active = false;
		};
	}, [selectedBrandSlug, selectedModelSlug]);

	const yearOptions = useMemo(() => {
		return [...years].sort((a, b) => b.year - a.year);
	}, [years]);
	const yearSelectOptions = useMemo(
		() =>
			yearOptions.map((year) => ({
				value: String(year.year),
				label: String(year.year),
			})),
		[yearOptions],
	);

	useEffect(() => {
		let active = true;

		async function loadVersions() {
			if (!selectedBrandSlug || !selectedModelSlug || !selectedYear) {
				setVersions([]);
				setSelectedVersionId("");
				return;
			}

			setIsLoadingVersions(true);

			try {
				const data = await fetchJson<VersionOption[]>(
					`/brands/${selectedBrandSlug}/models/${selectedModelSlug}/versions`,
				);

				if (active) {
					setVersions(data ?? []);
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

		void loadVersions();

		return () => {
			active = false;
		};
	}, [selectedBrandSlug, selectedModelSlug, selectedYear]);

	const filteredVersions = useMemo(
		() =>
			versions.filter((version) =>
				version.years?.some((item) => String(item.year) === selectedYear),
			),
		[versions, selectedYear],
	);
	const versionSelectOptions = useMemo(
		(): VersionSelectOption[] =>
			filteredVersions.flatMap(
				(version) =>
					version.years
						?.filter((item) => String(item.year) === selectedYear)
						.map((item) => ({
							value: item.id,
							label: `${version.versionName}`,
						})) ?? [],
			),
		[filteredVersions, selectedYear],
	);

	const canSubmit = useMemo(
		() =>
			payload.carVersionYearId.length > 0 &&
			payload.title.trim().length >= 3 &&
			payload.content.trim().length >= 10,
		[payload.carVersionYearId, payload.title, payload.content],
	);

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

		if (!payload.carVersionYearId) {
			setState({
				status: "error",
				message: "Selecione marca, modelo, ano e versão para continuar.",
			});
			return;
		}

		if (!payload.ratings.every((rating) => rating.value > 0)) {
			setState({
				status: "error",
				message: "Avalie todas as categorias para publicar a review.",
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
					carVersionYearId: payload.carVersionYearId,
					score: overallScore,
					ratings: payload.ratings,
					pros: payload.pros?.trim() || undefined,
					cons: payload.cons?.trim() || undefined,
					kmDriven: parseMileage(payload.kmDriven ?? ""),
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
		setSelectedVersionId("");
		setModels([]);
		setYears([]);
		setVersions([]);
		setPayload({
			carVersionYearId: "",
			title: "",
			content: "",
			pros: "",
			cons: "",
			ownershipTimeMonths: undefined,
			kmDriven: "",
			ratings: ratingOptions.map(({ category }) => ({ category, value: 0 })),
		});
		setState({ status: "idle", message: "" });
	}

	if (isCheckingSession) {
		return (
			<div
				className="rounded-2xl border p-8 text-[14px]"
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
				className="rounded-2xl border p-8"
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
				className="rounded-2xl border p-8"
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
			className="rounded-2xl border p-8"
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
					<Select
						inputId="brand"
						instanceId="brand"
						isClearable
						isLoading={isLoadingBrands}
						placeholder="Digite ou selecione uma marca"
						options={brandOptions}
						value={
							brandOptions.find(
								(option) => option.value === selectedBrandSlug,
							) ?? null
						}
						onChange={(option: SingleValue<SelectOption>) => {
							const slug = option?.value ?? "";

							setSelectedBrandSlug(slug);
							setSelectedModelSlug("");
							setSelectedYear("");
							setSelectedVersionId("");
							setModels([]);
							setYears([]);
							setVersions([]);
							setPayload((current) => ({
								...current,
								carVersionYearId: "",
							}));
							setState({ status: "idle", message: "" });
						}}
						styles={selectStyles}
					/>
				</div>

				<div className="grid gap-2">
					<label
						htmlFor="model"
						className="text-[13px] font-medium"
						style={{ color: "var(--text-muted)" }}
					>
						Modelo
					</label>
					<Select
						inputId="model"
						instanceId="model"
						isClearable
						isDisabled={!selectedBrandSlug || isLoadingModels}
						isLoading={isLoadingModels}
						placeholder={
							!selectedBrandSlug
								? "Selecione uma marca primeiro"
								: "Digite ou selecione um modelo"
						}
						options={modelOptions}
						value={
							modelOptions.find(
								(option) => option.value === selectedModelSlug,
							) ?? null
						}
						onChange={(option: SingleValue<SelectOption>) => {
							const slug = option?.value ?? "";

							setSelectedModelSlug(slug);
							setSelectedYear("");
							setSelectedVersionId("");
							setYears([]);
							setVersions([]);
							setPayload((current) => ({
								...current,
								carVersionYearId: "",
							}));
							setState({ status: "idle", message: "" });
						}}
						styles={selectStyles}
					/>
					{/* {selectedModel && (
						<div
							className="rounded-lg border px-3 py-2 text-[13px]"
							style={{
								background: "var(--surface-2)",
								borderColor: "var(--border)",
								color: "var(--text)",
							}}
						>
							Modelo selecionado: {selectedModel.name}
						</div>
					)} */}
				</div>

				<div className="grid gap-2">
					<label
						htmlFor="year"
						className="text-[13px] font-medium"
						style={{ color: "var(--text-muted)" }}
					>
						Ano
					</label>
					<Select
						inputId="year"
						instanceId="year"
						isClearable
						isDisabled={!selectedModelSlug || isLoadingYears}
						isLoading={isLoadingYears}
						placeholder={
							!selectedModelSlug
								? "Selecione um modelo primeiro"
								: "Digite ou selecione um ano"
						}
						options={yearSelectOptions}
						value={
							yearSelectOptions.find(
								(option) => option.value === selectedYear,
							) ?? null
						}
						onChange={(option: SingleValue<SelectOption>) => {
							setSelectedYear(option?.value ?? "");
							setSelectedVersionId("");
							setVersions([]);
							setState({ status: "idle", message: "" });
						}}
						styles={selectStyles}
					/>
				</div>

				<div className="grid gap-2">
					<label
						htmlFor="version"
						className="text-[13px] font-medium"
						style={{ color: "var(--text-muted)" }}
					>
						Versão
					</label>
					<Select
						inputId="version"
						instanceId="version"
						isClearable
						isDisabled={!selectedYear || isLoadingVersions}
						isLoading={isLoadingVersions}
						placeholder={
							!selectedYear
								? "Selecione um ano primeiro"
								: "Digite ou selecione uma versão"
						}
						options={versionSelectOptions}
						value={
							versionSelectOptions.find(
								(option) => option.value === selectedVersionId,
							) ?? null
						}
						onChange={(option: SingleValue<VersionSelectOption>) => {
							const versionYearId = option?.value ?? "";
							console.log(versionYearId);
							setSelectedVersionId(versionYearId);
							setPayload((current) => ({
								...current,
								carVersionYearId: versionYearId,
							}));
							setState({ status: "idle", message: "" });
						}}
						styles={selectStyles}
					/>
				</div>

				{/* {payload.carVersionYearId && (
					<div
						className="rounded-xl border px-3 py-2 text-[13px]"
						style={{
							background: "var(--accent-light)",
							borderColor: "var(--accent)",
							color: "var(--accent)",
						}}
					>
						Versão selecionada
					</div>
				)} */}

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
						className="text-[13px] font-medium"
						style={{ color: "var(--text-muted)" }}
						htmlFor="content"
					>
						Conteúdo
					</label>
					<MarkdownEditor
						value={payload.content}
						onChange={(value) =>
							updateField("content", value.slice(0, MAX_MARKDOWN_LENGTH))
						}
						placeholder="Descreva sua experiência com o carro em markdown..."
						maxLength={MAX_MARKDOWN_LENGTH}
						height={520}
					/>
					<p className="text-[12px]" style={{ color: "var(--text-light)" }}>
						{payload.content.length}/{MAX_MARKDOWN_LENGTH} caracteres
					</p>
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
							type="text"
							inputMode="numeric"
							placeholder="Ex.: 74.490km"
							value={payload.kmDriven ?? ""}
							onChange={(event) => updateField("kmDriven", event.target.value)}
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

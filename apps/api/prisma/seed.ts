import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "./generated/client";

const prisma = new PrismaClient({
	adapter: new PrismaPg({
		connectionString: process.env.DATABASE_URL,
	}),
});

const modelsSeedByBrandSlug = {
	volkswagen: [
		"Gol",
		"Voyage",
		"Saveiro",
		"Fox",
		"Polo",
		"Virtus",
		"Nivus",
		"T-Cross",
		"Taos",
		"Jetta",
		"Passat",
		"Golf",
		"Up",
		"Fusca",
		"Amarok",
		"Tiguan",
		"Touareg",
		"SpaceFox",
		"Parati",
		"Santana",
	],

	fiat: [
		"Uno",
		"Mobi",
		"Argo",
		"Cronos",
		"Palio",
		"Siena",
		"Grand Siena",
		"Strada",
		"Toro",
		"Pulse",
		"Fastback",
		"Idea",
		"Punto",
		"Bravo",
		"Linea",
		"Fiorino",
		"Doblò",
		"500",
		"Tempra",
		"Tipo",
	],

	ford: [
		"Ka",
		"Ka Sedan",
		"Fiesta",
		"Fiesta Sedan",
		"Focus",
		"Focus Sedan",
		"Fusion",
		"EcoSport",
		"Territory",
		"Edge",
		"Ranger",
		"Maverick",
		"Mustang",
		"Bronco",
		"Courier",
		"Escort",
		"Verona",
		"Belina",
		"Del Rey",
		"Corcel",
	],

	"mercedes-benz": [
		"Classe A",
		"Classe B",
		"Classe C",
		"Classe E",
		"Classe S",
		"CLA",
		"CLS",
		"GLA",
		"GLB",
		"GLC",
		"GLE",
		"GLS",
		"SLK",
		"SLC",
		"AMG GT",
		"Sprinter",
		"Vito",
		"Classe G",
	],

	bmw: [
		"Série 1",
		"Série 2",
		"Série 3",
		"Série 4",
		"Série 5",
		"Série 7",
		"X1",
		"X2",
		"X3",
		"X4",
		"X5",
		"X6",
		"X7",
		"Z4",
		"i3",
		"i4",
		"iX",
		"M2",
		"M3",
		"M4",
	],

	hyundai: [
		"HB20",
		"HB20S",
		"HB20X",
		"Creta",
		"Tucson",
		"ix35",
		"Santa Fe",
		"Azera",
		"Elantra",
		"Sonata",
		"Veloster",
		"i30",
		"HR",
		"Kona",
		"Ioniq",
	],

	honda: [
		"Fit",
		"City",
		"Civic",
		"Accord",
		"HR-V",
		"WR-V",
		"CR-V",
		"ZR-V",
		"Civic Si",
		"Civic Type R",
		"Odyssey",
		"Prelude",
	],

	mitsubishi: [
		"Lancer",
		"Lancer Evolution",
		"ASX",
		"Outlander",
		"Eclipse Cross",
		"Pajero",
		"Pajero Sport",
		"Pajero TR4",
		"L200",
		"L200 Triton",
		"Airtrek",
		"Galant",
		"Space Wagon",
	],

	toyota: [
		"Etios",
		"Etios Sedan",
		"Yaris",
		"Yaris Sedan",
		"Corolla",
		"Corolla Cross",
		"Camry",
		"RAV4",
		"Hilux",
		"SW4",
		"Prius",
		"Bandeirante",
		"Land Cruiser",
		"Supra",
	],

	byd: [
		"Dolphin",
		"Dolphin Mini",
		"Dolphin Plus",
		"Seal",
		"Song Plus",
		"Song Pro",
		"Yuan Plus",
		"Tan",
		"Han",
		"King",
	],

	citroen: [
		"C3",
		"C3 Picasso",
		"C3 Aircross",
		"Aircross",
		"C4",
		"C4 Cactus",
		"C4 Lounge",
		"C4 Picasso",
		"Grand C4 Picasso",
		"Xsara Picasso",
		"Berlingo",
		"Jumper",
		"Jumpy",
	],

	jac: [
		"J2",
		"J3",
		"J3 Turin",
		"J5",
		"J6",
		"T40",
		"T50",
		"T60",
		"T80",
		"iEV20",
		"iEV40",
		"E-JS1",
		"E-JS4",
		"E-J7",
	],

	jeep: [
		"Renegade",
		"Compass",
		"Commander",
		"Cherokee",
		"Grand Cherokee",
		"Wrangler",
		"Gladiator",
		"Patriot",
	],

	jaguar: [
		"XE",
		"XF",
		"XJ",
		"F-Type",
		"E-Pace",
		"F-Pace",
		"I-Pace",
		"S-Type",
		"X-Type",
	],

	audi: [
		"A1",
		"A3",
		"A4",
		"A5",
		"A6",
		"A7",
		"A8",
		"Q2",
		"Q3",
		"Q5",
		"Q7",
		"Q8",
		"TT",
		"R8",
		"e-tron",
		"RS3",
		"RS4",
		"RS5",
		"RS6",
	],

	nissan: [
		"March",
		"Versa",
		"Sentra",
		"Kicks",
		"Frontier",
		"Livina",
		"Grand Livina",
		"Tiida",
		"Altima",
		"Maxima",
		"Pathfinder",
		"X-Trail",
		"Murano",
		"Leaf",
		"GT-R",
	],

	lifan: ["320", "530", "620", "X60", "X80", "Foison"],

	peugeot: [
		"106",
		"205",
		"206",
		"207",
		"208",
		"2008",
		"306",
		"307",
		"308",
		"3008",
		"408",
		"508",
		"5008",
		"Partner",
		"Expert",
		"Boxer",
		"RCZ",
	],

	renault: [
		"Clio",
		"Sandero",
		"Logan",
		"Duster",
		"Duster Oroch",
		"Captur",
		"Kwid",
		"Megane",
		"Fluence",
		"Scenic",
		"Symbol",
		"Kangoo",
		"Master",
		"Kardian",
		"Megane E-Tech",
	],

	seat: [
		"Ibiza",
		"Cordoba",
		"Leon",
		"Toledo",
		"Altea",
		"Ateca",
		"Arona",
		"Tarraco",
	],

	subaru: [
		"Impreza",
		"WRX",
		"WRX STI",
		"Legacy",
		"Outback",
		"Forester",
		"XV",
		"BRZ",
		"Tribeca",
	],

	suzuki: [
		"Jimny",
		"Grand Vitara",
		"Vitara",
		"S-Cross",
		"SX4",
		"Swift",
		"Baleno",
		"Ignis",
		"Samurai",
	],

	volvo: [
		"C30",
		"S40",
		"S60",
		"S80",
		"S90",
		"V40",
		"V60",
		"V90",
		"XC40",
		"XC60",
		"XC70",
		"XC90",
		"EX30",
		"EX90",
	],
} as const;

async function seedModels() {
	for (const [brandSlug, modelNames] of Object.entries(modelsSeedByBrandSlug)) {
		const brand = await prisma.brand.findUnique({
			where: { slug: brandSlug },
			select: { id: true, name: true, slug: true },
		});

		if (!brand) {
			console.warn(`Marca não encontrada: ${brandSlug}`);
			continue;
		}

		await prisma.model.createMany({
			data: modelNames.map((name: string) => ({
				name,
				slug: slugify(name),
				brandId: brand.id,
			})),
			skipDuplicates: true,
		});

		console.log(`Modelos inseridos para ${brand.name}`);
	}
}

async function seedBrands() {
	const brandsSeed = [
		{ name: "Abarth", slug: "abarth" },
		{ name: "Agrale", slug: "agrale" },
		{ name: "Alfa Romeo", slug: "alfa-romeo" },
		{ name: "Aston Martin", slug: "aston-martin" },
		{ name: "Audi", slug: "audi" },
		{ name: "BMW", slug: "bmw" },
		{ name: "BYD", slug: "byd" },
		{ name: "Caoa Chery", slug: "caoa-chery" },
		{ name: "Changan", slug: "changan" },
		{ name: "Chevrolet", slug: "chevrolet" },
		{ name: "Chrysler", slug: "chrysler" },
		{ name: "Citroën", slug: "citroen" },
		{ name: "Dodge", slug: "dodge" },
		{ name: "Effa", slug: "effa" },
		{ name: "Ferrari", slug: "ferrari" },
		{ name: "Fiat", slug: "fiat" },
		{ name: "Ford", slug: "ford" },
		{ name: "GWM", slug: "gwm" },
		{ name: "Honda", slug: "honda" },
		{ name: "Hyundai", slug: "hyundai" },
		{ name: "Iveco", slug: "iveco" },
		{ name: "JAC", slug: "jac" },
		{ name: "Jaguar", slug: "jaguar" },
		{ name: "Jeep", slug: "jeep" },
		{ name: "Kia", slug: "kia" },
		{ name: "Lamborghini", slug: "lamborghini" },
		{ name: "Land Rover", slug: "land-rover" },
		{ name: "Lexus", slug: "lexus" },
		{ name: "Lifan", slug: "lifan" },
		{ name: "Maserati", slug: "maserati" },
		{ name: "McLaren", slug: "mclaren" },
		{ name: "Mercedes-Benz", slug: "mercedes-benz" },
		{ name: "Mini", slug: "mini" },
		{ name: "Mitsubishi", slug: "mitsubishi" },
		{ name: "Nissan", slug: "nissan" },
		{ name: "Peugeot", slug: "peugeot" },
		{ name: "Porsche", slug: "porsche" },
		{ name: "RAM", slug: "ram" },
		{ name: "Renault", slug: "renault" },
		{ name: "Rolls-Royce", slug: "rolls-royce" },
		{ name: "Seat", slug: "seat" },
		{ name: "Smart", slug: "smart" },
		{ name: "Subaru", slug: "subaru" },
		{ name: "Suzuki", slug: "suzuki" },
		{ name: "Tesla", slug: "tesla" },
		{ name: "Toyota", slug: "toyota" },
		{ name: "Troller", slug: "troller" },
		{ name: "Volkswagen", slug: "volkswagen" },
		{ name: "Volvo", slug: "volvo" },
	];

	await prisma.brand.createMany({
		data: brandsSeed,
		skipDuplicates: true,
	});
}

type VersionSeed = {
	versionName: string;
	engine?: string;
	transmission?: string;
	years: number[];
};

type ModelVersionsSeed = Record<string, VersionSeed[]>;

function slugify(value: string): string {
	return value
		.normalize("NFD")
		.replace(/[\u0300-\u036f]/g, "")
		.toLowerCase()
		.replace(/&/g, "e")
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/(^-|-$)+/g, "");
}

function yearRange(start: number, end: number): number[] {
	const years: number[] = [];

	for (let year = start; year <= end; year++) {
		years.push(year);
	}

	return years;
}

/**
 * Chave: `${brandSlug}:${modelSlug}`
 *
 * Exemplo:
 * volkswagen:polo
 * fiat:argo
 * honda:civic
 */
const curatedVersionsByModel: ModelVersionsSeed = {
	// Volkswagen
	"volkswagen:gol": [
		{
			versionName: "1.0",
			engine: "1.0",
			transmission: "Manual",
			years: yearRange(2010, 2023),
		},
		{
			versionName: "1.6",
			engine: "1.6",
			transmission: "Manual",
			years: yearRange(2010, 2023),
		},
		{
			versionName: "Track 1.0",
			engine: "1.0",
			transmission: "Manual",
			years: yearRange(2013, 2018),
		},
	],

	"volkswagen:polo": [
		{
			versionName: "MPI 1.0",
			engine: "1.0",
			transmission: "Manual",
			years: yearRange(2018, 2025),
		},
		{
			versionName: "TSI 1.0",
			engine: "1.0 Turbo",
			transmission: "Automático",
			years: yearRange(2018, 2025),
		},
		{
			versionName: "Highline 200 TSI",
			engine: "1.0 Turbo",
			transmission: "Automático",
			years: yearRange(2018, 2025),
		},
		{
			versionName: "GTS 250 TSI",
			engine: "1.4 Turbo",
			transmission: "Automático",
			years: yearRange(2020, 2025),
		},
	],

	"volkswagen:virtus": [
		{
			versionName: "MPI 1.0",
			engine: "1.0",
			transmission: "Manual",
			years: yearRange(2018, 2025),
		},
		{
			versionName: "Comfortline 200 TSI",
			engine: "1.0 Turbo",
			transmission: "Automático",
			years: yearRange(2018, 2025),
		},
		{
			versionName: "Highline 200 TSI",
			engine: "1.0 Turbo",
			transmission: "Automático",
			years: yearRange(2018, 2025),
		},
		{
			versionName: "Exclusive 250 TSI",
			engine: "1.4 Turbo",
			transmission: "Automático",
			years: yearRange(2023, 2025),
		},
	],

	"volkswagen:t-cross": [
		{
			versionName: "Sense 200 TSI",
			engine: "1.0 Turbo",
			transmission: "Automático",
			years: yearRange(2020, 2025),
		},
		{
			versionName: "Comfortline 200 TSI",
			engine: "1.0 Turbo",
			transmission: "Automático",
			years: yearRange(2019, 2025),
		},
		{
			versionName: "Highline 250 TSI",
			engine: "1.4 Turbo",
			transmission: "Automático",
			years: yearRange(2019, 2025),
		},
	],

	"volkswagen:nivus": [
		{
			versionName: "Comfortline 200 TSI",
			engine: "1.0 Turbo",
			transmission: "Automático",
			years: yearRange(2021, 2025),
		},
		{
			versionName: "Highline 200 TSI",
			engine: "1.0 Turbo",
			transmission: "Automático",
			years: yearRange(2021, 2025),
		},
	],

	"volkswagen:jetta": [
		{
			versionName: "Comfortline 250 TSI",
			engine: "1.4 Turbo",
			transmission: "Automático",
			years: yearRange(2018, 2024),
		},
		{
			versionName: "R-Line 250 TSI",
			engine: "1.4 Turbo",
			transmission: "Automático",
			years: yearRange(2018, 2024),
		},
		{
			versionName: "GLI 350 TSI",
			engine: "2.0 Turbo",
			transmission: "Automático",
			years: yearRange(2019, 2025),
		},
	],

	"volkswagen:amarok": [
		{
			versionName: "SE 2.0 TDI 4x4",
			engine: "2.0 Diesel",
			transmission: "Manual",
			years: yearRange(2011, 2024),
		},
		{
			versionName: "Highline V6 3.0 TDI 4x4",
			engine: "3.0 V6 Diesel",
			transmission: "Automático",
			years: yearRange(2018, 2025),
		},
		{
			versionName: "Extreme V6 3.0 TDI 4x4",
			engine: "3.0 V6 Diesel",
			transmission: "Automático",
			years: yearRange(2018, 2025),
		},
	],

	// Fiat
	"fiat:uno": [
		{
			versionName: "Mille 1.0",
			engine: "1.0",
			transmission: "Manual",
			years: yearRange(2010, 2013),
		},
		{
			versionName: "Vivace 1.0",
			engine: "1.0",
			transmission: "Manual",
			years: yearRange(2011, 2016),
		},
		{
			versionName: "Attractive 1.0",
			engine: "1.0",
			transmission: "Manual",
			years: yearRange(2011, 2021),
		},
		{
			versionName: "Way 1.4",
			engine: "1.4",
			transmission: "Manual",
			years: yearRange(2011, 2021),
		},
	],

	"fiat:mobi": [
		{
			versionName: "Easy 1.0",
			engine: "1.0",
			transmission: "Manual",
			years: yearRange(2017, 2020),
		},
		{
			versionName: "Like 1.0",
			engine: "1.0",
			transmission: "Manual",
			years: yearRange(2017, 2025),
		},
		{
			versionName: "Trekking 1.0",
			engine: "1.0",
			transmission: "Manual",
			years: yearRange(2021, 2025),
		},
	],

	"fiat:argo": [
		{
			versionName: "Drive 1.0",
			engine: "1.0",
			transmission: "Manual",
			years: yearRange(2018, 2025),
		},
		{
			versionName: "Drive 1.3",
			engine: "1.3",
			transmission: "Manual",
			years: yearRange(2018, 2025),
		},
		{
			versionName: "Trekking 1.3",
			engine: "1.3",
			transmission: "Manual",
			years: yearRange(2020, 2025),
		},
		{
			versionName: "Precision 1.8 AT",
			engine: "1.8",
			transmission: "Automático",
			years: yearRange(2018, 2022),
		},
	],

	"fiat:cronos": [
		{
			versionName: "Drive 1.0",
			engine: "1.0",
			transmission: "Manual",
			years: yearRange(2023, 2025),
		},
		{
			versionName: "Drive 1.3",
			engine: "1.3",
			transmission: "Manual",
			years: yearRange(2019, 2025),
		},
		{
			versionName: "Precision 1.3 CVT",
			engine: "1.3",
			transmission: "CVT",
			years: yearRange(2023, 2025),
		},
	],

	"fiat:strada": [
		{
			versionName: "Working 1.4",
			engine: "1.4",
			transmission: "Manual",
			years: yearRange(2010, 2020),
		},
		{
			versionName: "Endurance 1.4",
			engine: "1.4",
			transmission: "Manual",
			years: yearRange(2021, 2025),
		},
		{
			versionName: "Freedom 1.3",
			engine: "1.3",
			transmission: "Manual",
			years: yearRange(2021, 2025),
		},
		{
			versionName: "Volcano 1.3",
			engine: "1.3",
			transmission: "Manual",
			years: yearRange(2021, 2025),
		},
		{
			versionName: "Ranch 1.0 Turbo CVT",
			engine: "1.0 Turbo",
			transmission: "CVT",
			years: yearRange(2024, 2025),
		},
	],

	"fiat:toro": [
		{
			versionName: "Freedom 1.8 AT6",
			engine: "1.8",
			transmission: "Automático",
			years: yearRange(2017, 2021),
		},
		{
			versionName: "Freedom 1.3 Turbo AT6",
			engine: "1.3 Turbo",
			transmission: "Automático",
			years: yearRange(2022, 2025),
		},
		{
			versionName: "Volcano 1.3 Turbo AT6",
			engine: "1.3 Turbo",
			transmission: "Automático",
			years: yearRange(2022, 2025),
		},
		{
			versionName: "Ultra 2.0 Diesel 4x4 AT9",
			engine: "2.0 Diesel",
			transmission: "Automático",
			years: yearRange(2021, 2025),
		},
	],

	"fiat:pulse": [
		{
			versionName: "Drive 1.3",
			engine: "1.3",
			transmission: "Manual",
			years: yearRange(2022, 2025),
		},
		{
			versionName: "Drive 1.3 CVT",
			engine: "1.3",
			transmission: "CVT",
			years: yearRange(2022, 2025),
		},
		{
			versionName: "Audace 1.0 Turbo CVT",
			engine: "1.0 Turbo",
			transmission: "CVT",
			years: yearRange(2022, 2025),
		},
		{
			versionName: "Impetus 1.0 Turbo CVT",
			engine: "1.0 Turbo",
			transmission: "CVT",
			years: yearRange(2022, 2025),
		},
		{
			versionName: "Abarth 1.3 Turbo AT6",
			engine: "1.3 Turbo",
			transmission: "Automático",
			years: yearRange(2023, 2025),
		},
	],

	"fiat:fastback": [
		{
			versionName: "Audace 1.0 Turbo CVT",
			engine: "1.0 Turbo",
			transmission: "CVT",
			years: yearRange(2023, 2025),
		},
		{
			versionName: "Impetus 1.0 Turbo CVT",
			engine: "1.0 Turbo",
			transmission: "CVT",
			years: yearRange(2023, 2025),
		},
		{
			versionName: "Limited Edition 1.3 Turbo AT6",
			engine: "1.3 Turbo",
			transmission: "Automático",
			years: yearRange(2023, 2025),
		},
		{
			versionName: "Abarth 1.3 Turbo AT6",
			engine: "1.3 Turbo",
			transmission: "Automático",
			years: yearRange(2024, 2025),
		},
	],

	// Ford
	"ford:ka": [
		{
			versionName: "SE 1.0",
			engine: "1.0",
			transmission: "Manual",
			years: yearRange(2015, 2021),
		},
		{
			versionName: "SE Plus 1.0",
			engine: "1.0",
			transmission: "Manual",
			years: yearRange(2015, 2021),
		},
		{
			versionName: "SEL 1.5",
			engine: "1.5",
			transmission: "Manual",
			years: yearRange(2015, 2021),
		},
		{
			versionName: "FreeStyle 1.5 AT",
			engine: "1.5",
			transmission: "Automático",
			years: yearRange(2019, 2021),
		},
	],

	"ford:ecosport": [
		{
			versionName: "SE 1.5",
			engine: "1.5",
			transmission: "Manual",
			years: yearRange(2018, 2021),
		},
		{
			versionName: "SE 1.5 AT",
			engine: "1.5",
			transmission: "Automático",
			years: yearRange(2018, 2021),
		},
		{
			versionName: "Freestyle 1.5 AT",
			engine: "1.5",
			transmission: "Automático",
			years: yearRange(2018, 2021),
		},
		{
			versionName: "Titanium 2.0 AT",
			engine: "2.0",
			transmission: "Automático",
			years: yearRange(2018, 2021),
		},
	],

	"ford:ranger": [
		{
			versionName: "XL 2.2 Diesel 4x4",
			engine: "2.2 Diesel",
			transmission: "Manual",
			years: yearRange(2013, 2023),
		},
		{
			versionName: "XLS 2.2 Diesel 4x4 AT",
			engine: "2.2 Diesel",
			transmission: "Automático",
			years: yearRange(2013, 2023),
		},
		{
			versionName: "Limited 3.2 Diesel 4x4 AT",
			engine: "3.2 Diesel",
			transmission: "Automático",
			years: yearRange(2013, 2023),
		},
		{
			versionName: "Limited 3.0 V6 Diesel 4x4 AT",
			engine: "3.0 V6 Diesel",
			transmission: "Automático",
			years: yearRange(2024, 2025),
		},
	],

	"ford:territory": [
		{
			versionName: "SEL 1.5 Turbo",
			engine: "1.5 Turbo",
			transmission: "Automático",
			years: yearRange(2021, 2023),
		},
		{
			versionName: "Titanium 1.5 Turbo",
			engine: "1.5 Turbo",
			transmission: "Automático",
			years: yearRange(2021, 2025),
		},
	],

	// Mercedes-Benz
	"mercedes-benz:classe-a": [
		{
			versionName: "A 200",
			engine: "1.3 Turbo",
			transmission: "Automático",
			years: yearRange(2013, 2025),
		},
		{
			versionName: "A 250",
			engine: "2.0 Turbo",
			transmission: "Automático",
			years: yearRange(2013, 2022),
		},
		{
			versionName: "AMG A 35",
			engine: "2.0 Turbo",
			transmission: "Automático",
			years: yearRange(2020, 2025),
		},
	],

	"mercedes-benz:classe-c": [
		{
			versionName: "C 180",
			engine: "1.6 Turbo",
			transmission: "Automático",
			years: yearRange(2012, 2025),
		},
		{
			versionName: "C 200",
			engine: "1.5 Turbo",
			transmission: "Automático",
			years: yearRange(2012, 2025),
		},
		{
			versionName: "C 300",
			engine: "2.0 Turbo",
			transmission: "Automático",
			years: yearRange(2015, 2025),
		},
		{
			versionName: "AMG C 43",
			engine: "3.0 V6 Turbo",
			transmission: "Automático",
			years: yearRange(2017, 2025),
		},
	],

	"mercedes-benz:gla": [
		{
			versionName: "GLA 200",
			engine: "1.6 Turbo",
			transmission: "Automático",
			years: yearRange(2015, 2025),
		},
		{
			versionName: "GLA 250",
			engine: "2.0 Turbo",
			transmission: "Automático",
			years: yearRange(2015, 2020),
		},
		{
			versionName: "AMG GLA 35",
			engine: "2.0 Turbo",
			transmission: "Automático",
			years: yearRange(2021, 2025),
		},
	],

	"mercedes-benz:glc": [
		{
			versionName: "GLC 250",
			engine: "2.0 Turbo",
			transmission: "Automático",
			years: yearRange(2016, 2020),
		},
		{
			versionName: "GLC 300",
			engine: "2.0 Turbo",
			transmission: "Automático",
			years: yearRange(2019, 2025),
		},
		{
			versionName: "AMG GLC 43",
			engine: "3.0 V6 Turbo",
			transmission: "Automático",
			years: yearRange(2017, 2025),
		},
	],

	// BMW
	"bmw:serie-1": [
		{
			versionName: "118i",
			engine: "1.5 Turbo",
			transmission: "Automático",
			years: yearRange(2012, 2025),
		},
		{
			versionName: "120i",
			engine: "2.0 Turbo",
			transmission: "Automático",
			years: yearRange(2012, 2025),
		},
		{
			versionName: "M135i",
			engine: "2.0 Turbo",
			transmission: "Automático",
			years: yearRange(2013, 2025),
		},
	],

	"bmw:serie-3": [
		{
			versionName: "320i",
			engine: "2.0 Turbo",
			transmission: "Automático",
			years: yearRange(2010, 2025),
		},
		{
			versionName: "328i",
			engine: "2.0 Turbo",
			transmission: "Automático",
			years: yearRange(2012, 2016),
		},
		{
			versionName: "330i",
			engine: "2.0 Turbo",
			transmission: "Automático",
			years: yearRange(2016, 2025),
		},
		{
			versionName: "M340i",
			engine: "3.0 Turbo",
			transmission: "Automático",
			years: yearRange(2020, 2025),
		},
	],

	"bmw:x1": [
		{
			versionName: "sDrive18i",
			engine: "1.5 Turbo",
			transmission: "Automático",
			years: yearRange(2016, 2025),
		},
		{
			versionName: "sDrive20i",
			engine: "2.0 Turbo",
			transmission: "Automático",
			years: yearRange(2011, 2025),
		},
		{
			versionName: "xDrive25i",
			engine: "2.0 Turbo",
			transmission: "Automático",
			years: yearRange(2016, 2021),
		},
	],

	"bmw:x3": [
		{
			versionName: "xDrive20i",
			engine: "2.0 Turbo",
			transmission: "Automático",
			years: yearRange(2012, 2025),
		},
		{
			versionName: "xDrive30i",
			engine: "2.0 Turbo",
			transmission: "Automático",
			years: yearRange(2018, 2025),
		},
		{
			versionName: "M40i",
			engine: "3.0 Turbo",
			transmission: "Automático",
			years: yearRange(2018, 2025),
		},
	],

	// Hyundai
	"hyundai:hb20": [
		{
			versionName: "Sense 1.0",
			engine: "1.0",
			transmission: "Manual",
			years: yearRange(2020, 2025),
		},
		{
			versionName: "Comfort 1.0",
			engine: "1.0",
			transmission: "Manual",
			years: yearRange(2013, 2025),
		},
		{
			versionName: "Comfort Plus 1.0 Turbo",
			engine: "1.0 Turbo",
			transmission: "Automático",
			years: yearRange(2020, 2025),
		},
		{
			versionName: "Platinum 1.0 Turbo",
			engine: "1.0 Turbo",
			transmission: "Automático",
			years: yearRange(2023, 2025),
		},
	],

	"hyundai:hb20s": [
		{
			versionName: "Comfort 1.0",
			engine: "1.0",
			transmission: "Manual",
			years: yearRange(2014, 2025),
		},
		{
			versionName: "Comfort Plus 1.0 Turbo",
			engine: "1.0 Turbo",
			transmission: "Automático",
			years: yearRange(2020, 2025),
		},
		{
			versionName: "Platinum 1.0 Turbo",
			engine: "1.0 Turbo",
			transmission: "Automático",
			years: yearRange(2023, 2025),
		},
	],

	"hyundai:creta": [
		{
			versionName: "Attitude 1.6",
			engine: "1.6",
			transmission: "Manual",
			years: yearRange(2017, 2021),
		},
		{
			versionName: "Pulse 1.6 AT",
			engine: "1.6",
			transmission: "Automático",
			years: yearRange(2017, 2021),
		},
		{
			versionName: "Limited 1.0 Turbo",
			engine: "1.0 Turbo",
			transmission: "Automático",
			years: yearRange(2022, 2025),
		},
		{
			versionName: "Platinum 1.0 Turbo",
			engine: "1.0 Turbo",
			transmission: "Automático",
			years: yearRange(2022, 2025),
		},
		{
			versionName: "Ultimate 2.0",
			engine: "2.0",
			transmission: "Automático",
			years: yearRange(2022, 2025),
		},
	],

	"hyundai:tucson": [
		{
			versionName: "GLS 2.0 AT",
			engine: "2.0",
			transmission: "Automático",
			years: yearRange(2010, 2017),
		},
		{
			versionName: "Limited 1.6 Turbo",
			engine: "1.6 Turbo",
			transmission: "Automático",
			years: yearRange(2017, 2023),
		},
	],

	// Honda
	"honda:fit": [
		{
			versionName: "DX 1.4",
			engine: "1.4",
			transmission: "Manual",
			years: yearRange(2010, 2014),
		},
		{
			versionName: "LX 1.5",
			engine: "1.5",
			transmission: "Manual",
			years: yearRange(2015, 2021),
		},
		{
			versionName: "EX 1.5 CVT",
			engine: "1.5",
			transmission: "CVT",
			years: yearRange(2015, 2021),
		},
		{
			versionName: "EXL 1.5 CVT",
			engine: "1.5",
			transmission: "CVT",
			years: yearRange(2015, 2021),
		},
	],

	"honda:city": [
		{
			versionName: "DX 1.5",
			engine: "1.5",
			transmission: "Manual",
			years: yearRange(2010, 2014),
		},
		{
			versionName: "LX 1.5 CVT",
			engine: "1.5",
			transmission: "CVT",
			years: yearRange(2015, 2025),
		},
		{
			versionName: "EX 1.5 CVT",
			engine: "1.5",
			transmission: "CVT",
			years: yearRange(2015, 2025),
		},
		{
			versionName: "EXL 1.5 CVT",
			engine: "1.5",
			transmission: "CVT",
			years: yearRange(2015, 2025),
		},
		{
			versionName: "Touring 1.5 CVT",
			engine: "1.5",
			transmission: "CVT",
			years: yearRange(2022, 2025),
		},
	],

	"honda:civic": [
		{
			versionName: "LXS 1.8",
			engine: "1.8",
			transmission: "Manual",
			years: yearRange(2010, 2016),
		},
		{
			versionName: "LXR 2.0",
			engine: "2.0",
			transmission: "Automático",
			years: yearRange(2014, 2016),
		},
		{
			versionName: "Sport 2.0 CVT",
			engine: "2.0",
			transmission: "CVT",
			years: yearRange(2017, 2021),
		},
		{
			versionName: "EX 2.0 CVT",
			engine: "2.0",
			transmission: "CVT",
			years: yearRange(2017, 2021),
		},
		{
			versionName: "EXL 2.0 CVT",
			engine: "2.0",
			transmission: "CVT",
			years: yearRange(2017, 2021),
		},
		{
			versionName: "Touring 1.5 Turbo CVT",
			engine: "1.5 Turbo",
			transmission: "CVT",
			years: yearRange(2017, 2025),
		},
		{
			versionName: "Advanced Hybrid",
			engine: "2.0 Hybrid",
			transmission: "e-CVT",
			years: yearRange(2023, 2025),
		},
	],

	"honda:hr-v": [
		{
			versionName: "LX 1.8 CVT",
			engine: "1.8",
			transmission: "CVT",
			years: yearRange(2016, 2021),
		},
		{
			versionName: "EX 1.8 CVT",
			engine: "1.8",
			transmission: "CVT",
			years: yearRange(2016, 2021),
		},
		{
			versionName: "EXL 1.8 CVT",
			engine: "1.8",
			transmission: "CVT",
			years: yearRange(2016, 2021),
		},
		{
			versionName: "EX 1.5 CVT",
			engine: "1.5",
			transmission: "CVT",
			years: yearRange(2023, 2025),
		},
		{
			versionName: "Touring 1.5 Turbo CVT",
			engine: "1.5 Turbo",
			transmission: "CVT",
			years: yearRange(2023, 2025),
		},
	],

	// Mitsubishi
	"mitsubishi:lancer": [
		{
			versionName: "HL 2.0 CVT",
			engine: "2.0",
			transmission: "CVT",
			years: yearRange(2011, 2019),
		},
		{
			versionName: "GT 2.0 CVT",
			engine: "2.0",
			transmission: "CVT",
			years: yearRange(2011, 2019),
		},
	],

	"mitsubishi:asx": [
		{
			versionName: "2.0 CVT",
			engine: "2.0",
			transmission: "CVT",
			years: yearRange(2011, 2022),
		},
		{
			versionName: "4x4 2.0 CVT",
			engine: "2.0",
			transmission: "CVT",
			years: yearRange(2011, 2022),
		},
	],

	"mitsubishi:eclipse-cross": [
		{
			versionName: "HPE 1.5 Turbo CVT",
			engine: "1.5 Turbo",
			transmission: "CVT",
			years: yearRange(2019, 2025),
		},
		{
			versionName: "HPE-S 1.5 Turbo CVT",
			engine: "1.5 Turbo",
			transmission: "CVT",
			years: yearRange(2019, 2025),
		},
	],

	"mitsubishi:l200-triton": [
		{
			versionName: "GLX 3.2 Diesel 4x4",
			engine: "3.2 Diesel",
			transmission: "Manual",
			years: yearRange(2010, 2018),
		},
		{
			versionName: "HPE 2.4 Diesel 4x4 AT",
			engine: "2.4 Diesel",
			transmission: "Automático",
			years: yearRange(2017, 2025),
		},
		{
			versionName: "Sport HPE-S 2.4 Diesel 4x4 AT",
			engine: "2.4 Diesel",
			transmission: "Automático",
			years: yearRange(2019, 2025),
		},
	],

	// Toyota
	"toyota:corolla": [
		{
			versionName: "GLi 1.8",
			engine: "1.8",
			transmission: "Manual",
			years: yearRange(2010, 2019),
		},
		{
			versionName: "XEi 2.0 CVT",
			engine: "2.0",
			transmission: "CVT",
			years: yearRange(2015, 2025),
		},
		{
			versionName: "Altis 2.0 CVT",
			engine: "2.0",
			transmission: "CVT",
			years: yearRange(2015, 2025),
		},
		{
			versionName: "Altis Hybrid CVT",
			engine: "1.8 Hybrid",
			transmission: "CVT",
			years: yearRange(2020, 2025),
		},
	],

	"toyota:corolla-cross": [
		{
			versionName: "XR 2.0 CVT",
			engine: "2.0",
			transmission: "CVT",
			years: yearRange(2022, 2025),
		},
		{
			versionName: "XRE 2.0 CVT",
			engine: "2.0",
			transmission: "CVT",
			years: yearRange(2022, 2025),
		},
		{
			versionName: "XRX Hybrid CVT",
			engine: "1.8 Hybrid",
			transmission: "CVT",
			years: yearRange(2022, 2025),
		},
	],

	"toyota:hilux": [
		{
			versionName: "SR 2.8 Diesel 4x4 AT",
			engine: "2.8 Diesel",
			transmission: "Automático",
			years: yearRange(2016, 2025),
		},
		{
			versionName: "SRV 2.8 Diesel 4x4 AT",
			engine: "2.8 Diesel",
			transmission: "Automático",
			years: yearRange(2016, 2025),
		},
		{
			versionName: "SRX 2.8 Diesel 4x4 AT",
			engine: "2.8 Diesel",
			transmission: "Automático",
			years: yearRange(2016, 2025),
		},
	],

	"toyota:sw4": [
		{
			versionName: "SRX 2.8 Diesel 4x4 AT",
			engine: "2.8 Diesel",
			transmission: "Automático",
			years: yearRange(2016, 2025),
		},
		{
			versionName: "Diamond 2.8 Diesel 4x4 AT",
			engine: "2.8 Diesel",
			transmission: "Automático",
			years: yearRange(2021, 2025),
		},
	],

	"toyota:yaris": [
		{
			versionName: "XL 1.3 CVT",
			engine: "1.3",
			transmission: "CVT",
			years: yearRange(2019, 2025),
		},
		{
			versionName: "XS 1.5 CVT",
			engine: "1.5",
			transmission: "CVT",
			years: yearRange(2019, 2025),
		},
		{
			versionName: "XLS 1.5 CVT",
			engine: "1.5",
			transmission: "CVT",
			years: yearRange(2019, 2025),
		},
	],

	// BYD
	"byd:dolphin": [
		{
			versionName: "EV",
			engine: "Elétrico",
			transmission: "Automático",
			years: yearRange(2024, 2025),
		},
		{
			versionName: "Plus EV",
			engine: "Elétrico",
			transmission: "Automático",
			years: yearRange(2024, 2025),
		},
	],

	"byd:dolphin-mini": [
		{
			versionName: "EV",
			engine: "Elétrico",
			transmission: "Automático",
			years: yearRange(2024, 2025),
		},
	],

	"byd:seal": [
		{
			versionName: "EV",
			engine: "Elétrico",
			transmission: "Automático",
			years: yearRange(2024, 2025),
		},
	],

	"byd:song-plus": [
		{
			versionName: "DM-i",
			engine: "Híbrido plug-in",
			transmission: "Automático",
			years: yearRange(2023, 2025),
		},
	],

	"byd:yuan-plus": [
		{
			versionName: "EV",
			engine: "Elétrico",
			transmission: "Automático",
			years: yearRange(2023, 2025),
		},
	],

	// Citroën
	"citroen:c3": [
		{
			versionName: "Live 1.0",
			engine: "1.0",
			transmission: "Manual",
			years: yearRange(2023, 2025),
		},
		{
			versionName: "Feel 1.0",
			engine: "1.0",
			transmission: "Manual",
			years: yearRange(2023, 2025),
		},
		{
			versionName: "Feel Pack 1.6 AT",
			engine: "1.6",
			transmission: "Automático",
			years: yearRange(2023, 2025),
		},
	],

	"citroen:c4-cactus": [
		{
			versionName: "Live 1.6",
			engine: "1.6",
			transmission: "Automático",
			years: yearRange(2019, 2024),
		},
		{
			versionName: "Feel 1.6 AT",
			engine: "1.6",
			transmission: "Automático",
			years: yearRange(2019, 2024),
		},
		{
			versionName: "Shine 1.6 THP",
			engine: "1.6 Turbo",
			transmission: "Automático",
			years: yearRange(2019, 2024),
		},
	],

	// JAC
	"jac:t40": [
		{
			versionName: "1.5 Manual",
			engine: "1.5",
			transmission: "Manual",
			years: yearRange(2018, 2023),
		},
		{
			versionName: "1.6 CVT",
			engine: "1.6",
			transmission: "CVT",
			years: yearRange(2018, 2023),
		},
	],

	"jac:e-js1": [
		{
			versionName: "EV",
			engine: "Elétrico",
			transmission: "Automático",
			years: yearRange(2022, 2025),
		},
	],

	"jac:e-js4": [
		{
			versionName: "EV",
			engine: "Elétrico",
			transmission: "Automático",
			years: yearRange(2022, 2025),
		},
	],

	// Jeep
	"jeep:renegade": [
		{
			versionName: "Sport 1.8 AT",
			engine: "1.8",
			transmission: "Automático",
			years: yearRange(2016, 2021),
		},
		{
			versionName: "Longitude 1.8 AT",
			engine: "1.8",
			transmission: "Automático",
			years: yearRange(2016, 2021),
		},
		{
			versionName: "Sport T270 AT",
			engine: "1.3 Turbo",
			transmission: "Automático",
			years: yearRange(2022, 2025),
		},
		{
			versionName: "Longitude T270 AT",
			engine: "1.3 Turbo",
			transmission: "Automático",
			years: yearRange(2022, 2025),
		},
		{
			versionName: "Trailhawk 2.0 Diesel 4x4 AT",
			engine: "2.0 Diesel",
			transmission: "Automático",
			years: yearRange(2016, 2021),
		},
	],

	"jeep:compass": [
		{
			versionName: "Sport 2.0 Flex AT",
			engine: "2.0",
			transmission: "Automático",
			years: yearRange(2017, 2021),
		},
		{
			versionName: "Longitude T270 AT",
			engine: "1.3 Turbo",
			transmission: "Automático",
			years: yearRange(2022, 2025),
		},
		{
			versionName: "Limited T270 AT",
			engine: "1.3 Turbo",
			transmission: "Automático",
			years: yearRange(2022, 2025),
		},
		{
			versionName: "Trailhawk 2.0 Diesel 4x4 AT",
			engine: "2.0 Diesel",
			transmission: "Automático",
			years: yearRange(2017, 2025),
		},
	],

	"jeep:commander": [
		{
			versionName: "Longitude T270 AT",
			engine: "1.3 Turbo",
			transmission: "Automático",
			years: yearRange(2022, 2025),
		},
		{
			versionName: "Limited T270 AT",
			engine: "1.3 Turbo",
			transmission: "Automático",
			years: yearRange(2022, 2025),
		},
		{
			versionName: "Overland 2.0 Diesel 4x4 AT",
			engine: "2.0 Diesel",
			transmission: "Automático",
			years: yearRange(2022, 2025),
		},
	],

	// Jaguar
	"jaguar:xe": [
		{
			versionName: "R-Sport 2.0 Turbo",
			engine: "2.0 Turbo",
			transmission: "Automático",
			years: yearRange(2016, 2020),
		},
	],

	"jaguar:f-pace": [
		{
			versionName: "Prestige 2.0 Turbo",
			engine: "2.0 Turbo",
			transmission: "Automático",
			years: yearRange(2017, 2025),
		},
		{
			versionName: "R-Dynamic 2.0 Turbo",
			engine: "2.0 Turbo",
			transmission: "Automático",
			years: yearRange(2020, 2025),
		},
	],

	"jaguar:e-pace": [
		{
			versionName: "R-Dynamic 2.0 Turbo",
			engine: "2.0 Turbo",
			transmission: "Automático",
			years: yearRange(2019, 2025),
		},
	],

	// Audi
	"audi:a3": [
		{
			versionName: "1.4 TFSI",
			engine: "1.4 Turbo",
			transmission: "Automático",
			years: yearRange(2014, 2020),
		},
		{
			versionName: "Performance Black 2.0 TFSI",
			engine: "2.0 Turbo",
			transmission: "Automático",
			years: yearRange(2016, 2022),
		},
		{
			versionName: "S line 2.0 TFSI",
			engine: "2.0 Turbo",
			transmission: "Automático",
			years: yearRange(2022, 2025),
		},
	],

	"audi:a4": [
		{
			versionName: "Ambiente 2.0 TFSI",
			engine: "2.0 Turbo",
			transmission: "Automático",
			years: yearRange(2013, 2018),
		},
		{
			versionName: "Prestige Plus 2.0 TFSI",
			engine: "2.0 Turbo",
			transmission: "Automático",
			years: yearRange(2019, 2025),
		},
	],

	"audi:q3": [
		{
			versionName: "Prestige 1.4 TFSI",
			engine: "1.4 Turbo",
			transmission: "Automático",
			years: yearRange(2016, 2021),
		},
		{
			versionName: "Performance Black 2.0 TFSI",
			engine: "2.0 Turbo",
			transmission: "Automático",
			years: yearRange(2016, 2025),
		},
	],

	"audi:q5": [
		{
			versionName: "Ambiente 2.0 TFSI",
			engine: "2.0 Turbo",
			transmission: "Automático",
			years: yearRange(2013, 2018),
		},
		{
			versionName: "Prestige 2.0 TFSI",
			engine: "2.0 Turbo",
			transmission: "Automático",
			years: yearRange(2019, 2025),
		},
	],

	// Nissan
	"nissan:march": [
		{
			versionName: "S 1.0",
			engine: "1.0",
			transmission: "Manual",
			years: yearRange(2012, 2020),
		},
		{
			versionName: "SV 1.6",
			engine: "1.6",
			transmission: "Manual",
			years: yearRange(2012, 2020),
		},
		{
			versionName: "SL 1.6 CVT",
			engine: "1.6",
			transmission: "CVT",
			years: yearRange(2017, 2020),
		},
	],

	"nissan:versa": [
		{
			versionName: "S 1.6",
			engine: "1.6",
			transmission: "Manual",
			years: yearRange(2012, 2020),
		},
		{
			versionName: "SV 1.6 CVT",
			engine: "1.6",
			transmission: "CVT",
			years: yearRange(2017, 2025),
		},
		{
			versionName: "Advance 1.6 CVT",
			engine: "1.6",
			transmission: "CVT",
			years: yearRange(2021, 2025),
		},
		{
			versionName: "Exclusive 1.6 CVT",
			engine: "1.6",
			transmission: "CVT",
			years: yearRange(2021, 2025),
		},
	],

	"nissan:kicks": [
		{
			versionName: "S 1.6 CVT",
			engine: "1.6",
			transmission: "CVT",
			years: yearRange(2017, 2025),
		},
		{
			versionName: "SV 1.6 CVT",
			engine: "1.6",
			transmission: "CVT",
			years: yearRange(2017, 2025),
		},
		{
			versionName: "SL 1.6 CVT",
			engine: "1.6",
			transmission: "CVT",
			years: yearRange(2017, 2021),
		},
		{
			versionName: "Exclusive 1.6 CVT",
			engine: "1.6",
			transmission: "CVT",
			years: yearRange(2022, 2025),
		},
	],

	"nissan:frontier": [
		{
			versionName: "S 2.3 Diesel 4x4 MT",
			engine: "2.3 Diesel",
			transmission: "Manual",
			years: yearRange(2018, 2025),
		},
		{
			versionName: "Attack 2.3 Diesel 4x4 AT",
			engine: "2.3 Diesel",
			transmission: "Automático",
			years: yearRange(2018, 2025),
		},
		{
			versionName: "Platinum 2.3 Diesel 4x4 AT",
			engine: "2.3 Diesel",
			transmission: "Automático",
			years: yearRange(2018, 2025),
		},
	],

	// Lifan
	"lifan:x60": [
		{
			versionName: "Talent 1.8",
			engine: "1.8",
			transmission: "Manual",
			years: yearRange(2013, 2020),
		},
		{
			versionName: "VIP 1.8 CVT",
			engine: "1.8",
			transmission: "CVT",
			years: yearRange(2016, 2020),
		},
	],

	// Peugeot
	"peugeot:208": [
		{
			versionName: "Active 1.2",
			engine: "1.2",
			transmission: "Manual",
			years: yearRange(2014, 2020),
		},
		{
			versionName: "Allure 1.6 AT",
			engine: "1.6",
			transmission: "Automático",
			years: yearRange(2014, 2021),
		},
		{
			versionName: "Like 1.0",
			engine: "1.0",
			transmission: "Manual",
			years: yearRange(2023, 2025),
		},
		{
			versionName: "Style 1.0",
			engine: "1.0",
			transmission: "Manual",
			years: yearRange(2023, 2025),
		},
		{
			versionName: "GT 1.0 Turbo CVT",
			engine: "1.0 Turbo",
			transmission: "CVT",
			years: yearRange(2024, 2025),
		},
	],

	"peugeot:2008": [
		{
			versionName: "Allure 1.6 AT",
			engine: "1.6",
			transmission: "Automático",
			years: yearRange(2016, 2023),
		},
		{
			versionName: "Griffe 1.6 THP AT",
			engine: "1.6 Turbo",
			transmission: "Automático",
			years: yearRange(2016, 2023),
		},
	],

	"peugeot:3008": [
		{
			versionName: "Griffe 1.6 THP",
			engine: "1.6 Turbo",
			transmission: "Automático",
			years: yearRange(2012, 2023),
		},
		{
			versionName: "GT Pack 1.6 THP",
			engine: "1.6 Turbo",
			transmission: "Automático",
			years: yearRange(2019, 2023),
		},
	],

	// Renault
	"renault:kwid": [
		{
			versionName: "Zen 1.0",
			engine: "1.0",
			transmission: "Manual",
			years: yearRange(2018, 2025),
		},
		{
			versionName: "Intense 1.0",
			engine: "1.0",
			transmission: "Manual",
			years: yearRange(2018, 2025),
		},
		{
			versionName: "Outsider 1.0",
			engine: "1.0",
			transmission: "Manual",
			years: yearRange(2020, 2025),
		},
	],

	"renault:sandero": [
		{
			versionName: "Authentique 1.0",
			engine: "1.0",
			transmission: "Manual",
			years: yearRange(2010, 2019),
		},
		{
			versionName: "Expression 1.0",
			engine: "1.0",
			transmission: "Manual",
			years: yearRange(2010, 2023),
		},
		{
			versionName: "Stepway 1.6",
			engine: "1.6",
			transmission: "Manual",
			years: yearRange(2010, 2023),
		},
		{
			versionName: "RS 2.0",
			engine: "2.0",
			transmission: "Manual",
			years: yearRange(2016, 2021),
		},
	],

	"renault:logan": [
		{
			versionName: "Authentique 1.0",
			engine: "1.0",
			transmission: "Manual",
			years: yearRange(2010, 2019),
		},
		{
			versionName: "Expression 1.0",
			engine: "1.0",
			transmission: "Manual",
			years: yearRange(2010, 2023),
		},
		{
			versionName: "Dynamique 1.6",
			engine: "1.6",
			transmission: "Manual",
			years: yearRange(2014, 2020),
		},
	],

	"renault:duster": [
		{
			versionName: "Expression 1.6",
			engine: "1.6",
			transmission: "Manual",
			years: yearRange(2012, 2020),
		},
		{
			versionName: "Dynamique 2.0 4x4",
			engine: "2.0",
			transmission: "Manual",
			years: yearRange(2012, 2020),
		},
		{
			versionName: "Intense 1.6 CVT",
			engine: "1.6",
			transmission: "CVT",
			years: yearRange(2021, 2025),
		},
		{
			versionName: "Iconic 1.6 CVT",
			engine: "1.6",
			transmission: "CVT",
			years: yearRange(2021, 2025),
		},
	],

	"renault:captur": [
		{
			versionName: "Zen 1.6 CVT",
			engine: "1.6",
			transmission: "CVT",
			years: yearRange(2018, 2021),
		},
		{
			versionName: "Intense 1.3 Turbo CVT",
			engine: "1.3 Turbo",
			transmission: "CVT",
			years: yearRange(2022, 2024),
		},
	],

	// Seat
	"seat:ibiza": [
		{
			versionName: "1.0 TSI",
			engine: "1.0 Turbo",
			transmission: "Manual",
			years: yearRange(2017, 2024),
		},
	],

	"seat:leon": [
		{
			versionName: "1.4 TSI",
			engine: "1.4 Turbo",
			transmission: "Automático",
			years: yearRange(2014, 2024),
		},
		{
			versionName: "Cupra 2.0 TSI",
			engine: "2.0 Turbo",
			transmission: "Automático",
			years: yearRange(2014, 2024),
		},
	],

	// Subaru
	"subaru:forester": [
		{
			versionName: "2.0 AWD CVT",
			engine: "2.0",
			transmission: "CVT",
			years: yearRange(2014, 2025),
		},
		{
			versionName: "XT 2.0 Turbo AWD CVT",
			engine: "2.0 Turbo",
			transmission: "CVT",
			years: yearRange(2014, 2018),
		},
	],

	"subaru:impreza": [
		{
			versionName: "2.0 AWD CVT",
			engine: "2.0",
			transmission: "CVT",
			years: yearRange(2010, 2023),
		},
	],

	"subaru:wrx": [
		{
			versionName: "2.0 Turbo AWD",
			engine: "2.0 Turbo",
			transmission: "Manual",
			years: yearRange(2015, 2023),
		},
		{
			versionName: "2.4 Turbo AWD",
			engine: "2.4 Turbo",
			transmission: "Manual",
			years: yearRange(2022, 2025),
		},
	],

	// Suzuki
	"suzuki:jimny": [
		{
			versionName: "4All 1.3 4x4",
			engine: "1.3",
			transmission: "Manual",
			years: yearRange(2010, 2019),
		},
		{
			versionName: "Sierra 1.5 4x4",
			engine: "1.5",
			transmission: "Automático",
			years: yearRange(2020, 2025),
		},
	],

	"suzuki:vitara": [
		{
			versionName: "4You 1.6",
			engine: "1.6",
			transmission: "Automático",
			years: yearRange(2017, 2021),
		},
		{
			versionName: "4Sport 1.4 Turbo",
			engine: "1.4 Turbo",
			transmission: "Automático",
			years: yearRange(2017, 2021),
		},
	],

	"suzuki:s-cross": [
		{
			versionName: "4Style 1.4 Turbo",
			engine: "1.4 Turbo",
			transmission: "Automático",
			years: yearRange(2017, 2021),
		},
		{
			versionName: "4Style AllGrip 1.4 Turbo",
			engine: "1.4 Turbo",
			transmission: "Automático",
			years: yearRange(2017, 2021),
		},
	],

	// Volvo
	"volvo:xc40": [
		{
			versionName: "T4 Momentum",
			engine: "2.0 Turbo",
			transmission: "Automático",
			years: yearRange(2019, 2022),
		},
		{
			versionName: "T5 R-Design",
			engine: "2.0 Turbo",
			transmission: "Automático",
			years: yearRange(2019, 2021),
		},
		{
			versionName: "Recharge Pure Electric",
			engine: "Elétrico",
			transmission: "Automático",
			years: yearRange(2022, 2025),
		},
	],

	"volvo:xc60": [
		{
			versionName: "T5 Momentum",
			engine: "2.0 Turbo",
			transmission: "Automático",
			years: yearRange(2018, 2021),
		},
		{
			versionName: "T8 Recharge",
			engine: "Híbrido plug-in",
			transmission: "Automático",
			years: yearRange(2020, 2025),
		},
		{
			versionName: "B5 Inscription",
			engine: "2.0 Turbo Mild Hybrid",
			transmission: "Automático",
			years: yearRange(2022, 2025),
		},
	],

	"volvo:xc90": [
		{
			versionName: "T6 Momentum",
			engine: "2.0 Turbo",
			transmission: "Automático",
			years: yearRange(2016, 2021),
		},
		{
			versionName: "T8 Recharge",
			engine: "Híbrido plug-in",
			transmission: "Automático",
			years: yearRange(2018, 2025),
		},
	],
};

const DEFAULT_VERSION: VersionSeed = {
	versionName: "Única",
	engine: null as unknown as string,
	transmission: null as unknown as string,
	years: yearRange(2010, 2025),
};

async function main() {
	await seedBrands();
	await seedModels();

	const models = await prisma.model.findMany({
		include: {
			brand: true,
		},
		orderBy: [
			{
				brand: {
					name: "asc",
				},
			},
			{
				name: "asc",
			},
		],
	});

	for (const model of models) {
		const key = `${model.brand.slug}:${model.slug}`;

		const versions = curatedVersionsByModel[key] ?? [DEFAULT_VERSION];

		for (const version of versions) {
			const versionSlug = slugify(version.versionName);

			const carVersion = await prisma.carVersion.upsert({
				where: {
					carVersion_modelId_slug_unique: {
						modelId: model.id,
						slug: versionSlug,
					},
				},
				update: {
					versionName: version.versionName,
					engine: version.engine ?? null,
					transmission: version.transmission ?? null,
				},
				create: {
					modelId: model.id,
					versionName: version.versionName,
					engine: version.engine ?? null,
					transmission: version.transmission ?? null,
					slug: versionSlug,
				},
			});

			await prisma.carVersionYear.createMany({
				data: version.years.map((year) => ({
					carVersionId: carVersion.id,
					year,
				})),
				skipDuplicates: true,
			});
		}

		console.log(
			`Versões/anos inseridos para ${model.brand.name} ${model.name}`,
		);
	}

	await prisma.role.upsert({
		where: { name: "user" },
		update: {},
		create: { name: "user" },
	});

	await prisma.role.upsert({
		where: { name: "admin" },
		update: {},
		create: { name: "admin" },
	});
}

main()
	.catch((e) => {
		console.error(e);
		process.exit(1);
	})
	.finally(() => prisma.$disconnect());

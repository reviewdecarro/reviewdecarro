// apps/web/lib/data.ts
import type { BlogPost, Car, ForumComment, Review, Thread } from "@/types";

export const cars: Car[] = [
	{
		id: 1,
		brand: "Toyota",
		model: "Corolla Cross",
		year: 2024,
		segment: "SUV",
		price: "$31,500",
		engine: "2.0L híbrido",
		power: "196 hp",
		fuelEconomy: "42 mpg",
		transmission: "CVT",
	},
	{
		id: 2,
		brand: "Honda",
		model: "Civic",
		year: 2024,
		segment: "Sedã",
		price: "$27,200",
		engine: "1.5L turbo",
		power: "158 hp",
		fuelEconomy: "36 mpg",
		transmission: "CVT",
	},
	{
		id: 3,
		brand: "Ford",
		model: "Ranger",
		year: 2025,
		segment: "Picape",
		price: "$34,900",
		engine: "2.3L EcoBoost",
		power: "270 hp",
		fuelEconomy: "24 mpg",
		transmission: "Auto de 10 marchas",
	},
	{
		id: 4,
		brand: "Tesla",
		model: "Model 3",
		year: 2024,
		segment: "Elétrico",
		price: "$42,000",
		engine: "Elétrico",
		power: "358 hp",
		fuelEconomy: "134 MPGe",
		transmission: "1 marcha",
	},
	{
		id: 5,
		brand: "Volkswagen",
		model: "Polo",
		year: 2024,
		segment: "Hatch",
		price: "$24,500",
		engine: "1.0L TSI",
		power: "116 hp",
		fuelEconomy: "38 mpg",
		transmission: "Auto de 6 marchas",
	},
	{
		id: 6,
		brand: "BMW",
		model: "3 Series",
		year: 2024,
		segment: "Sedã",
		price: "$44,900",
		engine: "2.0L TwinTurbo",
		power: "255 hp",
		fuelEconomy: "32 mpg",
		transmission: "Auto de 8 marchas",
	},
	{
		id: 7,
		brand: "Jeep",
		model: "Compass",
		year: 2025,
		segment: "SUV",
		price: "$33,200",
		engine: "2.0L turbo",
		power: "200 hp",
		fuelEconomy: "29 mpg",
		transmission: "Auto de 9 marchas",
	},
	{
		id: 8,
		brand: "Chevrolet",
		model: "Onix",
		year: 2024,
		segment: "Hatch",
		price: "$22,000",
		engine: "1.0L turbo",
		power: "116 hp",
		fuelEconomy: "37 mpg",
		transmission: "Auto de 6 marchas",
	},
];

export const reviews: Review[] = [
	{
		id: 1,
		carId: 4,
		title: "Tesla Model 3 2024: Ainda é a referência entre os elétricos",
		score: 9.2,
		scoreBreakdown: {
			Performance: 9.5,
			Comfort: 8.8,
			Technology: 9.8,
			Value: 8.5,
			Reliability: 9.0,
		},
		author: "alexreview",
		date: "há 1 dia",
		comments: 23,
		votes: 156,
		excerpt:
			"Depois de anos no topo, o Model 3 continua definindo o padrão dos carros elétricos. A atualização de 2024 traz um interior mais marcante e autonomia ampliada, o que afasta ainda mais o modelo da concorrência.",
		pros: [
			"Autonomia excelente e rede Supercharger",
			"Tecnologia e software líderes do setor",
			"Atualizações remotas mantêm o carro atual",
			"Desempenho forte em todas as versões",
		],
		cons: [
			"Qualidade de montagem ainda inconsistente na entrega",
			"Falta de controles físicos para funções simples",
			"Seguro mais caro que o dos rivais",
		],
		verdict:
			"O Model 3 continua sendo a referência em elétricos. Mesmo com a concorrência crescente de Hyundai, VW e BMW, o ecossistema e o software da Tesla mantêm o modelo no topo da categoria.",
	},
	{
		id: 2,
		carId: 2,
		title: "Honda Civic 2024: Uma aula de carro para o dia a dia",
		score: 9.0,
		scoreBreakdown: {
			Performance: 8.5,
			Comfort: 9.0,
			Technology: 8.8,
			Value: 9.5,
			Reliability: 9.2,
		},
		author: "marinacar",
		date: "há 3 dias",
		comments: 18,
		votes: 112,
		excerpt:
			"O Civic sempre foi a referência entre os sedãs compactos. O modelo 2024 refina o que já era bom sem mexer no que funciona — continua sendo a escolha inteligente para quem dirige todos os dias.",
		pros: [
			"Dirige de forma envolvente e precisa",
			"Interior espaçoso e bem-acabado",
			"Confiabilidade excepcional no longo prazo",
			"Preço competitivo com ótimo custo-benefício",
		],
		cons: [
			"A interface multimídia exige um período de adaptação",
			"Espaço traseiro de cabeça um pouco limitado",
		],
		verdict:
			"O Civic da Honda segue como um dos melhores carros compactos que o dinheiro pode comprar. É excelente para quem usa o carro no dia a dia e também nos fins de semana.",
	},
	{
		id: 3,
		carId: 6,
		title: "BMW Série 3 2024: O sedã esportivo definitivo",
		score: 9.1,
		scoreBreakdown: {
			Performance: 9.5,
			Comfort: 8.8,
			Technology: 9.0,
			Value: 7.5,
			Reliability: 8.5,
		},
		author: "carlosm",
		date: "há 5 dias",
		comments: 31,
		votes: 98,
		excerpt:
			"A Série 3 continua sendo o sedã esportivo premium definitivo. Direção afiada, cabine refinada e o caráter dinâmico típico da BMW tornam o carro quase imbatível no segmento.",
		pros: [
			"Dinâmica focada no motorista e imbatível na categoria",
			"Interior premium e muito bem construído",
			"Motores potentes e imediatos na resposta",
			"Pacote completo de tecnologia e segurança",
		],
		cons: [
			"Preço dos opcionais sobe rápido",
			"Porta-malas pequeno para a categoria",
			"iDrive pode ser complexo para alguns usuários",
		],
		verdict:
			"Ainda é a escolha do motorista no segmento premium compacto. Vale cada centavo para quem gosta de dirigir de verdade e valoriza engenharia de ponta.",
	},
	{
		id: 4,
		carId: 1,
		title: "Toyota Corolla Cross Hybrid: A sensatez nunca pareceu tão boa",
		score: 8.5,
		scoreBreakdown: {
			Performance: 7.5,
			Comfort: 8.8,
			Technology: 8.5,
			Value: 9.2,
			Reliability: 9.5,
		},
		author: "pedroh",
		date: "há 1 semana",
		comments: 12,
		votes: 74,
		excerpt:
			"A Toyota pegou a fórmula do Corolla, que já vende muito, e adicionou eficiência híbrida a uma carroceria mais alta, estilo SUV. O resultado é um carro familiar sensato, capaz e econômico, difícil de criticar.",
		pros: [
			"Eficiência híbrida excepcional",
			"Confiabilidade lendária da Toyota",
			"Conforto e rodagem refinados",
			"Toyota Safety Sense de série em toda a linha",
		],
		cons: [
			"Não empolga quem busca emoção ao volante",
			"O CVT pode parecer pouco inspirador em estrada",
		],
		verdict:
			"Se praticidade, confiabilidade e valor são suas prioridades, o Corolla Cross Hybrid é quase impossível de contestar. A escolha sensata que não parece um sacrifício.",
	},
	{
		id: 5,
		carId: 3,
		title: "Ford Ranger 2025: A picape que faz de tudo",
		score: 8.2,
		scoreBreakdown: {
			Performance: 8.5,
			Comfort: 7.8,
			Technology: 8.2,
			Value: 8.0,
			Reliability: 8.5,
		},
		author: "frederico",
		date: "há 1 semana",
		comments: 9,
		votes: 61,
		excerpt:
			"A picape média da Ford recebe atualizações importantes para 2025. Seja levando carga, encarando trilhas ou apenas rodando na cidade, a Ranger entrega polidez e capacidade em todas as situações.",
		pros: [
			"Capaz no fora de estrada",
			"Motor EcoBoost forte e refinado",
			"Boa capacidade de carga e reboque",
			"Cabine bem equipada com boa tecnologia",
		],
		cons: [
			"Suspensão firme no asfalto",
			"Consumo abaixo da média da categoria",
		],
		verdict:
			"É a melhor picape média para quem precisa de capacidade real sem os custos de uma picape grande. A Ranger finalmente entrega o que prometia.",
	},
	{
		id: 6,
		carId: 7,
		title: "Jeep Compass 2025: Finalmente fazendo jus ao nome",
		score: 8.4,
		scoreBreakdown: {
			Performance: 8.0,
			Comfort: 8.5,
			Technology: 7.8,
			Value: 8.2,
			Reliability: 8.0,
		},
		author: "sarahv",
		date: "há 2 semanas",
		comments: 15,
		votes: 55,
		excerpt:
			"Depois de anos correndo atrás dos rivais, o Compass 2025 chega com interior realmente premium, melhores credenciais fora de estrada e o tipo de herança Jeep que muitos compradores querem.",
		pros: [
			"Qualidade interna muito melhorada",
			"Visual icônico da Jeep e tradição off-road",
			"Pacotes off-road fortes disponíveis",
			"Conforto de rodagem aprimorado",
		],
		cons: [
			"A multimídia ainda fica atrás de alguns concorrentes",
			"Consumo decepciona perto dos líderes da categoria",
		],
		verdict:
			"Um Compass bem mais convincente e finalmente competitivo no segmento de utilitários esportivos compactos. A Jeep corrigiu as principais críticas e entregou algo que vale considerar.",
	},
];

export const threads: Thread[] = [
	{
		id: 1,
		title: "Qual é o melhor primeiro carro até US$ 25.000 em 2026?",
		author: "Lucas_F",
		date: "há 2 horas",
		votes: 89,
		comments: 47,
		views: "18,3 mil",
		category: "Dicas de compra",
	},
	{
		id: 2,
		title:
			"Toyota x Honda em confiabilidade — quem realmente vence no longo prazo?",
		author: "marianag",
		date: "há 4 horas",
		votes: 74,
		comments: 63,
		views: "21,1 mil",
		category: "Discussão",
	},
	{
		id: 3,
		title:
			"Elétrico x híbrido em 2026 — o que faz mais sentido financeiramente?",
		author: "techdriver",
		date: "há 6 horas",
		votes: 61,
		comments: 38,
		views: "9,7 mil",
		category: "Discussão",
	},
	{
		id: 4,
		title: "Melhores dicas para negociar na concessionária sem perder a cabeça",
		author: "rafaelb",
		date: "há 12 horas",
		votes: 55,
		comments: 29,
		views: "14,2 mil",
		category: "Dicas de compra",
	},
	{
		id: 5,
		title: "A BMW Série 3 realmente vale a pena quando existe o Honda Civic?",
		author: "philosopherdriver",
		date: "há 1 dia",
		votes: 48,
		comments: 71,
		views: "8,9 mil",
		category: "Discussão",
	},
];

export const comments: ForumComment[] = [
	{
		id: 1,
		author: "alexreview",
		date: "há 1 hora",
		body: "Concordo com o ponto sobre autonomia. No uso real ele entrega o que promete.",
		contextType: "review",
		contextTitle: "Tesla Model 3 2024: Ainda é a referência entre os elétricos",
	},
	{
		id: 2,
		author: "marinacar",
		date: "há 3 horas",
		body: "O Civic continua muito equilibrado. Para mim, é o sedã mais fácil de recomendar.",
		contextType: "review",
		contextTitle: "Honda Civic 2024: Uma aula de carro para o dia a dia",
	},
	{
		id: 3,
		author: "carlosm",
		date: "há 6 horas",
		body: "No longo prazo, o custo de manutenção pesa mais do que a ficha técnica.",
		contextType: "thread",
		contextTitle: "Toyota x Honda em confiabilidade — quem realmente vence no longo prazo?",
	},
	{
		id: 4,
		author: "pedroh",
		date: "há 1 dia",
		body: "O híbrido faz sentido aqui justamente porque entrega eficiência sem sacrificar conforto.",
		contextType: "review",
		contextTitle: "Toyota Corolla Cross Hybrid: A sensatez nunca pareceu tão boa",
	},
	{
		id: 5,
		author: "frederico",
		date: "há 1 dia",
		body: "A Ranger ficou mais madura. Para quem usa picape de verdade, isso faz diferença.",
		contextType: "review",
		contextTitle: "Ford Ranger 2025: A picape que faz de tudo",
	},
	{
		id: 6,
		author: "sarahv",
		date: "há 2 dias",
		body: "O Compass melhorou muito, mas ainda tem espaço para a Jeep resolver detalhes da central.",
		contextType: "review",
		contextTitle: "Jeep Compass 2025: Finalmente fazendo jus ao nome",
	},
];

export const blogPosts: BlogPost[] = [
	{
		id: 1,
		title: "10 elétricos para acompanhar no segundo semestre de 2026",
		category: "Notícias",
		date: "Hoje",
		readTime: "5 min de leitura",
	},
	{
		id: 2,
		title: "Como ler uma avaliação de carro sem cair em armadilhas",
		category: "Guia",
		date: "Ontem",
		readTime: "7 min de leitura",
	},
	{
		id: 3,
		title:
			"A ascensão dos utilitários esportivos híbridos: por que todo mundo quer um",
		category: "Análise",
		date: "há 3 dias",
		readTime: "9 min de leitura",
	},
	{
		id: 4,
		title: "Guia de compra de usados 2026: evite estes erros",
		category: "Guia",
		date: "há 1 semana",
		readTime: "12 min de leitura",
	},
];

export function getCarById(id: number): Car | undefined {
	return cars.find((c) => c.id === id);
}

export function getReviewById(id: number): Review | undefined {
	return reviews.find((r) => r.id === id);
}

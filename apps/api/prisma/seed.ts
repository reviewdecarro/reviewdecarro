import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "./generated/client";

const prisma = new PrismaClient({
	adapter: new PrismaPg({
		connectionString: process.env.DATABASE_URL,
	}),
});

async function main() {
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

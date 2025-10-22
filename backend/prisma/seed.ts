// backend/prisma/seed.ts
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash("admin123", 10);

  const admin = await prisma.user.upsert({
    where: { email: "admin@teste.com" },
    update: {},
    create: {
      name: "Administrador",
      email: "admin@teste.com",
      password: hashedPassword,
      role: "ADMIN",
    },
  });

  console.log("Admin criado:", admin);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

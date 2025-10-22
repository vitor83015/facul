import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // 1️⃣ Deletar usuários sem senha hashada
  const invalidUsers = await prisma.user.findMany({
    where: {
      password: { not: { startsWith: "$2" } }, // não começa com bcrypt
    },
  });

  console.log("Usuários sem senha hashada a deletar:", invalidUsers.map(u => u.email));

  for (const u of invalidUsers) {
    await prisma.user.delete({ where: { id: u.id } });
  }

  // 2️⃣ Criar admin
  const hashedAdmin = await bcrypt.hash("admin123", 10);
  await prisma.user.upsert({
    where: { email: "admin@teste.com" },
    update: {},
    create: {
      name: "Administrador",
      email: "admin@teste.com",
      password: hashedAdmin,
      role: "ADMIN",
    },
  });

  // 3️⃣ Criar usuário Vitor
  const hashedVitor = await bcrypt.hash("123456", 10);
  await prisma.user.upsert({
    where: { email: "vitor83015@gmail.com" },
    update: {},
    create: {
      name: "Vitor",
      email: "vitor83015@gmail.com",
      password: hashedVitor,
      role: "CLIENT",
    },
  });

  console.log("Usuários corrigidos com senha hashada!");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });

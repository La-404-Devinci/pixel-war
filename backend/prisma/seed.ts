import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const userCount =
    Number(
      process.argv
        .find((arg) => arg.startsWith("userCount="))
        ?.replace(/^userCount=/, ""),
    ) ?? 10;
  const usersPromise = [] as Promise<unknown>[];
  for (let i = 1; i <= userCount; i++) {
    const user = prisma.account.upsert({
      where: {
        devinciEmail: `user_${i}@edu.devinci.fr`,
      },
      update: {
        placedPixels: Math.floor(Math.random() * 3000),
      },
      create: {
        devinciEmail: `user_${i}@edu.devinci.fr`,
        placedPixels: Math.floor(Math.random() * 3000),
      },
    });
    usersPromise.push(user);
  }
  await Promise.all(usersPromise);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });

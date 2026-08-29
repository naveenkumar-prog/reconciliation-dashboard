// src/test.ts

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const orderCount = await prisma.order.count();
  const paymentCount = await prisma.payment.count();

  console.log({ orderCount, paymentCount });
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
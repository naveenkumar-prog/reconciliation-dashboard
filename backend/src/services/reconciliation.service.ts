import { prisma } from "../utils/prisma";

const normalize = (
  value?: string | null
) => value?.trim().toUpperCase();

export const reconcileUserData = async (
  userId: string
) => {
  const orders =
    await prisma.order.findMany({
      where: { userId }
    });

  const payments =
    await prisma.payment.findMany({
      where: { userId }
    });

  await prisma.reconciliationResult.deleteMany({
    where: { userId }
  });

  const paymentMap = new Map<
    string,
    any[]
  >();

  const processedPayments =
    new Set<string>();

  // Build lookup map

  for (const payment of payments) {
    const key = normalize(
      payment.orderRef
    );

    if (!key) continue;

    if (!paymentMap.has(key)) {
      paymentMap.set(key, []);
    }

    paymentMap?.get(key)?.push(payment);
  }

  // Process orders

  for (const order of orders) {
    const key = normalize(
      order.orderRef
    );

    if (!key) continue;

    const matchingPayments =
      paymentMap.get(key);

    // Missing Payment

    if (!matchingPayments) {
      await prisma.reconciliationResult.create({
        data: {
          userId,
          orderRef: order.orderRef,
          discrepancyType:
            "MISSING_PAYMENT",
          orderAmount:
            order.amount,
          riskAmount:
            order.amount,
          notes:
            "Order exists but payment missing"
        }
      });

      continue;
    }

    matchingPayments.forEach(
      (p) =>
        processedPayments.add(
          p.id
        )
    );

    // Failed Payment

    const failed =
      matchingPayments.some(
        (p) =>
          p.status?.toLowerCase() ===
          "failed"
      );

    if (failed) {
      await prisma.reconciliationResult.create({
        data: {
          userId,
          orderRef: order.orderRef,
          discrepancyType:
            "FAILED_PAYMENT",
          orderAmount:
            order.amount,
          riskAmount:
            order.amount
        }
      });

      continue;
    }

    // Pending Payment

    const pending =
      matchingPayments.some(
        (p) =>
          p.status?.toLowerCase() ===
          "pending"
      );

    if (pending) {
      await prisma.reconciliationResult.create({
        data: {
          userId,
          orderRef: order.orderRef,
          discrepancyType:
            "PENDING_PAYMENT",
          orderAmount:
            order.amount,
          riskAmount:
            order.amount
        }
      });

      continue;
    }

    const charges =
      matchingPayments.filter(
        (p) =>
          p.type?.toLowerCase() ===
          "charge"
      );

    const refunds =
      matchingPayments.filter(
        (p) =>
          p.type?.toLowerCase() ===
          "refund"
      );

    const chargedAmount =
      charges.reduce(
        (sum, p) =>
          sum + p.amount,
        0
      );

    const refundAmount =
      refunds.reduce(
        (sum, p) =>
          sum + p.amount,
        0
      );

    const netPaid =
      chargedAmount -
      refundAmount;

    // Full Refund

    if (
      Math.abs(
        refundAmount -
          order.amount
      ) <= 0.05
    ) {
      await prisma.reconciliationResult.create({
        data: {
          userId,
          orderRef:
            order.orderRef,
          discrepancyType:
            "FULL_REFUND",
          orderAmount:
            order.amount,
          paymentAmount:
            netPaid,
          riskAmount:
            order.amount
        }
      });

      continue;
    }

    // Partial Refund

    if (
      refundAmount > 0 &&
      refundAmount <
        order.amount
    ) {
      await prisma.reconciliationResult.create({
        data: {
          userId,
          orderRef:
            order.orderRef,
          discrepancyType:
            "PARTIAL_REFUND",
          orderAmount:
            order.amount,
          paymentAmount:
            netPaid,
          riskAmount:
            refundAmount
        }
      });

      continue;
    }

    // Amount Mismatch

    const difference =
      Math.abs(
        netPaid -
          order.amount
      );

    if (difference > 0.05) {
      await prisma.reconciliationResult.create({
        data: {
          userId,
          orderRef:
            order.orderRef,
          discrepancyType:
            "AMOUNT_MISMATCH",
          orderAmount:
            order.amount,
          paymentAmount:
            netPaid,
          riskAmount:
            difference
        }
      });

      continue;
    }

    // Perfect Match
    // No discrepancy record created
  }

  // Orphan Payments

  for (const payment of payments) {
    if (
      processedPayments.has(
        payment.id
      )
    ) {
      continue;
    }

    await prisma.reconciliationResult.create({
      data: {
        userId,
        orderRef:
          payment.orderRef,
        discrepancyType:
          "ORPHAN_PAYMENT",
        paymentAmount:
          payment.amount,
        riskAmount:
          payment.amount
      }
    });
  }
};
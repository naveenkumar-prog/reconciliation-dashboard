import fs from "fs";
import csv from "csv-parser";

import { prisma } from "../utils/prisma";

const parsePaymentDate = (
  dateStr: string
): Date => {
  const [datePart, timePart] =
    dateStr.split(" ");

  const [day, month, year] =
    datePart.split("/");

  const date = new Date(
    `${year}-${month}-${day}T${timePart}:00`
  );

  if (isNaN(date.getTime())) {
    throw new Error(
      `Invalid payment date: ${dateStr}`
    );
  }

  return date;
};

export const uploadOrders = async (
  req: any,
  res: any
) => {
  const rows: any[] = [];

  fs.createReadStream(req.file.path)
    .pipe(csv())
    .on("data", (row) => {
      rows.push(row);
    })
    .on("end", async () => {
      try {
        if (!rows.length) {
          return res.status(400).json({
            message: "Orders CSV is empty."
          });
        }

        const firstRow = rows[0];

        if (
          !firstRow.order_id ||
          !firstRow.order_date ||
          !firstRow.net_amount
        ) {
          return res.status(400).json({
            message:
              "Invalid Orders CSV. Please upload the Orders file."
          });
        }

        const ordersData = rows.map(
          (row) => {
            const createdAt =
              new Date(
                row.order_date.replace(
                  " ",
                  "T"
                )
              );

            if (
              isNaN(
                createdAt.getTime()
              )
            ) {
              throw new Error(
                `Invalid order date: ${row.order_date}`
              );
            }

            return {
              userId: req.userId,

              orderRef:
                row.order_id,

              customerEmail:
                row.customer_email,

              currency:
                row.currency,

              grossAmount:
                Number(
                  row.gross_amount
                ),

              discount:
                Number(
                  row.discount
                ),

              amount: Number(
                row.net_amount
              ),

              status: row.status,

              createdAt
            };
          }
        );

        // NEW - clear old data for this user

await prisma.reconciliationResult.deleteMany({
  where: {
    userId: req.userId
  }
});

await prisma.order.deleteMany({
  where: {
    userId: req.userId
  }
});

        await prisma.order.createMany({
          data: ordersData
        });

        return res.json({
          message:
            "Orders uploaded successfully",
          count: rows.length
        });
      } catch (error: any) {
        console.error(error);

        return res.status(400).json({
          message:
            error.message ||
            "Failed to upload Orders CSV"
        });
      }
    });
};

export const uploadPayments = async (
  req: any,
  res: any
) => {
  const rows: any[] = [];

  fs.createReadStream(req.file.path)
    .pipe(csv())
    .on("data", (row) => {
      rows.push(row);
    })
    .on("end", async () => {
      try {
        if (!rows.length) {
          return res.status(400).json({
            message:
              "Payments CSV is empty."
          });
        }

        const firstRow = rows[0];

        if (
          !firstRow.transaction_ref ||
          !firstRow.processed_at ||
          !firstRow.amount
        ) {
          return res.status(400).json({
            message:
              "Invalid Payments CSV. Please upload the Payments file."
          });
        }

        const paymentsData =
          rows.map((row) => ({
            userId: req.userId,

            paymentRef:
              row.transaction_ref,

            orderRef:
              row.order_reference,

            currency:
              row.currency,

            amount: Number(
              row.amount
            ),

            fee: Number(
              row.fee
            ),

            netSettled:
              Number(
                row.net_settled
              ),

            type: row.type,

            status:
              row.status,

            createdAt:
              parsePaymentDate(
                row.processed_at
              )
          }));
// NEW - clear old payments for this user

await prisma.reconciliationResult.deleteMany({
  where: {
    userId: req.userId
  }
});

await prisma.payment.deleteMany({
  where: {
    userId: req.userId
  }
});
        await prisma.payment.createMany({
          data: paymentsData
        });

        return res.json({
          message:
            "Payments uploaded successfully",
          count: rows.length
        });
      } catch (error: any) {
        console.error(error);

        return res.status(400).json({
          message:
            error.message ||
            "Failed to upload Payments CSV"
        });
      }
    });
};
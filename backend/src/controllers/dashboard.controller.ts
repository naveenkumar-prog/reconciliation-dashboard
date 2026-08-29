import { prisma } from "../utils/prisma";

export const getSummary = async (
  req: any,
  res: any
) => {
    const userId = req.userId;

const orders = await prisma.order.findMany({
  where: { userId }
});

const payments = await prisma.payment.findMany({
  where: { userId }
});

const discrepancies =
  await prisma.reconciliationResult.findMany({
    where: { userId }
  });

  const totalOrders = orders.length;

const totalPayments = payments.length;

const totalOrderValue =
  orders.reduce(
    (sum, o) => sum + o.amount,
    0
  );

const moneyAtRisk =
  discrepancies.reduce(
    (sum, d) =>
      sum + (d.riskAmount || 0),
    0
  );

const reconciledValue =
  totalOrderValue - moneyAtRisk;

  res.json({
  totalOrders,
  totalPayments,
  totalOrderValue,
  reconciledValue,
  moneyAtRisk,
  discrepancyCount:
    discrepancies.length
});

}

export const getDiscrepancies =
 async (
  req:any,
  res:any
 ) => {
    const rows =
 await prisma.reconciliationResult.findMany({
  where:{
   userId:req.userId
  }
 });

 const grouped =
 Object.values(
  rows.reduce(
   (acc:any,row)=>{

    const type =
     row.discrepancyType;

    if(!acc[type]){
      acc[type]={
       type,
       count:0,
       amount:0
      };
    }

    acc[type].count++;

    acc[type].amount +=
      row.riskAmount || 0;

    return acc;

   },
   {}
  )
 );

 res.json(grouped);
}


export const getResults =
 async (
  req:any,
  res:any
 ) => {
    const {
 page = 1,
 search = "",
 type = ""
}
= req.query;
const where:any = {
 userId:req.userId
};

if (type) {
  where.discrepancyType = String(type);
}

if (search && String(search).trim()) {
  where.OR = [
    {
      orderRef: {
        contains: String(search).trim(),
      },
    },
    {
      discrepancyType: {
        contains: String(search).trim(),
      },
    },
  ];
}

const pageSize = 20;

const results =
 await prisma.reconciliationResult.findMany({
  where,

  skip:
   (Number(page)-1)
   * pageSize,

  take:
   pageSize,

  orderBy:{
   riskAmount:"desc"
  }
 });

 const total =
 await prisma.reconciliationResult.count({
  where
 });

 res.json({
 results,
 total,
 page:Number(page)
});

 }

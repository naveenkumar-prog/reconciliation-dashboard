export default function SummaryCards({
  summary,
}: any) {
  const cards = [
    {
      title: "Total Orders",
      value: summary.totalOrders,
    },
    {
      title: "Total Payments",
      value: summary.totalPayments,
    },
    {
      title: "Reconciled Value",
      value: `$${summary.reconciledValue.toFixed(2)}`,
    },
    {
      title: "Money At Risk",
      value: `$${summary.moneyAtRisk.toFixed(2)}`,
    },
  ];

  return (
    <div className="grid md:grid-cols-4 gap-6">

      {cards.map((card) => (
        <div
          key={card.title}
          className="
          bg-white
          rounded-2xl
          shadow-sm
          border
          p-6
          "
        >
          <p className="text-slate-500">
            {card.title}
          </p>

          <h3 className="text-3xl font-bold mt-2">
            {card.value}
          </h3>
        </div>
      ))}

    </div>
  );
}
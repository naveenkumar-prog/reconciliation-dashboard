import {
  PieChart,
  Pie,
  Tooltip,
} from "recharts";

export default function RiskChart({
  data,
}: any) {
  return (
  <div
    className="
    bg-white
    rounded-2xl
    shadow-sm
    p-6
    border
    "
  >
    <h3 className="font-semibold text-lg mb-4">
      Risk Distribution
    </h3>

    <PieChart
      width={400}
      height={300}
    >
      <Pie
        data={data}
        dataKey="amount"
        nameKey="type"
      />

      <Tooltip />
    </PieChart>
  </div>
);
}
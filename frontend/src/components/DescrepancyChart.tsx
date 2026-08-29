import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

export default function DiscrepancyChart({
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
      Discrepancies By Type
    </h3>

    <BarChart
      width={500}
      height={300}
      data={data}
    >
      <XAxis dataKey="type" />
      <YAxis />
      <Tooltip />
      <Bar
        dataKey="count"
        fill="#2563eb"
      />
    </BarChart>
  </div>
);
}
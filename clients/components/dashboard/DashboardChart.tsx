interface DashboardChartProps {
  title: string;
  type: "line" | "bar" | "pie";
}

export default function DashboardChart({ title, type }: DashboardChartProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-4">DASHBOARD CHART</h3>
      <h4 className="font-medium mb-4">{title}</h4>
      <div className="bg-gray-100 h-64 rounded flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500">Chart Type: {type}</p>
          <p className="text-gray-400">Chart will be rendered here</p>
        </div>
      </div>
    </div>
  );
}

interface AnalyticsChartProps {
  title: string;
  data?: any[];
  height?: number;
}

export default function AnalyticsChart({ title, data, height = 300 }: AnalyticsChartProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-4">ANALYTICS CHART</h3>
      <h4 className="font-medium mb-4">{title}</h4>
      <div 
        className="bg-gray-100 rounded flex items-center justify-center"
        style={{ height: `${height}px` }}
      >
        <div className="text-center">
          <p className="text-gray-500">Analytics visualization</p>
          <p className="text-gray-400">Data points: {data?.length || 0}</p>
        </div>
      </div>
    </div>
  );
}

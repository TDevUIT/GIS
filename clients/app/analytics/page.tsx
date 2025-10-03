export default function AnalyticsPage() {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">ANALYTICS</h1>
      <div className="space-y-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Traffic Analysis</h2>
          <div className="bg-gray-100 h-64 rounded flex items-center justify-center">
            <p className="text-gray-500">Traffic charts will be displayed here</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Air Quality Trends</h2>
          <div className="bg-gray-100 h-64 rounded flex items-center justify-center">
            <p className="text-gray-500">Air quality charts will be displayed here</p>
          </div>
        </div>
      </div>
    </div>
  );
}

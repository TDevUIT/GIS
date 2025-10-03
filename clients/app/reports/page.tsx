export default function ReportsPage() {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">REPORTS</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Traffic Reports</h2>
          <ul className="space-y-2">
            <li className="p-3 bg-gray-50 rounded">Daily Traffic Report - October 2025</li>
            <li className="p-3 bg-gray-50 rounded">Weekly Traffic Summary</li>
            <li className="p-3 bg-gray-50 rounded">Monthly Traffic Analysis</li>
          </ul>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Air Quality Reports</h2>
          <ul className="space-y-2">
            <li className="p-3 bg-gray-50 rounded">Air Quality Index Report</li>
            <li className="p-3 bg-gray-50 rounded">Pollution Monitoring Summary</li>
            <li className="p-3 bg-gray-50 rounded">Environmental Impact Report</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">DASHBOARD</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-blue-100 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-2">Traffic Statistics</h2>
          <p className="text-gray-600">Traffic data overview</p>
        </div>
        <div className="bg-green-100 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-2">Air Quality</h2>
          <p className="text-gray-600">Environmental monitoring</p>
        </div>
        <div className="bg-yellow-100 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-2">Incidents</h2>
          <p className="text-gray-600">Recent incidents</p>
        </div>
      </div>
    </div>
  );
}

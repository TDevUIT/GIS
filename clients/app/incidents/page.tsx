export default function IncidentsPage() {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">INCIDENTS</h1>
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b">
          <h2 className="text-xl font-semibold">Recent Incidents</h2>
        </div>
        <div className="divide-y">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-red-600">Traffic Accident</h3>
                <p className="text-gray-600">Location: District 1, Ho Chi Minh City</p>
                <p className="text-sm text-gray-500">2 hours ago</p>
              </div>
              <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm">High Priority</span>
            </div>
          </div>
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-yellow-600">Air Quality Alert</h3>
                <p className="text-gray-600">Location: District 7, Ho Chi Minh City</p>
                <p className="text-sm text-gray-500">5 hours ago</p>
              </div>
              <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">Medium Priority</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Header() {
  return (
    <header className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">HEADER</h1>
            <p className="text-gray-600">IE402 GIS System</p>
          </div>
          <nav className="flex space-x-6">
            <a href="/dashboard" className="text-gray-600 hover:text-gray-800">Dashboard</a>
            <a href="/maps" className="text-gray-600 hover:text-gray-800">Maps</a>
            <a href="/analytics" className="text-gray-600 hover:text-gray-800">Analytics</a>
            <a href="/reports" className="text-gray-600 hover:text-gray-800">Reports</a>
            <a href="/incidents" className="text-gray-600 hover:text-gray-800">Incidents</a>
          </nav>
        </div>
      </div>
    </header>
  );
}

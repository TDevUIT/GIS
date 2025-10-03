export default function FilterPanel() {
  return (
    <div className="bg-white p-4 rounded-lg shadow mb-6">
      <h3 className="text-lg font-semibold mb-4">FILTER PANEL</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Date Range</label>
          <select className="w-full p-2 border rounded">
            <option>Last 7 days</option>
            <option>Last 30 days</option>
            <option>Last 3 months</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">District</label>
          <select className="w-full p-2 border rounded">
            <option>All Districts</option>
            <option>District 1</option>
            <option>District 7</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Data Type</label>
          <select className="w-full p-2 border rounded">
            <option>Traffic</option>
            <option>Air Quality</option>
            <option>Incidents</option>
          </select>
        </div>
      </div>
    </div>
  );
}

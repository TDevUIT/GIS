export default function MapControls() {
  return (
    <div className="bg-white p-4 rounded-lg shadow mb-4">
      <h3 className="text-lg font-semibold mb-3">MAP CONTROLS</h3>
      <div className="flex gap-2">
        <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
          Traffic Layer
        </button>
        <button className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
          Air Quality
        </button>
        <button className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">
          Incidents
        </button>
      </div>
    </div>
  );
}

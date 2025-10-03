interface IncidentCardProps {
  title: string;
  location: string;
  time: string;
  priority: "high" | "medium" | "low";
  type: string;
}

export default function IncidentCard({ title, location, time, priority, type }: IncidentCardProps) {
  const priorityColors = {
    high: "bg-red-100 text-red-800",
    medium: "bg-yellow-100 text-yellow-800",
    low: "bg-green-100 text-green-800"
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow border-l-4 border-l-red-500">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-semibold">INCIDENT CARD</h3>
        <span className={`px-3 py-1 rounded-full text-sm ${priorityColors[priority]}`}>
          {priority.charAt(0).toUpperCase() + priority.slice(1)} Priority
        </span>
      </div>
      <h4 className="font-medium text-gray-800 mb-1">{title}</h4>
      <p className="text-gray-600 mb-1">Location: {location}</p>
      <p className="text-gray-600 mb-1">Type: {type}</p>
      <p className="text-sm text-gray-500">{time}</p>
    </div>
  );
}

interface ReportCardProps {
  title: string;
  description: string;
  date: string;
  status: "pending" | "completed" | "processing";
}

export default function ReportCard({ title, description, date, status }: ReportCardProps) {
  const statusColors = {
    pending: "bg-yellow-100 text-yellow-800",
    completed: "bg-green-100 text-green-800",
    processing: "bg-blue-100 text-blue-800"
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold">REPORT CARD</h3>
        <span className={`px-3 py-1 rounded-full text-sm ${statusColors[status]}`}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
      </div>
      <h4 className="font-medium text-gray-800 mb-2">{title}</h4>
      <p className="text-gray-600 mb-2">{description}</p>
      <p className="text-sm text-gray-500">Generated: {date}</p>
    </div>
  );
}

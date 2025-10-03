interface StatCardProps {
  title: string;
  value: string;
  color?: string;
}

export default function StatCard({ title, value, color = "blue" }: StatCardProps) {
  return (
    <div className={`bg-${color}-100 p-6 rounded-lg`}>
      <h3 className="text-lg font-semibold mb-2">STAT CARD</h3>
      <h4 className="text-xl font-bold">{title}</h4>
      <p className="text-2xl font-bold text-gray-800">{value}</p>
    </div>
  );
}

export default function DashboardCard({ title, value, onClick }) {
  return (
    <div
      className="bg-white p-4 rounded shadow text-center cursor-pointer hover:bg-blue-50 transition"
      onClick={onClick}
    >
      <h2 className="text-sm font-semibold text-gray-500">{title}</h2>
      <p className="text-2xl font-bold text-blue-600 mt-1">{value}</p>
    </div>
  );
}

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-center mb-4">Military Asset Dashboard</h1>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
        <div className="bg-white shadow p-4 rounded text-center">Opening Balance</div>
        <div className="bg-white shadow p-4 rounded text-center">Closing Balance</div>
        <div className="bg-white shadow p-4 rounded text-center cursor-pointer">Net Movement</div>
        <div className="bg-white shadow p-4 rounded text-center">Assigned</div>
        <div className="bg-white shadow p-4 rounded text-center">Expended</div>
      </div>
    </div>
  );
}

// src/pages/Dashboard.jsx
import React, { useState } from 'react';
import { Dialog, DialogTrigger, DialogContent, DialogTitle } from '@/components/ui/dialog';

useEffect(() => {
  axios.get("http://localhost:8000/api/dashboard/", { withCredentials: true })
    .then((res) => setMetrics(res.data))
    .catch((err) => console.error("Dashboard fetch error:", err));
}, []);
const fetchFilteredMetrics = (filters) => {
  axios.get("http://localhost:8000/api/dashboard/", {
    params: filters,
    withCredentials: true,
  })
  .then((res) => setMetrics(res.data))
  .catch((err) => console.error("Filtered fetch error:", err));
};

const Dashboard = () => {
  const [filters, setFilters] = useState({ date: '', base: '', type: '' });
  const [detailsOpen, setDetailsOpen] = useState(false);

  const dummyData = {
    opening_balance: 120,
    closing_balance: 95,
    net_movement: 25,
    assigned: 30,
    expended: 20,
    details: {
      purchases: 20,
      transfer_in: 10,
      transfer_out: 5,
    },
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <div className="grid grid-cols-3 gap-4">
        {Object.entries({
          'Opening Balance': dummyData.opening_balance,
          'Closing Balance': dummyData.closing_balance,
          'Net Movement': dummyData.net_movement,
          'Assigned': dummyData.assigned,
          'Expended': dummyData.expended,
        }).map(([label, value]) => (
          <div
            key={label}
            className="bg-white p-4 rounded-xl shadow hover:bg-gray-100 cursor-pointer"
            onClick={() => label === 'Net Movement' && setDetailsOpen(true)}
          >
            <h2 className="text-lg font-semibold">{label}</h2>
            <p className="text-2xl text-blue-600">{value}</p>
          </div>
        ))}
      </div>

      <div className="mt-6">
        <h3 className="font-medium mb-2">Filters</h3>
        <div className="flex gap-4">
          <input
            type="date"
            className="border p-2 rounded"
            onChange={(e) => setFilters({ ...filters, date: e.target.value })}
          />
          <input
            placeholder="Base"
            className="border p-2 rounded"
            onChange={(e) => setFilters({ ...filters, base: e.target.value })}
          />
          <input
            placeholder="Equipment Type"
            className="border p-2 rounded"
            onChange={(e) => setFilters({ ...filters, type: e.target.value })}
          />
        </div>
      </div>

      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogTrigger asChild></DialogTrigger>
        <DialogContent>
          <DialogTitle>Net Movement Details</DialogTitle>
          <ul className="mt-2 list-disc pl-6">
            <li>Purchases: {dummyData.details.purchases}</li>
            <li>Transfer In: {dummyData.details.transfer_in}</li>
            <li>Transfer Out: {dummyData.details.transfer_out}</li>
          </ul>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Dashboard;

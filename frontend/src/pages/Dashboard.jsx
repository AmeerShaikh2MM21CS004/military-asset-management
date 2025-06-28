// src/pages/Dashboard.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Dialog, DialogTrigger, DialogContent, DialogTitle } from "../components/ui/dialog";

const Dashboard = () => {
  const [filters, setFilters] = useState({ date: "", base: "", type: "" });
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [metrics, setMetrics] = useState(null);

  useEffect(() => {
    axios
      .get("http://localhost:8000/api/dashboard/", { withCredentials: true })
      .then((res) => setMetrics(res.data))
      .catch((err) => console.error("Dashboard fetch error:", err));
  }, []);

  const fetchFilteredMetrics = () => {
    axios
      .get("http://localhost:8000/api/dashboard/", {
        params: filters,
        withCredentials: true,
      })
      .then((res) => setMetrics(res.data))
      .catch((err) => console.error("Filtered fetch error:", err));
  };

  const data = metrics || {
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
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="w-full px-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Dashboard Overview</h1>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          {Object.entries({
            "Opening Balance": data.opening_balance,
            "Closing Balance": data.closing_balance,
            "Net Movement": data.net_movement,
            "Assigned": data.assigned,
            "Expended": data.expended,
          }).map(([label, value]) => (
            <div
              key={label}
              onClick={() => label === "Net Movement" && setDetailsOpen(true)}
              className="bg-white p-6 rounded-xl shadow hover:shadow-lg cursor-pointer transition"
            >
              <h2 className="text-lg font-medium text-gray-600">{label}</h2>
              <p className="text-3xl font-bold text-blue-600 mt-1">{value}</p>
            </div>
          ))}
        </div>

        {/* Filters Section */}
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h3 className="text-xl font-semibold mb-4 text-gray-800">Filter Metrics</h3>
          <div className="flex flex-wrap gap-4">
            <input
              type="date"
              className="border border-gray-300 rounded px-4 py-2 w-full sm:w-auto"
              onChange={(e) => setFilters({ ...filters, date: e.target.value })}
            />
            <input
              placeholder="Base"
              className="border border-gray-300 rounded px-4 py-2 w-full sm:w-auto"
              onChange={(e) => setFilters({ ...filters, base: e.target.value })}
            />
            <input
              placeholder="Equipment Type"
              className="border border-gray-300 rounded px-4 py-2 w-full sm:w-auto"
              onChange={(e) => setFilters({ ...filters, type: e.target.value })}
            />
            <button
              onClick={fetchFilteredMetrics}
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
            >
              Apply Filters
            </button>
          </div>
        </div>
      </div>

      {/* Dialog Popup */}
      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogTrigger asChild></DialogTrigger>
        <DialogContent>
          <DialogTitle>Net Movement Details</DialogTitle>
          <ul className="mt-4 space-y-2 text-gray-700 list-disc list-inside">
            <li>Purchases: {data.details.purchases}</li>
            <li>Transfer In: {data.details.transfer_in}</li>
            <li>Transfer Out: {data.details.transfer_out}</li>
          </ul>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Dashboard;

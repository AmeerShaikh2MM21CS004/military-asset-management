import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
} from "../components/ui/dialog";

const Dashboard = () => {
  const [filters, setFilters] = useState({ date: "", base: "", type: "" });
  const [metrics, setMetrics] = useState(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [movementDetails, setMovementDetails] = useState(null);
  const [bases, setBases] = useState([]);
  const [equipmentTypes, setEquipmentTypes] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:8000/api/bases/", { withCredentials: true })
      .then((res) => setBases(res.data))
      .catch(console.error);

    axios
      .get("http://localhost:8000/api/equipment-types/", {
        withCredentials: true,
      })
      .then((res) => setEquipmentTypes(res.data))
      .catch(console.error);
  }, []);

  const fetchMetrics = () => {
    axios
      .get("http://localhost:8000/api/dashboard-metrics/", {
        params: filters,
        withCredentials: true,
      })
      .then((res) => setMetrics(res.data))
      .catch((err) => console.error("Dashboard fetch error:", err));
  };

  useEffect(() => {
    fetchMetrics();
  }, []);

  const fetchMovementDetails = () => {
    axios
      .get("http://localhost:8000/api/net-movement-details/", {
        params: { base: filters.base || undefined },
        withCredentials: true,
      })
      .then((res) => {
        setMovementDetails(res.data);
        setDetailsOpen(true);
      })
      .catch((err) => console.error("Movement details fetch error:", err));
  };

  const data = metrics || {
    opening_balance: 0,
    closing_balance: 0,
    net_movement: 0,
    assigned: 0,
    expended: 0,
    details: {
      purchases: 0,
      transfer_in: 0,
      transfer_out: 0,
    },
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10">
      <div className="max-w-screen-2xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">
          Dashboard Overview
        </h1>

        <div className="bg-white p-6 rounded-xl shadow-md mb-10">
          <h3 className="text-xl font-semibold mb-4 text-gray-800">
            Filter Metrics
          </h3>
          <div className="flex flex-wrap gap-4 items-center">
            <input
              type="date"
              value={filters.date}
              onChange={(e) =>
                setFilters({ ...filters, date: e.target.value })
              }
              className="border border-gray-300 rounded px-4 py-2 bg-white text-black w-full sm:w-auto"
            />
            <select
              value={filters.base}
              onChange={(e) =>
                setFilters({ ...filters, base: e.target.value })
              }
              className="border border-gray-300 rounded px-4 py-2 bg-white text-black w-full sm:w-auto"
            >
              <option value="">Select Base</option>
              {bases.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </select>
            <select
              value={filters.type}
              onChange={(e) =>
                setFilters({ ...filters, type: e.target.value })
              }
              className="border border-gray-300 rounded px-4 py-2 bg-white text-black w-full sm:w-auto"
            >
              <option value="">Select Equipment Type</option>
              {equipmentTypes.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
            <button
              onClick={fetchMetrics}
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
            >
              Apply Filters
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          {Object.entries({
            "Opening Balance": data.opening_balance,
            "Closing Balance": data.closing_balance,
            "Net Movement": data.net_movement,
            Assigned: data.assigned,
            Expended: data.expended,
          }).map(([label, value]) => (
            <div
              key={label}
              onClick={() =>
                label === "Net Movement" && fetchMovementDetails()
              }
              className="bg-white p-6 rounded-xl shadow hover:shadow-lg cursor-pointer transition"
            >
              <h2 className="text-lg font-medium text-gray-600">{label}</h2>
              <p className="text-3xl font-bold text-blue-600 mt-1">{value}</p>
            </div>
          ))}
        </div>
      </div>

      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogTrigger asChild></DialogTrigger>
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogTitle>Net Movement Details</DialogTitle>
          {movementDetails ? (
            <>
              <div className="mt-4">
                <h3 className="text-lg font-semibold mb-2 text-blue-700">
                  Purchases
                </h3>
                <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                  {movementDetails.purchases.map((p, i) => (
                    <li key={i}>
                      {p.date} – Base: {p.base} – Equipment: {p.equipmentType} – Qty:{" "}
                      {p.quantity}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-4">
                <h3 className="text-lg font-semibold mb-2 text-green-700">
                  Transfer In
                </h3>
                <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                  {movementDetails.transfer_in.map((t, i) => (
                    <li key={i}>
                      {t.date} – From: {t.from_base} – Equipment:{" "}
                      {t.equipment_name} ({t.equipment_type}) – Qty: {t.quantity}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-4">
                <h3 className="text-lg font-semibold mb-2 text-red-700">
                  Transfer Out
                </h3>
                <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                  {movementDetails.transfer_out.map((t, i) => (
                    <li key={i}>
                      {t.date} – To: {t.to_base} – Equipment: {t.equipment_name} (
                      {t.equipment_type}) – Qty: {t.quantity}
                    </li>
                  ))}
                </ul>
              </div>
            </>
          ) : (
            <p className="text-gray-600">Loading details...</p>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Dashboard;

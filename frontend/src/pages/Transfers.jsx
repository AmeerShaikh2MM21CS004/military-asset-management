import React, { useState, useEffect } from "react";
import axios from "axios";
import { Input } from "../components/ui/input";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";

const Transfer = () => {
  const [fromBase, setFromBase] = useState("");
  const [toBase, setToBase] = useState("");
  const [equipmentTypeId, setEquipmentTypeId] = useState("");
  const [assetId, setAssetId] = useState("");
  const [date, setDate] = useState("");
  const [history, setHistory] = useState([]);
  const [assets, setAssets] = useState([]);
  const [bases, setBases] = useState([]);
  const [equipmentTypes, setEquipmentTypes] = useState([]);
  const [availableAssets, setAvailableAssets] = useState([]);

  const fetchTransfers = () => {
    axios.get("http://localhost:8000/api/transfers/", { withCredentials: true })
      .then(res => {
        setHistory(res.data);
        console.log("Fetched transfer history:", res.data);
      })
      .catch(err => console.error("Transfer fetch error:", err));
  };

  useEffect(() => {
    axios.get("http://localhost:8000/api/assets/", { withCredentials: true })
      .then(res => setAssets(res.data))
      .catch(err => console.error("Asset fetch error:", err));

    axios.get("http://localhost:8000/api/bases/", { withCredentials: true })
      .then(res => setBases(res.data))
      .catch(err => console.error("Base fetch error:", err));

    axios.get("http://localhost:8000/api/equipment-types/", { withCredentials: true })
      .then(res => setEquipmentTypes(res.data))
      .catch(err => console.error("Type fetch error:", err));

    fetchTransfers();
  }, []);

  useEffect(() => {
    if (fromBase && equipmentTypeId) {
      const filtered = assets.filter(a => {
        const baseId = typeof a.base === "object" ? a.base.id : a.base;
        const typeId = typeof a.equipment_type === "object" ? a.equipment_type.id : a.equipment_type;
        return String(baseId) === fromBase && String(typeId) === equipmentTypeId;
      });

      console.log("Filtered assets:", filtered);
      setAvailableAssets(filtered);
      setAssetId(filtered.length > 0 ? String(filtered[0].id) : "");
    } else {
      setAvailableAssets([]);
      setAssetId("");
    }
  }, [fromBase, equipmentTypeId, assets]);

  const handleTransfer = () => {
    if (!fromBase || !toBase || !assetId || !date) {
      alert("All fields are required.");
      console.log("Missing fields:", { fromBase, toBase, assetId, date });
      return;
    }

    const payload = {
      from_base: parseInt(fromBase),
      to_base: parseInt(toBase),
      asset: parseInt(assetId),
      date,
      quantity: 1,
    };

    console.log("Submitting transfer payload:", payload);

    axios.post("http://localhost:8000/api/transfers/", payload, { withCredentials: true })
      .then(() => {
        alert("Transfer successful");
        fetchTransfers();
        setFromBase("");
        setToBase("");
        setEquipmentTypeId("");
        setAssetId("");
        setDate("");
        setAvailableAssets([]);
      })
      .catch(err => {
        console.error("Transfer error:", err.response?.data || err.message);
        alert("Transfer failed.");
      });
  };

  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold mt-6 mb-2 text-gray-800">Transfer Equipment</h2>

      <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-4">
        <select
          value={fromBase}
          onChange={(e) => setFromBase(e.target.value)}
          className="border px-4 py-2 rounded bg-white text-black"
        >
          <option value="">From Base</option>
          {bases.map((b) => (
            <option key={b.id} value={b.id}>{b.name}</option>
          ))}
        </select>

        <select
          value={toBase}
          onChange={(e) => setToBase(e.target.value)}
          className="border px-4 py-2 rounded bg-white text-black"
        >
          <option value="">To Base</option>
          {bases.map((b) => (
            <option key={b.id} value={b.id}>{b.name}</option>
          ))}
        </select>

        <select
          value={equipmentTypeId}
          onChange={(e) => setEquipmentTypeId(e.target.value)}
          className="border px-4 py-2 rounded bg-white text-black"
        >
          <option value="">Select Equipment Type</option>
          {equipmentTypes.map((e) => (
            <option key={e.id} value={e.id}>{e.name}</option>
          ))}
        </select>

        <Input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="bg-white text-black"
        />
      </div>

      <Button
        className="mt-4"
        onClick={handleTransfer}
        disabled={!fromBase || !toBase || !equipmentTypeId || !date || !assetId}
      >
        Transfer
      </Button>

      <h3 className="text-xl font-semibold mt-6 mb-2 text-gray-800">Transfer History</h3>
      <div className="grid gap-2">
        {history.length === 0 ? (
          <p className="text-gray-600">No transfers yet.</p>
        ) : (
          history.map((item, i) => {
            const asset = typeof item.asset === 'object' ? item.asset : assets.find(a => a.id === item.asset);
            const from = typeof item.from_base === 'object' ? item.from_base : bases.find(b => b.id === item.from_base);
            const to = typeof item.to_base === 'object' ? item.to_base : bases.find(b => b.id === item.to_base);

            return (
              <Card key={i} className="p-2 bg-gray-100 text-black shadow rounded">
                {item.date} | From: {from?.name || 'N/A'} ➡ To: {to?.name || 'N/A'} | 
                Equipment: {equipmentTypes.find(e => e.id === asset?.equipment_type)?.name || 'Unknown'} | 
                Asset: {asset?.name || `ID: ${item.asset}`} | Qty: {item.quantity}
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
};

export default Transfer;
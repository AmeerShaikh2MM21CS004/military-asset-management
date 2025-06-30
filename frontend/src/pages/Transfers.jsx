import React, { useState, useEffect } from "react";
import axios from "axios";
import { Input } from "../components/ui/input";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";

const Transfer = () => {
  const [fromBase, setFromBase] = useState("");
  const [toBase, setToBase] = useState("");
  const [equipmentTypeId, setEquipmentTypeId] = useState("");
  const [date, setDate] = useState("");
  const [quantity, setQuantity] = useState(1);

  const [history, setHistory] = useState([]);
  const [assets, setAssets] = useState([]);
  const [bases, setBases] = useState([]);
  const [equipmentTypes, setEquipmentTypes] = useState([]);
  const [availableAssets, setAvailableAssets] = useState([]);

  const fetchTransfers = () => {
    axios
      .get("http://localhost:8000/api/transfers/", { withCredentials: true })
      .then(res => setHistory(res.data))
      .catch(err => console.error("Transfer fetch error:", err));
  };

  useEffect(() => {
    Promise.all([
      axios.get("http://localhost:8000/api/bases/", { withCredentials: true }),
      axios.get("http://localhost:8000/api/equipment-types/", { withCredentials: true }),
      axios.get("http://localhost:8000/api/purchases/", { withCredentials: true }),
    ])
      .then(([bRes, tRes, pRes]) => {
        setBases(bRes.data);
        setEquipmentTypes(tRes.data);
        const items = pRes.data.map((p, idx) => ({
          id: `p-${idx}`,
          base: p.base,
          equipment_type: p.equipment_type,
          name: `Purchased on ${p.date}`,
          quantity: p.quantity,
          date: p.date,
        }));
        setAssets(items);
      })
      .catch(console.error);

    fetchTransfers();
  }, []);

  useEffect(() => {
    if (fromBase && equipmentTypeId) {
      const matched = assets.filter(
        a => String(a.base) === fromBase && String(a.equipment_type) === equipmentTypeId
      );
      setAvailableAssets(matched);
    } else {
      setAvailableAssets([]);
    }
  }, [fromBase, equipmentTypeId, assets]);

  const handleTransfer = () => {
    if (!fromBase || !toBase || !equipmentTypeId || !date || !quantity) {
      return alert("All fields are required.");
    }
    if (availableAssets.length === 0) {
      return alert("No matching purchase asset available.");
    }

    // The backend needs a real Asset ID; dummy 1 is placeholder
    axios
      .post(
        "http://localhost:8000/api/transfers/",
        {
          from_base: parseInt(fromBase),
          to_base: parseInt(toBase),
          asset: 1, // <-- Replace with real asset ID logic
          date,
          quantity: parseInt(quantity),
        },
        { withCredentials: true }
      )
      .then(() => {
        alert("Transfer successful");
        fetchTransfers();
      })
      .catch(err => {
        console.error("Transfer error:", err);
        alert("Transfer failed.");
      });
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Transfer Equipment</h2>

      <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-4 mb-2">
        <select
          className="border p-2 rounded bg-white text-black"
          value={fromBase} onChange={e => setFromBase(e.target.value)}
        >
          <option value="">From Base</option>
          {bases.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
        </select>

        <select
          className="border p-2 rounded bg-white text-black"
          value={toBase} onChange={e => setToBase(e.target.value)}
        >
          <option value="">To Base</option>
          {bases.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
        </select>

        <select
          className="border p-2 rounded bg-white text-black"
          value={equipmentTypeId} onChange={e => setEquipmentTypeId(e.target.value)}
        >
          <option value="">Equipment Type</option>
          {equipmentTypes.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
        </select>

        <Input
          type="date"
          className="bg-white text-black"
          value={date} onChange={e => setDate(e.target.value)}
        />
      </div>

      <Input
        type="number"
        min="1"
        className="bg-white text-black mb-4"
        value={quantity} onChange={e => setQuantity(e.target.value)}
        placeholder="Quantity"
      />

      <Button
        onClick={handleTransfer}
        disabled={!fromBase || !toBase || !equipmentTypeId || !date || !quantity || availableAssets.length === 0}
      >
        Transfer
      </Button>

      <h3 className="mt-6 font-semibold">Matching Assets (from purchases)</h3>
      {availableAssets.length === 0
        ? <p>No matching assets.</p>
        : availableAssets.map((a, idx) => (
            <Card key={idx} className="p-2 mb-1 bg-gray-100">
              {a.name} | Qty: {a.quantity} | Date: {a.date}
            </Card>
          ))
      }

      <h3 className="mt-6 font-semibold">Transfer History</h3>
      {history.length === 0
        ? <p>No transfers recorded.</p>
        : history.map((t, idx) => (
            <Card key={idx} className="p-2 mb-1 bg-gray-100">
              {t.date} | From: {bases.find(b => b.id === t.from_base)?.name} → To: {bases.find(b => b.id === t.to_base)?.name} |
              Equipment Type ID: {t.asset} | Qty: {t.quantity}
            </Card>
          ))
      }
    </div>
  );
};

export default Transfer;

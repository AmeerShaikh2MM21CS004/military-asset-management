import React, { useState, useEffect } from "react";
import axios from "axios";
import { Card } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "../components/ui/dialog";

const Purchases = () => {
  const [base, setBase] = useState("");
  const [equipmentType, setEquipmentType] = useState("");
  const [date, setDate] = useState("");
  const [quantity, setQuantity] = useState("");
  const [history, setHistory] = useState([]);
  const [bases, setBases] = useState([]);
  const [equipmentTypes, setEquipmentTypes] = useState([]);
  const [dialogType, setDialogType] = useState("");
  const [open, setOpen] = useState(false);
  const [filterBase, setFilterBase] = useState("");
  const [filterEquipmentType, setFilterEquipmentType] = useState("");
  const [filterDate, setFilterDate] = useState("");

  useEffect(() => {
    axios.get("http://localhost:8000/api/bases/", { withCredentials: true })
      .then((res) => setBases(res.data))
      .catch(console.error);

    axios.get("http://localhost:8000/api/equipment-types/", { withCredentials: true })
      .then((res) => setEquipmentTypes(res.data))
      .catch(console.error);
  }, []);

  const fetchHistory = () => {
    axios.get("http://localhost:8000/api/purchases/", {
      params: {
        base: filterBase || undefined,
        equipment_type: filterEquipmentType || undefined,
        date: filterDate || undefined,
      },
      withCredentials: true,
    })
    .then((res) => setHistory(res.data))
    .catch((err) => console.error("Filter error:", err));
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleSubmit = () => {
    axios.post("http://localhost:8000/api/purchases/", {
      base,
      equipment_type: equipmentType,
      date,
      quantity,
    }, { withCredentials: true })
    .then(() => {
      setDialogType("success");
      fetchHistory();
      setBase("");
      setEquipmentType("");
      setDate("");
      setQuantity("");
      setOpen(true);
    })
    .catch(() => {
      setDialogType("error");
      setOpen(true);
    });
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Record Purchase</h2>

      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
        <select
          value={base}
          onChange={(e) => setBase(e.target.value)}
          className="border px-4 py-2 rounded bg-white text-black"
        >
          <option value="">Select Base</option>
          {bases.map((b) => (
            <option key={b.id} value={b.id}>{b.name}</option>
          ))}
        </select>

        <select
          value={equipmentType}
          onChange={(e) => setEquipmentType(e.target.value)}
          className="border px-4 py-2 rounded bg-white text-black"
        >
          <option value="">Select Equipment</option>
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
        <Input
          type="number"
          placeholder="Quantity"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          className="bg-white text-black"
        />
      </div>

      <Button className="mt-4" onClick={handleSubmit}>Add Purchase</Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          {dialogType === "success" ? (
            <>
              <DialogTitle>✅ Purchase Recorded</DialogTitle>
              <p className="mt-2 text-gray-700">Your purchase has been saved successfully.</p>
            </>
          ) : dialogType === "error" ? (
            <>
              <DialogTitle className="text-red-600">❌ Error</DialogTitle>
              <p className="mt-2 text-red-600">Something went wrong. Please try again.</p>
            </>
          ) : null}
        </DialogContent>
      </Dialog>

      <hr className="my-6" />

      <h3 className="text-xl font-semibold text-gray-800 mb-2">Purchase History</h3>

      <div className="grid gap-2 md:grid-cols-3 lg:grid-cols-4 mb-4">
        <select
          value={filterBase}
          onChange={(e) => setFilterBase(e.target.value)}
          className="border px-4 py-2 rounded bg-white text-black"
        >
          <option value="">Filter by Base</option>
          {bases.map((b) => (
            <option key={b.id} value={b.id}>{b.name}</option>
          ))}
        </select>

        <select
          value={filterEquipmentType}
          onChange={(e) => setFilterEquipmentType(e.target.value)}
          className="border px-4 py-2 rounded bg-white text-black"
        >
          <option value="">Filter by Type</option>
          {equipmentTypes.map((e) => (
            <option key={e.id} value={e.id}>{e.name}</option>
          ))}
        </select>

        <Input
          type="date"
          value={filterDate}
          onChange={(e) => setFilterDate(e.target.value)}
          className="bg-white text-black"
        />
        <Button type="button" onClick={fetchHistory}>Apply Filters</Button>
      </div>

      <div className="grid gap-2">
        {history.map((item, i) => (
          <Card key={i} className="p-3 text-sm bg-gray-100 !text-black shadow rounded">
            {item.date} | Base: {bases.find(b => b.id === item.base)?.name || "N/A"} | 
            Equipment: {equipmentTypes.find(t => t.id === item.equipment_type)?.name || "N/A"} | 
            Qty: {item.quantity}
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Purchases;

import React, { useState, useEffect } from "react";
import axios from "axios";
import { Input } from "../components/ui/input";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";

const Transfer = () => {
  const [fromBase, setFromBase] = useState("");
  const [toBase, setToBase] = useState("");
  const [equipment, setEquipment] = useState("");
  const [date, setDate] = useState("");
  const [history, setHistory] = useState([]);

  // Fetch transfer history
  useEffect(() => {
    axios.get("http://localhost:8000/api/transfers/", { withCredentials: true })
      .then((res) => setHistory(res.data))
      .catch((err) => console.error("Fetch Error:", err));
  }, []);

  // Submit new transfer
  const handleTransfer = () => {
    axios.post("http://localhost:8000/api/transfers/", {
      fromBase,
      toBase,
      equipment,
      date,
    }, { withCredentials: true })
    .then(() => {
      alert("Transfer successful");
      setHistory([...history, { fromBase, toBase, equipment, date }]);
      setFromBase(""); setToBase(""); setEquipment(""); setDate("");
    })
    .catch((err) => console.error("Submit Error:", err));
  };

  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold mt-6 mb-2 text-gray-800">Transfer Asset</h2>
      <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-4">
        <Input placeholder="From Base" value={fromBase} onChange={e => setFromBase(e.target.value)} />
        <Input placeholder="To Base" value={toBase} onChange={e => setToBase(e.target.value)} />
        <Input placeholder="Equipment" value={equipment} onChange={e => setEquipment(e.target.value)} />
        <Input type="date" value={date} onChange={e => setDate(e.target.value)} />
      </div>
      <Button className="mt-4" onClick={handleTransfer}>Transfer</Button>

      <h3 className="text-lg font-semibold mt-6 mb-2">Transfer History</h3>
      <div className="grid gap-2">
        {history.map((item, i) => (
          <Card key={i} className="p-2">
            {item.date} | {item.fromBase} ➡ {item.toBase} | {item.equipment}
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Transfer;

import React, { useState, useEffect } from "react";
import axios from "axios";
import { Card } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";

const Purchases = () => {
  const [base, setBase] = useState("");
  const [equipmentType, setEquipmentType] = useState("");
  const [date, setDate] = useState("");
  const [quantity, setQuantity] = useState("");
  const [history, setHistory] = useState([]);

  // Fetch purchase history
  useEffect(() => {
    axios
      .get("http://localhost:8000/api/purchases/", { withCredentials: true })
      .then((res) => setHistory(res.data))
      .catch((err) => console.error("Fetch Error:", err));
  }, []);

  // Submit new purchase
  const handleSubmit = () => {
    axios
      .post(
        "http://localhost:8000/api/purchases/",
        { base, equipmentType, date, quantity },
        { withCredentials: true }
      )
      .then(() => {
        alert("Purchase saved");
        setHistory([...history, { base, equipmentType, date, quantity }]); // Append to history
        setBase("");
        setEquipmentType("");
        setDate("");
        setQuantity("");
      })
      .catch((err) => console.error("Submit Error:", err));
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Record Purchase</h2>
      <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-4">
        <Input placeholder="Base" value={base} onChange={(e) => setBase(e.target.value)} />
        <Input placeholder="Equipment Type" value={equipmentType} onChange={(e) => setEquipmentType(e.target.value)} />
        <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        <Input type="number" placeholder="Quantity" value={quantity} onChange={(e) => setQuantity(e.target.value)} />
      </div>
      <Button className="mt-4" onClick={handleSubmit}>Add Purchase</Button>

      <h3 className="text-lg font-semibold mt-6 mb-2">Purchase History</h3>
      <div className="grid gap-2">
        {history.map((item, i) => (
          <Card key={i} className="p-2">
            {item.date} | {item.base} | {item.equipmentType} | Qty: {item.quantity}
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Purchases;

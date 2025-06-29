import React, { useState, useEffect } from "react";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";

const assignAsset = () => {
  axios.post("http://localhost:8000/api/assignments/", {
    personnel, item, quantity, date,
  }, { withCredentials: true })
  .then(() => alert("Asset assigned"))
  .catch((err) => console.error(err));
};

const expendAsset = () => {
  axios.post("http://localhost:8000/api/expenditures/", {
    item, quantity, reason, date,
  }, { withCredentials: true })
  .then(() => alert("Expenditure recorded"))
  .catch((err) => console.error(err));
};


const Assignments = () => {
  const [personnel, setPersonnel] = useState("");
  const [asset, setAsset] = useState("");
  const [expended, setExpended] = useState("");
  const [records, setRecords] = useState([]);

  const handleAssign = () => {
    const record = { personnel, asset, expended };
    setRecords([...records, record]);
    setPersonnel(""); setAsset(""); setExpended("");
  };

  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold mt-6 mb-2 text-gray-800">Assignments & Expenditures</h2>
      <div className="grid gap-2 md:grid-cols-3">
        <Input placeholder="Personnel Name" value={personnel} onChange={e => setPersonnel(e.target.value)} />
        <Input placeholder="Assigned Asset" value={asset} onChange={e => setAsset(e.target.value)} />
        <Input placeholder="Expended Asset" value={expended} onChange={e => setExpended(e.target.value)} />
      </div>
      <Button className="mt-4" onClick={handleAssign}>Add Record</Button>
      <h3 className="text-lg font-semibold mt-6 mb-2">Assignment History</h3>
      <div className="grid gap-2">
        {records.map((r, i) => (
          <Card key={i} className="p-2">
            {r.personnel} | Assigned: {r.asset} | Expended: {r.expended}
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Assignments;
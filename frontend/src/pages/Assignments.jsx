import React, { useState, useEffect } from "react";
import axios from "axios";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "../components/ui/dialog";

const Assignments = () => {
  const [assets, setAssets] = useState([]);
  const [equipmentTypes, setEquipmentTypes] = useState([]);
  const [history, setHistory] = useState([]);
  const [dialogType, setDialogType] = useState("");
  const [open, setOpen] = useState(false);

  const [personnel, setPersonnel] = useState("");
  const [assignTypeId, setAssignTypeId] = useState("");
  const [assignQty, setAssignQty] = useState("");
  const [assignDate, setAssignDate] = useState("");

  const [expTypeId, setExpTypeId] = useState("");
  const [expQty, setExpQty] = useState("");
  const [expReason, setExpReason] = useState("");
  const [expDate, setExpDate] = useState("");

  useEffect(() => {
    axios.get("http://localhost:8000/api/assets/", { withCredentials: true })
      .then(res => setAssets(res.data));

    axios.get("http://localhost:8000/api/equipment-types/", { withCredentials: true })
      .then(res => setEquipmentTypes(res.data));

    fetchHistory();
  }, []);

  const fetchHistory = () => {
    Promise.all([
      axios.get("http://localhost:8000/api/assignments/", { withCredentials: true }),
      axios.get("http://localhost:8000/api/expenditures/", { withCredentials: true }),
    ])
      .then(([assignRes, expendRes]) => {
        const combined = [
          ...assignRes.data.map(x => ({ ...x, type: "assign" })),
          ...expendRes.data.map(x => ({ ...x, type: "expend" })),
        ];
        setHistory(combined.sort((a, b) => new Date(b.date) - new Date(a.date)));
      });
  };

  const findAssetByType = (equipmentTypeId) => {
    return assets.find(a => String(a.equipment_type) === String(equipmentTypeId));
  };

  const validEquipmentTypes = equipmentTypes.filter(et =>
    assets.some(asset => String(asset.equipment_type) === String(et.id))
  );

  const handleAssign = () => {
    const asset = findAssetByType(assignTypeId);
    if (!asset) return alert("No asset available for this equipment type");

    axios.post("http://localhost:8000/api/assignments/", {
      personnel_name: personnel,
      asset: asset.id,
      quantity: parseInt(assignQty),
      date: assignDate,
    }, { withCredentials: true })
      .then(() => {
        setDialogType("success");
        fetchHistory();
        setPersonnel(""); setAssignTypeId(""); setAssignQty(""); setAssignDate("");
        setOpen(true);
      })
      .catch((err) => {
        console.error("Assign error:", err.response?.data || err.message);
        setDialogType("error");
        setOpen(true);
      });
  };

  const handleExpend = () => {
    const asset = findAssetByType(expTypeId);
    if (!asset) return alert("No asset available for this equipment type");

    axios.post("http://localhost:8000/api/expenditures/", {
      asset: asset.id,
      quantity: parseInt(expQty),
      reason: expReason,
      date: expDate,
    }, { withCredentials: true })
      .then(() => {
        setDialogType("success");
        fetchHistory();
        setExpTypeId(""); setExpQty(""); setExpReason(""); setExpDate("");
        setOpen(true);
      })
      .catch((err) => {
        console.error("Expenditure error:", err.response?.data || err.message);
        setDialogType("error");
        setOpen(true);
      });
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Assignments & Expenditures</h2>

      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4 mb-4">
        <Input
          placeholder="Personnel Name"
          value={personnel}
          onChange={e => setPersonnel(e.target.value)}
          className="bg-white text-black"
        />
        <select
          value={assignTypeId}
          onChange={e => setAssignTypeId(e.target.value)}
          className="border px-4 py-2 rounded bg-white text-black"
        >
          <option value="">Select Equipment Type</option>
          {equipmentTypes.map(e => (
            <option key={e.id} value={e.id}>{e.name}</option>
          ))}
        </select>
        <Input
          type="number"
          placeholder="Assign Qty"
          value={assignQty}
          onChange={e => setAssignQty(e.target.value)}
          className="bg-white text-black"
        />
        <Input
          type="date"
          value={assignDate}
          onChange={e => setAssignDate(e.target.value)}
          className="bg-white text-black"
        />
        <Button onClick={handleAssign}>Assign</Button>
      </div>

      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4 mb-4">
        <select
          value={expTypeId}
          onChange={e => setExpTypeId(e.target.value)}
          className="border px-4 py-2 rounded bg-white text-black"
        >
          <option value="">Select Equipment Type</option>
          {equipmentTypes.map(e => (
            <option key={e.id} value={e.id}>{e.name}</option>
          ))}
        </select>
        <Input
          type="number"
          placeholder="Expend Qty"
          value={expQty}
          onChange={e => setExpQty(e.target.value)}
          className="bg-white text-black"
        />
        <Input
          placeholder="Reason"
          value={expReason}
          onChange={e => setExpReason(e.target.value)}
          className="bg-white text-black"
        />
        <Input
          type="date"
          value={expDate}
          onChange={e => setExpDate(e.target.value)}
          className="bg-white text-black"
        />
        <Button onClick={handleExpend}>Expend</Button>
      </div>

      {dialogType && (
        <Dialog
          open={open}
          onOpenChange={(val) => {
            setOpen(val);
            if (!val) setDialogType("");
          }}
        >
          <DialogContent>
            {dialogType === "success" ? (
              <>
                <DialogTitle>✅ Success</DialogTitle>
                <p className="mt-2 text-gray-700">Your entry has been saved successfully.</p>
              </>
            ) : (
              <>
                <DialogTitle className="text-red-600">❌ Error</DialogTitle>
                <p className="mt-2 text-red-600">
                  Something went wrong. Ensure the asset exists for this equipment type and all fields are filled correctly.
                </p>
              </>
            )}
          </DialogContent>
        </Dialog>
      )}

      <hr className="my-6" />

      <h3 className="text-xl font-semibold text-gray-800 mb-2">History</h3>
      <div className="grid gap-2">
        {history.map((item, i) => {
          const asset = assets.find(a => a.id === item.asset);
          const type = equipmentTypes.find(e => e.id === asset?.equipment_type);
          return (
            <Card key={i} className="p-3 text-sm bg-gray-100 !text-black shadow rounded">
              {item.date} | {item.type === "assign" ? (
                <>Assigned {item.quantity} of {type?.name || "N/A"} to {item.personnel_name}</>
              ) : (
                <>Expended {item.quantity} of {type?.name || "N/A"} - Reason: {item.reason}</>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default Assignments;

import { useState } from 'react';
import API from '../utils/api';
import { useAuthGuard } from '../hooks/useAuthGuard';

export default function AssignmentsPage() {
  useAuthGuard('commander');

  const [form, setForm] = useState({ personnel: '', type: '', quantity: 0 });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await API.post('/assignments/', form);
    alert('Asset Assigned');
    setForm({ personnel: '', type: '', quantity: 0 });
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Assign Assets</h1>
      <form onSubmit={handleSubmit} className="grid grid-cols-3 gap-4">
        <input
          type="text"
          placeholder="Personnel"
          value={form.personnel}
          onChange={(e) => setForm({ ...form, personnel: e.target.value })}
          className="border p-2 rounded"
        />
        <input
          type="text"
          placeholder="Asset Type"
          value={form.type}
          onChange={(e) => setForm({ ...form, type: e.target.value })}
          className="border p-2 rounded"
        />
        <input
          type="number"
          placeholder="Quantity"
          value={form.quantity}
          onChange={(e) => setForm({ ...form, quantity: e.target.value })}
          className="border p-2 rounded"
        />
        <button type="submit" className="col-span-3 bg-blue-600 text-white p-2 rounded">Assign</button>
      </form>
    </div>
  );
}

import { useEffect, useState } from 'react';
import API from '../utils/api';
import { useAuthGuard } from '../hooks/useAuthGuard';

export default function TransfersPage() {
  // Only allow users with role 'logistics' to access this page
  useAuthGuard('logistics');

  const [form, setForm] = useState({ from: '', to: '', type: '', quantity: 0 });
  const [history, setHistory] = useState([]);

  useEffect(() => {
    API.get('/transfers/').then((res) => setHistory(res.data));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await API.post('/transfers/', form);
    alert('Transfer completed');
    setForm({ from: '', to: '', type: '', quantity: 0 });
    const res = await API.get('/transfers/');
    setHistory(res.data);
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Transfer Assets</h1>
      <form onSubmit={handleSubmit} className="grid grid-cols-4 gap-4 mb-6">
        <input
          type="text"
          placeholder="From Base"
          value={form.from}
          onChange={(e) => setForm({ ...form, from: e.target.value })}
          className="border p-2 rounded"
        />
        <input
          type="text"
          placeholder="To Base"
          value={form.to}
          onChange={(e) => setForm({ ...form, to: e.target.value })}
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
        <button type="submit" className="col-span-4 bg-blue-600 text-white p-2 rounded">
          Transfer
        </button>
      </form>

      <h2 className="text-lg font-semibold mb-2">Transfer History</h2>
      <ul className="bg-white p-4 rounded shadow">
        {history.map((item, idx) => (
          <li key={idx} className="border-b py-2">
            {item.date || 'Date'}: {item.type} x {item.quantity} from {item.from} to {item.to}
          </li>
        ))}
      </ul>
    </div>
  );
}

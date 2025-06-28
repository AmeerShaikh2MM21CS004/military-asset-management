import { useEffect, useState } from 'react';
import API from '../utils/api';
import { useAuthGuard } from '../hooks/useAuthGuard';

export default function PurchasesPage() {
  useAuthGuard('logistics');

  const [purchases, setPurchases] = useState([]);
  const [form, setForm] = useState({ base: '', type: '', quantity: 0 });

  useEffect(() => {
    API.get('/purchases/').then((res) => setPurchases(res.data));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await API.post('/purchases/', form);
    alert('Purchase recorded');
    setForm({ base: '', type: '', quantity: 0 });
    const res = await API.get('/purchases/');
    setPurchases(res.data);
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Record New Purchase</h1>
      <form onSubmit={handleSubmit} className="grid grid-cols-3 gap-4 mb-6">
        <input
          type="text"
          placeholder="Base"
          value={form.base}
          onChange={(e) => setForm({ ...form, base: e.target.value })}
          className="border p-2 rounded"
        />
        <input
          type="text"
          placeholder="Equipment Type"
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
        <button type="submit" className="col-span-3 bg-blue-600 text-white p-2 rounded">Submit</button>
      </form>

      <h2 className="text-lg font-semibold mb-2">Purchase History</h2>
      <ul className="bg-white p-4 rounded shadow">
        {purchases.map((item, idx) => (
          <li key={idx} className="border-b py-2">
            {item.date || 'Date'} - {item.type} - {item.quantity} at {item.base}
          </li>
        ))}
      </ul>
    </div>
  );
}

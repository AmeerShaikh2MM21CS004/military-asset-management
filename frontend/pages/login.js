import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/router';

export default function Login() {
  const [username, setUsername] = useState('');
  const [role, setRole] = useState('admin');
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = (e) => {
    e.preventDefault();
    login({ username, role });
    router.push('/');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-200">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow w-80">
        <h2 className="text-xl font-bold mb-4 text-center">Login</h2>
        <input type="text" placeholder="Username" className="mb-3 w-full p-2 border rounded" value={username} onChange={(e) => setUsername(e.target.value)} />
        <select className="mb-3 w-full p-2 border rounded" value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="admin">Admin</option>
          <option value="commander">Base Commander</option>
          <option value="logistics">Logistics Officer</option>
        </select>
        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded">Login</button>
      </form>
    </div>
  );
}

import { useAuthGuard } from '../hooks/useAuthGuard';

export default function AdminPanel() {
  useAuthGuard('admin');

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Admin Panel</h1>
      <p>Only visible to admin users.</p>
    </div>
  );
}

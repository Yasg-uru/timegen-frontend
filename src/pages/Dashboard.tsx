import { useAuth } from '../context/AuthContext';

export default function Dashboard() {
  const { user, logout } = useAuth();

  return (
    <div className="p-6">
      <h2 className="text-2xl">Dashboard</h2>
      <p className="mt-2">Signed in as: {user?.email}</p>
      <div className="mt-4">
        <button onClick={() => logout()} className="px-3 py-2 bg-red-600 text-white">Logout</button>
      </div>
    </div>
  );
}

import { useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import './Dashboard.css';

type User = {
  id: number;
  name: string;
  email: string;
};

const API_BASE = 'http://localhost:8080/api/users';

type DashboardProps = {
  onLogout: () => void;
};

function Dashboard({ onLogout }: DashboardProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [form, setForm] = useState<{ name: string; email: string }>({
    name: '',
    email: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(API_BASE);
      if (!res.ok) throw new Error('Failed to fetch users');
      const data: User[] = await res.json();
      setUsers(data);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const addUser = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/add`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error('Failed to add user');
      setForm({ name: '', email: '' });
      await fetchUsers();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Kitchen Companion Dashboard</h1>
        <button onClick={onLogout} className="logout-button">
          Logout
        </button>
      </header>
      
      <div className="dashboard-content">
        <div className="welcome-section">
          <h2>Welcome to your Kitchen Companion!</h2>
          <p>This is a demo dashboard. Below you can test the user management functionality.</p>
        </div>
        
        <div className="user-management">
          <h3>User Management (Demo)</h3>
          
          <form onSubmit={addUser} className="user-form">
            <input
              name="name"
              placeholder="Name"
              value={form.name}
              onChange={handleChange}
              required
            />
            <input
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              required
              type="email"
            />
            <button type="submit" disabled={loading}>
              Add User
            </button>
          </form>

          <button onClick={fetchUsers} disabled={loading} className="load-users-button">
            {loading ? 'Loading...' : 'Load Users'}
          </button>

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <div className="users-list">
            {users.map((u) => (
              <div key={u.id} className="user-item">
                {u.name} ({u.email})
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;

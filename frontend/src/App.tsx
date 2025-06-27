import { useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';

// Define the User type to match your backend response
type User = {
  id: number;
  name: string;
  email: string;
};

const API_BASE = 'http://localhost:8080/api/users';

function App() {
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
    <div style={{ maxWidth: 500, margin: '2rem auto', fontFamily: 'sans-serif' }}>
      <h1>SQLite User List</h1>
      <form onSubmit={addUser} style={{ marginBottom: '1rem' }}>
        <input
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={handleChange}
          required
          style={{ marginRight: 8 }}
        />
        <input
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
          type="email"
          style={{ marginRight: 8 }}
        />
        <button type="submit" disabled={loading}>
          Add
        </button>
      </form>

      <button type="button" onClick={fetchUsers} disabled={loading}>
        {loading ? 'Loading...' : 'Load Users'}
      </button>

      {error && (
        <div style={{ color: 'red', marginTop: 8 }}>
          {error}
        </div>
      )}

      <ul style={{ marginTop: 16 }}>
        {users.map((u) => (
          <li key={u.id}>
            {u.name} ({u.email})
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
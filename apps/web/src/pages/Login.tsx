import React, { useState, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

export default function Login() {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handle = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate('/');
    } catch (err: any) {
      setError(err.message || 'Login failed');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-12">
      <h2 className="text-xl font-semibold mb-4">Bejelentkezés</h2>
      <form onSubmit={handle} className="space-y-4">
        <input className="w-full p-2 border rounded" placeholder="Email" type="email" value={email} onChange={e=>setEmail(e.target.value)} required />
        <input className="w-full p-2 border rounded" placeholder="Jelszó" type="password" value={password} onChange={e=>setPassword(e.target.value)} required />
        <button className="px-4 py-2 bg-blue-600 text-white rounded">Bejelentkezés</button>
        {error && <p className="text-red-600">{error}</p>}
      </form>
      <p className="mt-4 text-sm text-gray-600">
        Nincs még fiókod? <Link to="/register" className="text-blue-600 underline">Regisztráció</Link>
      </p>
    </div>
  )
}

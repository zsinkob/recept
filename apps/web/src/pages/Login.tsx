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
      <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Bejelentkezés</h2>
      <form onSubmit={handle} className="space-y-4">
        <input className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:border-blue-500 focus:outline-none" placeholder="Email" type="email" value={email} onChange={e=>setEmail(e.target.value)} required />
        <input className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:border-blue-500 focus:outline-none" placeholder="Jelszó" type="password" value={password} onChange={e=>setPassword(e.target.value)} required />
        <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Bejelentkezés</button>
        {error && <p className="text-red-600 dark:text-red-400">{error}</p>}
      </form>
      <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
        Nincs még fiókod? <Link to="/register" className="text-blue-600 dark:text-blue-400 underline hover:text-blue-700 dark:hover:text-blue-300">Regisztráció</Link>
      </p>
    </div>
  )
}

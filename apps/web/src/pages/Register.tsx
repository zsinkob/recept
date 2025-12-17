import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handle = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post('/api/auth/register', { email, password, name });
      setSuccess(true);
      setTimeout(() => navigate('/login'), 1500);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Registration failed');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-12">
      <h2 className="text-xl font-semibold mb-4">Register</h2>
      {success && <p className="text-green-600 mb-4">Registration successful! Redirecting to login...</p>}
      <form onSubmit={handle} className="space-y-4">
        <input className="w-full p-2 border rounded" placeholder="Name (optional)" value={name} onChange={e=>setName(e.target.value)} />
        <input className="w-full p-2 border rounded" placeholder="Email" type="email" value={email} onChange={e=>setEmail(e.target.value)} required />
        <input className="w-full p-2 border rounded" placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} required />
        <button className="px-4 py-2 bg-blue-600 text-white rounded">Register</button>
        {error && <p className="text-red-600">{error}</p>}
      </form>
      <p className="mt-4 text-sm text-gray-600">
        Already have an account? <Link to="/login" className="text-blue-600 underline">Login</Link>
      </p>
    </div>
  )
}

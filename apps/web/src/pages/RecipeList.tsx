import React, { useEffect, useState } from 'react';
import { fetchRecipes } from '../api/recipes';
import { Link } from 'react-router-dom';

export default function RecipeList() {
  const [recipes, setRecipes] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchRecipes()
      .then(data => {
        if (Array.isArray(data)) {
          setRecipes(data);
        } else {
          setRecipes([]);
          setError('Invalid response from server');
        }
      })
      .catch((err) => {
        console.error('Failed to fetch recipes:', err);
        setRecipes([]);
        setError(err.message || 'Failed to load recipes');
      });
  }, []);

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Receptjeim</h2>
        <Link to="/new" className="px-3 py-1 bg-green-600 text-white rounded">Új</Link>
      </div>
      {error && <p className="text-red-600 mb-4">{error}</p>}
      <div className="grid grid-cols-1 gap-4">
        {recipes.map(r => (
          <Link key={r.id} to={`/recipes/${r.id}`} className="block p-4 bg-white rounded shadow">
            <h3 className="font-bold">{r.title}</h3>
            <p className="text-sm text-gray-600">{r.description}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}

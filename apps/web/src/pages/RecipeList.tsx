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
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">Receptjeim</h2>
        <Link to="/new" className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">Új recept</Link>
      </div>
      {error && <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {recipes.map(r => (
          <Link key={r.id} to={`/recipes/${r.id}`} className="block bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-lg dark:shadow-lg dark:hover:shadow-xl transition-shadow overflow-hidden border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600">
            <div className="aspect-video bg-gray-200 dark:bg-gray-700 relative">
              {r.imageUrl ? (
                <img src={r.imageUrl} alt={r.title} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400 dark:text-gray-500">
                  <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              )}
            </div>
            <div className="p-4">
              <h3 className="font-bold text-lg mb-1 break-words text-gray-900 dark:text-gray-100">{r.title}</h3>
              {r.description && <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3 break-words">{r.description}</p>}
            </div>
          </Link>
        ))}
      </div>
      {recipes.length === 0 && !error && (
        <div className="text-center py-12 text-gray-500">
          <p className="mb-4">Még nincs egyetlen recepted sem</p>
          <Link to="/new" className="text-blue-600 dark:text-blue-400 hover:underline">Hozz létre egyet most!</Link>
        </div>
      )}
    </div>
  )
}

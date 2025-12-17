import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { scrapeRecipe } from '../api/recipes';

export default function ScrapeRecipe() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const recipe = await scrapeRecipe(url);
      navigate(`/recipes/${recipe.id}`);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to scrape recipe');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Scrape Recipe from URL</h1>
      
      <div className="max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="url" className="block text-sm font-medium mb-2">
              Recipe URL (streetkitchen.hu)
            </label>
            <input
              id="url"
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://streetkitchen.hu/receptek/..."
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {error && (
            <div className="bg-red-50 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Scraping...' : 'Scrape Recipe'}
            </button>
            
            <button
              type="button"
              onClick={() => navigate('/recipes')}
              className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400"
            >
              Cancel
            </button>
          </div>
        </form>

        <div className="mt-8 p-6 bg-yellow-50 rounded-lg border border-yellow-200">
          <h2 className="font-semibold mb-2">How to use:</h2>
          <ol className="list-decimal list-inside space-y-1 text-sm">
            <li>Go to streetkitchen.hu and find a recipe you want to save</li>
            <li>Copy the full URL from your browser's address bar</li>
            <li>Paste it into the field above and click "Scrape Recipe"</li>
            <li>The recipe will be automatically imported with all ingredients and steps</li>
          </ol>
        </div>
      </div>
    </div>
  );
}

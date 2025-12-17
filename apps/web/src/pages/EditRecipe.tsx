import React, { useState, useEffect } from 'react';
import { fetchRecipe, updateRecipe, uploadImage } from '../api/recipes';
import { useNavigate, useParams } from 'react-router-dom';

export default function EditRecipe() {
  const { id } = useParams<{ id: string }>();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [ingredients, setIngredients] = useState<{ name: string; amount?: string }[]>([]);
  const [steps, setSteps] = useState<{ order: number; text: string }[]>([]);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [currentImageUrl, setCurrentImageUrl] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      fetchRecipe(id).then((recipe) => {
        setTitle(recipe.title);
        setDescription(recipe.description || '');
        setIngredients(recipe.ingredients || []);
        setSteps(recipe.steps || []);
        setCurrentImageUrl(recipe.imageUrl || '');
        setLoading(false);
      });
    }
  }, [id]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    let imageUrl: string | undefined = currentImageUrl;

    try {
      if (imageFile) {
        const form = new FormData();
        form.append('image', imageFile);
        const upload = await uploadImage(form);
        imageUrl = upload.imageUrl;
      }
    } catch (err) {
      console.error('Image upload failed', err);
    }

    const payload = { title, description, ingredients, steps, imageUrl };
    await updateRecipe(id!, payload);
    navigate(`/recipes/${id}`);
  };

  if (loading) return <div>Betöltés...</div>;

  return (
    <form onSubmit={submit} className="space-y-4">
      <h1 className="text-2xl font-bold mb-4">Recept szerkesztése</h1>
      
      <input
        className="w-full p-2 border rounded"
        placeholder="Cím"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      
      <textarea
        className="w-full p-2 border rounded"
        placeholder="Leírás (opcionális)"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <div>
        <h4 className="font-semibold mb-2">Hozzávalók</h4>
        {ingredients.map((ing, idx) => (
          <div key={idx} className="flex gap-2 mb-2">
            <input
              className="flex-1 p-2 border rounded"
              placeholder="Név"
              value={ing.name}
              onChange={(e) => {
                const arr = [...ingredients];
                arr[idx].name = e.target.value;
                setIngredients(arr);
              }}
            />
            <input
              className="w-32 p-2 border rounded"
              placeholder="Mennyiség"
              value={ing.amount || ''}
              onChange={(e) => {
                const arr = [...ingredients];
                arr[idx].amount = e.target.value;
                setIngredients(arr);
              }}
            />
            <button
              type="button"
              onClick={() => setIngredients(ingredients.filter((_, i) => i !== idx))}
              className="px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200"
            >
              Eltávolítás
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => setIngredients([...ingredients, { name: '', amount: '' }])}
          className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
        >
          Hozzávaló hozzáadása
        </button>
      </div>

      <div>
        <h4 className="font-semibold mb-2">Kép</h4>
        {currentImageUrl && !imageFile && (
          <div className="mb-2">
            <img src={currentImageUrl} alt="Current" className="w-32 h-32 object-cover rounded mb-2" />
            <p className="text-sm text-gray-600">Jelenlegi kép</p>
          </div>
        )}
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
          className="block"
        />
        {imageFile && (
          <p className="text-sm text-green-600 mt-1">Új kép kiválasztva: {imageFile.name}</p>
        )}
      </div>

      <div>
        <h4 className="font-semibold mb-2">Lépések</h4>
        {steps.map((s, idx) => (
          <div key={idx} className="mb-2">
            <textarea
              className="w-full p-2 border rounded"
              placeholder="Lépés leírása"
              value={s.text}
              rows={2}
              onChange={(e) => {
                const arr = [...steps];
                arr[idx].text = e.target.value;
                setSteps(arr);
              }}
            />
            <button
              type="button"
              onClick={() => setSteps(steps.filter((_, i) => i !== idx))}
              className="px-3 py-1 mt-1 bg-red-100 text-red-700 rounded hover:bg-red-200"
            >
              Eltávolítás
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => setSteps([...steps, { order: steps.length, text: '' }])}
          className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
        >
          Lépés hozzáadása
        </button>
      </div>

      <div className="flex gap-4">
        <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          Változtatások mentése
        </button>
        <button
          type="button"
          onClick={() => navigate(`/recipes/${id}`)}
          className="px-6 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
        >
          Mégse
        </button>
      </div>
    </form>
  );
}

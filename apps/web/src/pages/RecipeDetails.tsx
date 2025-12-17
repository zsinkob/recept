import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { fetchRecipe, deleteRecipe } from '../api/recipes';

export default function RecipeDetails(){
  const { id } = useParams();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState<any | null>(null);
  const [checkedIngredients, setCheckedIngredients] = useState<Record<string, boolean>>({});
  const [checkedSteps, setCheckedSteps] = useState<Record<number, boolean>>({});

  useEffect(()=>{
    if(!id) return;
    fetchRecipe(id).then(r=>{
      setRecipe(r);
      const ingState: Record<string, boolean> = {};
      (r.ingredients || []).forEach((ing:any)=> ingState[ing.id] = false);
      setCheckedIngredients(ingState);
      const stepState: Record<number, boolean> = {};
      (r.steps || []).forEach((s:any)=> stepState[s.order] = false);
      setCheckedSteps(stepState);
    }).catch(()=>setRecipe(null));
  },[id]);

  const handleDelete = async () => {
    if (!id) return;
    if (confirm('Biztosan törölni szeretnéd ezt a receptet?')) {
      await deleteRecipe(id);
      navigate('/');
    }
  };

  if(!recipe) return <div>Loading...</div>

  return (
    <div>
      <div className="flex justify-between items-start mb-4">
        <h2 className="text-2xl font-bold">{recipe.title}</h2>
        <div className="flex gap-2">
          <Link
            to={`/recipes/${id}/edit`}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Szerkesztés
          </Link>
          <button
            onClick={handleDelete}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Törlés
          </button>
        </div>
      </div>
      {recipe.imageUrl && <img src={recipe.imageUrl} alt={recipe.title} className="w-full h-64 object-cover rounded mb-4" />}
      <p className="text-gray-700 mb-4">{recipe.description}</p>

      <section className="mb-6">
        <h3 className="font-semibold mb-2">Hozzávalók</h3>
        <ul className="space-y-2">
          {recipe.ingredients.map((ing:any)=> (
            <li key={ing.id} className="flex items-center">
              <input type="checkbox" className="mr-2" checked={!!checkedIngredients[ing.id]} onChange={()=>{
                setCheckedIngredients({...checkedIngredients, [ing.id]: !checkedIngredients[ing.id]});
              }} />
              <span>{ing.amount ? `${ing.amount} ` : ''}{ing.name}</span>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h3 className="font-semibold mb-2">Elkészítés</h3>
        <ol className="space-y-2">
          {recipe.steps.sort((a:any,b:any)=>a.order-b.order).map((s:any)=> (
            <li key={s.id} className="flex items-start">
              <input type="checkbox" className="mr-2 mt-1" checked={!!checkedSteps[s.order]} onChange={()=>{
                setCheckedSteps({...checkedSteps, [s.order]: !checkedSteps[s.order]});
              }} />
              <p>{s.text}</p>
            </li>
          ))}
        </ol>
      </section>
    </div>
  )
}

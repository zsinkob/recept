import React, { useState } from 'react';
import { createRecipe } from '../api/recipes';
import { useNavigate } from 'react-router-dom';

export default function NewRecipe(){
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [ingredients, setIngredients] = useState<{name:string,amount?:string}[]>([{name:'',amount:''}]);
  const [steps, setSteps] = useState<{order:number,text:string}[]>([{order:1,text:''}]);
  const navigate = useNavigate();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = { title, description, ingredients, steps };
    const res = await createRecipe(payload);
    navigate(`/recipes/${res.id}`);
  };

  return (
    <form onSubmit={submit} className="space-y-4">
      <input className="w-full p-2 border" placeholder="Title" value={title} onChange={e=>setTitle(e.target.value)} />
      <textarea className="w-full p-2 border" placeholder="Description" value={description} onChange={e=>setDescription(e.target.value)} />

      <div>
        <h4 className="font-semibold mb-2">Ingredients</h4>
        {ingredients.map((ing, idx)=> (
          <div key={idx} className="flex gap-2 mb-2">
            <input className="flex-1 p-2 border" placeholder="Name" value={ing.name} onChange={e=>{
              const arr = [...ingredients]; arr[idx].name = e.target.value; setIngredients(arr);
            }} />
            <input className="w-32 p-2 border" placeholder="Amount" value={ing.amount} onChange={e=>{
              const arr = [...ingredients]; arr[idx].amount = e.target.value; setIngredients(arr);
            }} />
            <button type="button" onClick={()=> setIngredients(ingredients.filter((_,i)=>i!==idx))} className="px-2">Remove</button>
          </div>
        ))}
        <button type="button" onClick={()=> setIngredients([...ingredients, {name:'',amount:''}])} className="px-3 py-1 bg-gray-200 rounded">Add Ingredient</button>
      </div>

      <div>
        <h4 className="font-semibold mb-2">Steps</h4>
        {steps.map((s, idx)=> (
          <div key={idx} className="mb-2">
            <input className="w-full p-2 border" placeholder="Step description" value={s.text} onChange={e=>{
              const arr = [...steps]; arr[idx].text = e.target.value; setSteps(arr);
            }} />
            <button type="button" onClick={()=> setSteps(steps.filter((_,i)=>i!==idx))} className="px-2 mt-1">Remove</button>
          </div>
        ))}
        <button type="button" onClick={()=> setSteps([...steps, {order: steps.length+1, text: ''}])} className="px-3 py-1 bg-gray-200 rounded">Add Step</button>
      </div>

      <button className="px-4 py-2 bg-blue-600 text-white rounded">Create</button>
    </form>
  )
}

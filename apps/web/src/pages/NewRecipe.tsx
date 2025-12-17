import React, { useState } from 'react';
import { createRecipe } from '../api/recipes';
import { useNavigate } from 'react-router-dom';

export default function NewRecipe(){
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [ingredients, setIngredients] = useState<{name:string,amount?:string}[]>([{name:'',amount:''}]);
  const [steps, setSteps] = useState<{order:number,text:string}[]>([{order:1,text:''}]);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const navigate = useNavigate();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    let imageUrl: string | undefined = undefined;
    try {
      if (imageFile) {
        const form = new FormData();
        form.append('image', imageFile);
        const upload = await (await import('../api/recipes')).uploadImage(form);
        imageUrl = upload.imageUrl;
      }
    } catch (err) {
      console.error('Image upload failed', err);
    }

    const payload = { title, description, ingredients, steps, imageUrl };
    const res = await createRecipe(payload);
    navigate(`/recipes/${res.id}`);
  };

  return (
    <form onSubmit={submit} className="space-y-4">
      <input className="w-full p-2 border" placeholder="Cím" value={title} onChange={e=>setTitle(e.target.value)} />
      <textarea className="w-full p-2 border" placeholder="Leírás" value={description} onChange={e=>setDescription(e.target.value)} />

      <div>
        <h4 className="font-semibold mb-2">Hozzávalók</h4>
        {ingredients.map((ing, idx)=> (
          <div key={idx} className="flex gap-2 mb-2">
            <input className="flex-1 p-2 border" placeholder="Név" value={ing.name} onChange={e=>{
              const arr = [...ingredients]; arr[idx].name = e.target.value; setIngredients(arr);
            }} />
            <input className="w-32 p-2 border" placeholder="Mennyiség" value={ing.amount} onChange={e=>{
              const arr = [...ingredients]; arr[idx].amount = e.target.value; setIngredients(arr);
            }} />
            <button type="button" onClick={()=> setIngredients(ingredients.filter((_,i)=>i!==idx))} className="px-2">Eltávolítás</button>
          </div>
        ))}
        <button type="button" onClick={()=> setIngredients([...ingredients, {name:'',amount:''}])} className="px-3 py-1 bg-gray-200 rounded">Hozzávaló hozzáadása</button>
      </div>

      <div>
        <h4 className="font-semibold mb-2">Kép (opcionális)</h4>
        <input type="file" accept="image/*" onChange={e=> setImageFile(e.target.files?.[0] ?? null)} />
      </div>

      <div>
        <h4 className="font-semibold mb-2">Lépések</h4>
        {steps.map((s, idx)=> (
          <div key={idx} className="mb-2">
            <input className="w-full p-2 border" placeholder="Lépés leírása" value={s.text} onChange={e=>{
              const arr = [...steps]; arr[idx].text = e.target.value; setSteps(arr);
            }} />
            <button type="button" onClick={()=> setSteps(steps.filter((_,i)=>i!==idx))} className="px-2 mt-1">Eltávolítás</button>
          </div>
        ))}
        <button type="button" onClick={()=> setSteps([...steps, {order: steps.length+1, text: ''}])} className="px-3 py-1 bg-gray-200 rounded">Lépés hozzáadása</button>
      </div>

      <button className="px-4 py-2 bg-blue-600 text-white rounded">Létrehozás</button>
    </form>
  )
}

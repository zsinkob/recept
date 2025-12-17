import apiClient from './client';

export async function fetchRecipes() {
  const res = await apiClient.get('/recipes');
  return res.data;
}

export async function fetchRecipe(id: string) {
  const res = await apiClient.get(`/recipes/${id}`);
  return res.data;
}

export async function createRecipe(data: any) {
  const res = await apiClient.post('/recipes', data);
  return res.data;
}

export async function uploadImage(form: FormData) {
  const res = await apiClient.post('/recipes/upload', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.data;
}

export async function updateRecipe(id: string, data: any) {
  const res = await apiClient.put(`/recipes/${id}`, data);
  return res.data;
}

export async function deleteRecipe(id: string) {
  const res = await apiClient.delete(`/recipes/${id}`);
  return res.data;
}

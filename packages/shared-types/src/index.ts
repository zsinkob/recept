export interface Ingredient {
  id: string;
  name: string;
  amount?: string;
}

export interface Step {
  id: string;
  order: number;
  description: string;
}

export interface Recipe {
  id: string;
  title: string;
  description?: string;
  imageUrl?: string;
  ingredients: Ingredient[];
  steps: Step[];
  userId: string;
}

export interface CreateRecipeDto {
  title: string;
  description?: string;
  ingredients: Omit<Ingredient, 'id'>[];
  steps: Omit<Step, 'id'>[];
}

export interface User {
  id: string;
  email: string;
  name?: string;
}

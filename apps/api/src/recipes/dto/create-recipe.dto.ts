export class CreateIngredientDto {
  name: string;
  amount?: string;
}

export class CreateStepDto {
  order: number;
  text: string;
}

export class CreateRecipeDto {
  title: string;
  description?: string;
  imageUrl?: string;
  ingredients: CreateIngredientDto[];
  steps: CreateStepDto[];
}

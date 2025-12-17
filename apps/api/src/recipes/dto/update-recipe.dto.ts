import { CreateRecipeDto } from './create-recipe.dto';

export class UpdateRecipeDto implements Partial<CreateRecipeDto> {
  title?: string;
  description?: string;
  imageUrl?: string;
  ingredients?: { name: string; amount?: string }[];
  steps?: { order: number; text: string }[];
}

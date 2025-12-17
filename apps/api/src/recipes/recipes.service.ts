import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateRecipeDto } from './dto/create-recipe.dto';

@Injectable()
export class RecipesService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, dto: CreateRecipeDto) {
    const recipe = await this.prisma.recipe.create({
      data: {
        title: dto.title,
        description: dto.description,
        imageUrl: dto.imageUrl,
        user: { connect: { id: userId } },
        ingredients: {
          create: dto.ingredients?.map((ing) => ({ name: ing.name, amount: ing.amount })) ?? [],
        },
        steps: {
          create: dto.steps?.map((s) => ({ order: s.order, text: s.text })) ?? [],
        },
      },
      include: { ingredients: true, steps: true },
    });
    return recipe;
  }

  async findAllByUser(userId: string) {
    return this.prisma.recipe.findMany({ where: { userId }, include: { ingredients: true, steps: true } });
  }

  async findById(id: string, userId?: string) {
    const recipe = await this.prisma.recipe.findUnique({ where: { id }, include: { ingredients: true, steps: true } });
    if (!recipe) throw new NotFoundException('Recipe not found');
    if (userId && recipe.userId !== userId) throw new ForbiddenException();
    return recipe;
  }

  async update(id: string, userId: string, dto: Partial<CreateRecipeDto>) {
    const recipe = await this.prisma.recipe.findUnique({ where: { id } });
    if (!recipe) throw new NotFoundException('Recipe not found');
    if (recipe.userId !== userId) throw new ForbiddenException();

    // Simple replace of ingredients and steps for now
    await this.prisma.ingredient.deleteMany({ where: { recipeId: id } });
    await this.prisma.preparationStep.deleteMany({ where: { recipeId: id } });

    const updated = await this.prisma.recipe.update({
      where: { id },
      data: {
        title: dto.title ?? recipe.title,
        description: dto.description ?? recipe.description,
        imageUrl: dto.imageUrl ?? recipe.imageUrl,
        ingredients: {
          create: dto.ingredients?.map((ing) => ({ name: ing.name, amount: ing.amount })) ?? [],
        },
        steps: {
          create: dto.steps?.map((s) => ({ order: s.order, text: s.text })) ?? [],
        },
      },
      include: { ingredients: true, steps: true },
    });

    return updated;
  }

  async remove(id: string, userId: string) {
    const recipe = await this.prisma.recipe.findUnique({ where: { id } });
    if (!recipe) throw new NotFoundException('Recipe not found');
    if (recipe.userId !== userId) throw new ForbiddenException();
    await this.prisma.recipe.delete({ where: { id } });
    return { success: true };
  }
}

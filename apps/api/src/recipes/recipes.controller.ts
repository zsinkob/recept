import { Controller, Get, Post, Body, Param, Delete, Put, UseGuards, Request } from '@nestjs/common';
import { RecipesService } from './recipes.service';
import { CreateRecipeDto } from './dto/create-recipe.dto';
import { AuthGuard } from '@nestjs/passport';

@UseGuards(AuthGuard('jwt'))
@Controller('recipes')
export class RecipesController {
  constructor(private recipesService: RecipesService) {}

  @Get()
  async findAll(@Request() req: any) {
    return this.recipesService.findAllByUser(req.user.userId);
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Request() req: any) {
    return this.recipesService.findById(id, req.user.userId);
  }

  @Post()
  async create(@Body() dto: CreateRecipeDto, @Request() req: any) {
    return this.recipesService.create(req.user.userId, dto);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() dto: any, @Request() req: any) {
    return this.recipesService.update(id, req.user.userId, dto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Request() req: any) {
    return this.recipesService.remove(id, req.user.userId);
  }
}

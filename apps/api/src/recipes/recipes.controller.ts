import { Controller, Get, Post, Body, Param, Delete, Put, UseGuards, Request, UploadedFile, UseInterceptors, BadRequestException } from '@nestjs/common';
import { RecipesService } from './recipes.service';
import { CreateRecipeDto } from './dto/create-recipe.dto';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { ScraperService } from '../scraper/scraper.service';

@UseGuards(AuthGuard('jwt'))
@Controller('recipes')
export class RecipesController {
  constructor(
    private recipesService: RecipesService,
    private scraperService: ScraperService,
  ) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('image', {
    storage: diskStorage({
      destination: './uploads/recipes',
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const fileExt = extname(file.originalname);
        cb(null, `recipe-${uniqueSuffix}${fileExt}`);
      }
    }),
    fileFilter: (req, file, cb) => {
      if (!file.mimetype.startsWith('image/')) {
        return cb(new BadRequestException('Only image files are allowed'), false as any);
      }
      cb(null, true as any);
    },
    limits: { fileSize: 5 * 1024 * 1024 },
  }))
  async uploadImage(@UploadedFile() file: Express.Multer.File) {
    if (!file) throw new BadRequestException('No file uploaded');
    return { imageUrl: `/uploads/recipes/${file.filename}` };
  }

  @Post('scrape')
  async scrapeRecipe(@Body() body: { url: string }, @Request() req: any) {
    const { url } = body;
    if (!url) {
      throw new BadRequestException('URL is required');
    }

    // Scrape the recipe
    const scrapedData = await this.scraperService.scrapeRecipe(url);

    // Create recipe from scraped data
    const createDto: CreateRecipeDto = {
      title: scrapedData.title,
      imageUrl: scrapedData.imageFileName 
        ? `/uploads/recipes/${scrapedData.imageFileName}` 
        : undefined,
      ingredients: scrapedData.ingredients.map((ing) => ({
        amount: ing.amount,
        name: ing.name,
      })),
      steps: scrapedData.steps.map((step, index) => ({
        order: index,
        text: step,
      })),
    };

    return this.recipesService.create(req.user.userId, createDto);
  }

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

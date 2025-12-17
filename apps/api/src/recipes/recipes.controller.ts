import { Controller, Get, Post, Body, Param, Delete, Put, UseGuards, Request, UploadedFile, UseInterceptors, BadRequestException } from '@nestjs/common';
import { RecipesService } from './recipes.service';
import { CreateRecipeDto } from './dto/create-recipe.dto';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@UseGuards(AuthGuard('jwt'))
@Controller('recipes')
export class RecipesController {
  constructor(private recipesService: RecipesService) {}

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

import { Injectable, BadRequestException } from '@nestjs/common';
import * as cheerio from 'cheerio';
import axios from 'axios';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class ScraperService {
  async scrapeRecipe(url: string) {
    try {
      // Validate URL
      if (!url.includes('streetkitchen.hu')) {
        throw new BadRequestException('Only streetkitchen.hu URLs are supported');
      }

      // Fetch the HTML
      const response = await axios.get(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
        },
      });

      const $ = cheerio.load(response.data);

      // Extract recipe title (from h1 or h2)
      let title = $('h1').first().text().trim();
      if (!title) {
        title = $('h2').first().text().trim();
      }

      // Extract image URL
      let imageUrl = '';
      const imgElement = $('img[src*="streetkitchen-cdn.com"]').first();
      if (imgElement.length) {
        imageUrl = imgElement.attr('src') || '';
        // Prefer large version
        if (!imageUrl.includes('large') && !imageUrl.includes('webp')) {
          imageUrl = imgElement.attr('srcset')?.split(' ')[0] || imageUrl;
        }
      }

      // Download image if found
      let imageFileName = '';
      if (imageUrl) {
        imageFileName = await this.downloadImage(imageUrl);
      }

      // Extract ingredients
      const ingredients: { amount: string; name: string }[] = [];
      
      // Find ingredient containers with checkboxes
      $('div.my-2.flex.items-center.gap-2.text-lg').each((_, element) => {
        const $element = $(element);
        
        // Check if it contains a checkbox (input[type="checkbox"])
        if ($element.find('input[type="checkbox"]').length > 0) {
          const innerDiv = $element.find('div.flex.items-center.gap-2').last();
          if (innerDiv.length) {
            const amountDiv = innerDiv.find('div').first();
            const nameDiv = innerDiv.find('div.font-bold');
            
            const amount = amountDiv.text().trim();
            const name = nameDiv.text().trim();
            
            if (name) {
              ingredients.push({ amount, name });
            }
          }
        }
      });

      // Extract preparation steps
      const steps: string[] = [];
      
      // Find the preparation section
      $('article.recipe-preparation ol.list-decimal li').each((_, element) => {
        const $element = $(element);
        const stepText = $element.find('p').text().trim();
        
        if (stepText) {
          steps.push(stepText);
        }
      });

      // If no ingredients found, throw error
      if (ingredients.length === 0) {
        throw new BadRequestException('Could not extract ingredients from the page');
      }

      // If no steps found, throw error
      if (steps.length === 0) {
        throw new BadRequestException('Could not extract preparation steps from the page');
      }

      return {
        title: title || 'Untitled Recipe',
        imageFileName,
        ingredients,
        steps,
      };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      
      console.error('Scraping error:', error);
      
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      throw new BadRequestException(
        `Failed to scrape recipe: ${errorMessage}`,
      );
    }
  }

  private async downloadImage(imageUrl: string): Promise<string> {
    try {
      // Create uploads directory if it doesn't exist
      const uploadsDir = path.join(process.cwd(), 'uploads', 'recipes');
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
      }

      // Generate unique filename
      const timestamp = Date.now();
      const extension = path.extname(new URL(imageUrl).pathname) || '.jpg';
      const filename = `scraped-${timestamp}${extension}`;
      const filepath = path.join(uploadsDir, filename);

      // Download image
      const response = await axios.get(imageUrl, {
        responseType: 'arraybuffer',
        headers: {
          'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
        },
      });

      // Save to disk
      fs.writeFileSync(filepath, response.data);

      return filename;
    } catch (error) {
      console.error('Image download error:', error);
      return ''; // Return empty string if download fails
    }
  }
}

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedIngredients() {
  try {
    //create array of objects to seed the database
    const ingredients = [
      { name: 'beef',max_stock_limit: 20, stock_limit: 20, stock_warning_status: false,unit:'kg' },
      { name: 'cheese',max_stock_limit: 5, stock_limit: 5, stock_warning_status: false ,unit:'kg'},
      { name: 'onion',max_stock_limit: 1, stock_limit: 1, stock_warning_status: false ,unit:'kg'},
    ];
    //query to insert into the database
    for (const ingredient of ingredients) {
      await prisma.ingredient.create({
        data: ingredient,
      });
    }

    console.log('Ingredients inserted successfully');
  } catch (error) {
    console.error('Error seeding Ingredients data:', error);
  } finally {
    // disconnect Prisma client after seeding
    await prisma.$disconnect();
  }
}

seedIngredients();

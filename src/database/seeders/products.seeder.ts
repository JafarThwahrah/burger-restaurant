import { PrismaClient } from "@prisma/client";
import { Product } from "../../interfaces/product.interface";

const prisma = new PrismaClient();

export default async function seedProducts() {
  try {
    //create array of objects to seed the database
    const requiredIngredients = ["beef", "cheese", "onion"];

    // Fetch the ingredient IDs for the required ingredients
    const ingredients = await prisma.ingredient.findMany({
      where: {
        name: {
          in: requiredIngredients,
        },
      },
    });

    // Create the products dynamically based on the fetched ingredient IDs
    let products = [];
    for (let index = 1; index <= 2; index++) {
      const burgerIngredients = requiredIngredients.map((ingredientName) => {
        const foundIngredient = ingredients.find(
          (ing) => ing.name === ingredientName
        );
        let amount;
        switch (ingredientName) {
          case "beef":
            amount = 150 * index;
            break;
          case "cheese":
            amount = 30 * index;
            break;
          case "onion":
            amount = 20 * index;
            break;
          default:
            amount = 0;
            break;
        }

        return {
          ingredient_id: foundIngredient?.id || 0,
          amount: amount,
          unit: "g",
        };
      });

      products.push({
        name: `burger${index}`,
        ingredients: burgerIngredients,
      });
    }

    let newProduct;

    for (const productPayload of products) {
      // create the product
      newProduct = await prisma.product.create({
        data: { name: productPayload.name },
      });

      //create product ingredient with amount
      for (const ingredient of productPayload.ingredients) {
        await prisma.productIngredient.create({
          data: {
            productId: newProduct.id,
            amount: ingredient.amount,
            unit: ingredient.unit,
            ingredientId: ingredient.ingredient_id,
          },
        });
      }
    }
    console.log("Products inserted successfully");
  } catch (error) {
    console.error("Error seeding Products data:", error);
  } finally {
    // disconnect Prisma client after seeding
    await prisma.$disconnect();
  }
}

seedProducts();

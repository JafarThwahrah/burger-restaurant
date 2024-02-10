import { Ingredient } from "../interfaces/ingredient.interface";
import { ProductOrderPayLoad } from "../interfaces/order.interfaces";
import prisma from "../services/prisma.service";

export const checkIngredientsAvailablity = async (
    ingredients: Ingredient[],
    productsPayload: ProductOrderPayLoad[]
  ) => {
    // Fetch all product ingredients for the provided list of products
    const productIngredients = await prisma.productIngredient.findMany({
      where: {
        productId: {
          in: productsPayload.map((productPayLoad) => productPayLoad.productId),
        },
      },
      include: {
        ingredient: true, // Include the associated ingredient
      },
    });
  
    // Calculate the total amount of consumed ingredients for each product
    const totalIngredients: { [key: number]: number } = {};
    productsPayload.forEach((productPayLoad) => {
      const productIngredient = productIngredients.filter(
        (productIngredient) =>
          productIngredient.productId === productPayLoad.productId
      );
      productIngredient.forEach((productIngredient) => {
        totalIngredients[productIngredient.ingredientId] =
          (totalIngredients[productIngredient.ingredientId] || 0) +
          productIngredient.amount * productPayLoad.quantity;
      });
    });
  
    //check if each ingredient have the available amount to create the order
    let isAvailable = true;
    for (const ingredient of ingredients) {
      const totalQuantity = totalIngredients[ingredient.id];
  
      if (ingredient.stock_limit < totalQuantity / 1000) {
        isAvailable = false;
        break;
      }
    }
    return isAvailable;
  };
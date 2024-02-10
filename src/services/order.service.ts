import prisma from "./prisma.service";
import { ProductOrderPayLoad } from "../interfaces/order.interfaces";
import { Ingredient } from "../interfaces/ingredient.interface";
import { Product } from "../interfaces/product.interface";
import sendEmail from "../mails/ingredientStockWarningEmal";
import { Request, Response } from "express";

const checkIngredientsAvailablity = async (
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
  // console.log(totalIngredients);

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

const orderService = {
  store: async (req: Request, res: Response) => {
    const productsPayload: ProductOrderPayLoad[] = req.body.products;

    //check if the received productIds are correct, the function return boolean
    const productIds = productsPayload.map((product) => product.productId);
    const productsList = await prisma.product.findMany({
      where: {
        id: {
          in: productIds,
        },
      },
    });
    //if one product doesnt exist return error
    if (productsList.length < productIds.length)
      throw new Error("No products found for the provided IDs");

    //get ingredients that the requested products have to check stock availability
    const ingredients = await prisma.productIngredient
      .findMany({
        where: {
          productId: {
            in: productIds,
          },
        },
        distinct: ["ingredientId"],
        include: {
          ingredient: true,
        },
      })
      .then((productIngredients) =>
        productIngredients.map((pi) => pi.ingredient)
      );
    const ingredientsStockAvailability = await checkIngredientsAvailablity(
      ingredients,
      productsPayload
    );

    if (!ingredientsStockAvailability)
      throw new Error("No available stock to create your order");

    const order = await prisma.order.create({});
    const products = productsPayload.map(
      async (product: ProductOrderPayLoad) => {
        const orderProduct = await prisma.orderProduct.create({
          data: {
            orderId: order.id,
            productId: product.productId,
            quantity: product.quantity,
            //I included the relation to be able to access the productIngredient instance later
          },
          include: {
            product: {
              include: {
                ingredients: true,
              },
            },
          },
        });

        ingredients.map(async (ingredient) => {
          const productIngredient = orderProduct.product.ingredients.find(
            (productIngredient) =>
              productIngredient.ingredientId === ingredient.id
          );
          if (ingredient && productIngredient) {
            // Subtract the amount from the stock_limit
            ingredient.stock_limit -=
              (productIngredient.amount * orderProduct.quantity) / 1000;
            // Update ingredient stock_limit after subtraction
            await prisma.ingredient.update({
              where: { id: ingredient.id },
              data: { stock_limit: ingredient.stock_limit },
            });
            // Check if the stock reached 50% or less and whether a warning email has been sent previously
            if (
              ingredient.stock_limit / ingredient.max_stock_limit <= 0.5 &&
              !ingredient.stock_warning_status
            ) {
              // Send an email
              try {
                const info = await sendEmail(
                  "jaffardawahreh2@gmail.com",
                  "Ingredient Stock Limit Warning",
                  `Your stock of ${ingredient.name} is less than 50% of the max storage limit`
                );
                // Update warning status for the ingredient in the database
                await prisma.ingredient.update({
                  where: { id: ingredient.id },
                  data: { stock_warning_status: true },
                });
              } catch (error) {
                throw new Error("Error occurred while sending email.");
              }
            }
          } else {
            throw new Error("Product ingredient not found.");
          }
        });
      }
    );
  },
};

export default orderService;

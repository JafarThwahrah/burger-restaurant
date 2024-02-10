import prisma from "./prisma.service";
import { ProductOrderPayLoad } from "../interfaces/order.interfaces";
import sendEmail from "../mails/ingredientStockWarningEmail";
import { Request, Response } from "express";
import messages from "../utilities/messages";
import { checkIngredientsAvailablity } from "../utilities/helpers";

const orderService = {
  store: async (req: Request, res: Response) => {
    const productsPayload: ProductOrderPayLoad[] = req.body.products;

    //check if the received productIds are correct, the function return boolean
    const productIds = productsPayload.map((product) => product.productId);
    if(!productIds)
    throw new Error(messages.productNotFound);

    const productsList = await prisma.product.findMany({
      where: {
        id: {
          in: productIds,
        },
      },
    });
    //if one product doesnt exist return error
    if (productsList.length < productIds.length)
      throw new Error(messages.productNotFound);

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
      throw new Error(messages.unAvailableStock);

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
                throw new Error(messages.emailFailed);
              }
            }
          } else {
            throw new Error(messages.productIngredientNotFound);
          }
        });
      }
    );
    return order;
  },
  
};

export default orderService;
export function store(mockRequest: any, mockResponse: any): any {
    throw new Error('Function not implemented.');
}


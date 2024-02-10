export default {
  paths: {
    "/orders/store": {
      post: {
        tags: ["Orders"],
        summary: "Create new order",
        parameters: [
          {
            name: "order",
            in: "body",
            schema: {
              $ref: "#/definitions/Order",
            },
          },
        ],
        responses: {
          200: {
            description: "Success",
          },
          400: {
            description: "Error",
          },
        },
      },
    },
    "/products": {
      get: {
        tags: ["Products"],
        summary: "Get Available Products",
        responses: {
          200: {
            description: "Success",
          },
          400: {
            description: "Error",
          },
        },
      },
    },
  },
  definitions: {
    Order: {
      type: "object",
      properties: {
        products: {
          type: "array",
          items: {
            type: "object",
            properties: {
              productId: {
                type: "integer",
              },
              quantity: {
                type: "integer",
              },
            },
          },
        },
      },
    },
    Product: {
      type: "object",
    },
  },
};

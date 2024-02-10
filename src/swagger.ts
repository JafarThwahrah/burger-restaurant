import swaggerJsdoc from "swagger-jsdoc";
import orderSwagger from "./swagger/order.swagger";
import productSwagger from "./swagger/product.swagger";
const options = {
  swaggerDefinition: {
    info: {
      title: "Express API with Swagger",
      version: "1.0.0",
      description: "Documentation for Express API",
    },
    basePath: "/api",
  },
  apis: ["./swagger/*.swagger.ts"],
};

const swaggerDefinitionWithConfig = {
  ...options.swaggerDefinition,
  paths: {
    ...orderSwagger.paths,
    ...productSwagger.paths,
  },
  definitions: {
    ...orderSwagger.definitions,
    ...productSwagger.definitions,
  },
};

const swaggerSpec = swaggerJsdoc({
  ...options,
  swaggerDefinition: swaggerDefinitionWithConfig,
});

export default swaggerSpec;

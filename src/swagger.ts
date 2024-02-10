import swaggerJsdoc from "swagger-jsdoc";
import orderSwagger from "./swagger/order.swagger";

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
  ...orderSwagger,
};

const swaggerSpec = swaggerJsdoc({
  ...options,
  swaggerDefinition: swaggerDefinitionWithConfig,
});

export default swaggerSpec;

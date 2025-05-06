// lib/swagger.ts
import swaggerJSDoc from "swagger-jsdoc";

export const swaggerSpec = swaggerJSDoc({
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Smart Saver API",
      version: "1.0.0",
      description: "API docs for your Smart Saver backend",
    },
  },
  apis: ["**/app/api/**/*.ts"], // Point to route files with JSDoc comments
});

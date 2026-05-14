import { addressDocs } from "../docs/address.docs.js";
import { authDocs } from "../docs/auth.docs.js";
import { cartDocs } from "../docs/cart.docs.js";
import { orderDocs } from "../docs/order.docs.js";
import { productDocs } from "../docs/products.docs.js";
import { env } from "../schemas/env.schema.js";

export const swaggerSpec = {
  openapi: "3.0.0",
  info: {
    title: "E-commerce API",
    description: "REST API for an e-commerce platform",
  },
  servers: [{ url: `http://localhost:${env.PORT}`, description: "Local" }],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
  },
  paths: {
    ...authDocs,
    ...productDocs,
    ...cartDocs,
    ...addressDocs,
    ...orderDocs,
  },
};

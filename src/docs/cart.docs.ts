export const cartDocs = {
  "/carts": {
    get: {
      summary: "Get user cart",
      tags: ["Cart"],
      security: [{ bearerAuth: [] }],
      responses: {
        200: {
          description: "Cart returned successfully",
        },
        401: {
          description: "Unauthorized",
        },
      },
    },

    post: {
      summary: "Create user cart",
      tags: ["Cart"],
      security: [{ bearerAuth: [] }],
      responses: {
        201: {
          description: "Cart created successfully",
        },
        401: {
          description: "Unauthorized",
        },
      },
    },
  },

  "/carts/{cartId}": {
    delete: {
      summary: "Clear cart",
      tags: ["Cart"],
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: "cartId",
          in: "path",
          required: true,
          schema: {
            type: "number",
            example: 1,
          },
        },
      ],
      responses: {
        204: {
          description: "Cart cleared successfully",
        },
        400: {
          description: "Invalid cart id",
        },
        401: {
          description: "Unauthorized",
        },
        403: {
          description: "Forbidden",
        },
        404: {
          description: "Cart not found",
        },
      },
    },
  },

  "/carts/{cartId}/items": {
    get: {
      summary: "Get cart items",
      tags: ["Cart Items"],
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: "cartId",
          in: "path",
          required: true,
          schema: {
            type: "number",
            example: 1,
          },
        },
      ],
      responses: {
        200: {
          description: "Cart items returned successfully",
        },
        400: {
          description: "Invalid cart id",
        },
        401: {
          description: "Unauthorized",
        },
        403: {
          description: "Forbidden",
        },
        404: {
          description: "Cart not found",
        },
      },
    },
  },

  "/carts/items": {
    post: {
      summary: "Add item to cart",
      tags: ["Cart Items"],
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["cartId", "productId", "quantity"],
              properties: {
                cartId: {
                  type: "number",
                  example: 1,
                },
                productId: {
                  type: "number",
                  example: 1,
                },
                quantity: {
                  type: "number",
                  example: 2,
                },
              },
            },
          },
        },
      },
      responses: {
        201: {
          description: "Cart item created successfully",
        },
        400: {
          description: "Invalid request body or insufficient stock",
        },
        401: {
          description: "Unauthorized",
        },
        403: {
          description: "Forbidden",
        },
        404: {
          description: "Product not found",
        },
      },
    },
  },

  "/carts/items/{cartItemId}": {
    patch: {
      summary: "Update cart item quantity",
      tags: ["Cart Items"],
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: "cartItemId",
          in: "path",
          required: true,
          schema: {
            type: "number",
            example: 1,
          },
        },
      ],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["quantity"],
              properties: {
                quantity: {
                  type: "number",
                  example: 3,
                },
              },
            },
          },
        },
      },
      responses: {
        200: {
          description: "Cart item quantity updated successfully",
        },
        400: {
          description: "Invalid request body or insufficient stock",
        },
        401: {
          description: "Unauthorized",
        },
        403: {
          description: "Forbidden",
        },
        404: {
          description: "Cart item or product not found",
        },
      },
    },

    delete: {
      summary: "Delete cart item",
      tags: ["Cart Items"],
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: "cartItemId",
          in: "path",
          required: true,
          schema: {
            type: "number",
            example: 1,
          },
        },
      ],
      responses: {
        204: {
          description: "Cart item deleted successfully",
        },
        400: {
          description: "Invalid cart item id",
        },
        401: {
          description: "Unauthorized",
        },
        403: {
          description: "Forbidden",
        },
        404: {
          description: "Cart item not found",
        },
      },
    },
  },
};

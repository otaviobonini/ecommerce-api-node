export const productDocs = {
  "/product": {
    get: {
      summary: "List products",
      tags: ["Products"],
      parameters: [
        {
          name: "limit",
          in: "query",
          required: false,
          schema: {
            type: "number",
            example: 10,
          },
        },
        {
          name: "offset",
          in: "query",
          required: false,
          schema: {
            type: "number",
            example: 0,
          },
        },
      ],
      responses: {
        200: {
          description: "Products listed successfully",
        },
        400: {
          description: "Invalid query params",
        },
      },
    },

    post: {
      summary: "Create a new product",
      tags: ["Products"],
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["productName", "productPrice", "stock"],
              properties: {
                productName: {
                  type: "string",
                  example: "Mechanical Keyboard",
                },
                productPrice: {
                  type: "number",
                  example: 299.9,
                },
                stock: {
                  type: "number",
                  example: 50,
                },
              },
            },
          },
        },
      },
      responses: {
        201: {
          description: "Product created successfully",
        },
        400: {
          description: "Invalid request body",
        },
        401: {
          description: "Unauthorized",
        },
        403: {
          description: "Admin only",
        },
      },
    },
  },

  "/product/{productId}": {
    patch: {
      summary: "Edit a product",
      tags: ["Products"],
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: "productId",
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
              properties: {
                productName: {
                  type: "string",
                  example: "Updated Keyboard",
                },
                productPrice: {
                  type: "number",
                  example: 399.9,
                },
                stock: {
                  type: "number",
                  example: 25,
                },
              },
            },
          },
        },
      },
      responses: {
        200: {
          description: "Product updated successfully",
        },
        400: {
          description: "Invalid request",
        },
        401: {
          description: "Unauthorized",
        },
        403: {
          description: "Admin only",
        },
        404: {
          description: "Product not found",
        },
      },
    },

    delete: {
      summary: "Delete a product",
      tags: ["Products"],
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: "productId",
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
          description: "Product deleted successfully",
        },
        401: {
          description: "Unauthorized",
        },
        403: {
          description: "Admin only",
        },
        404: {
          description: "Product not found",
        },
      },
    },
  },
};

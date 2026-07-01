export const productDocs = {
  "/products": {
    get: {
      summary: "List products (with pagination)",
      tags: ["Products"],
      parameters: [
        {
          name: "limit",
          in: "query",
          required: false,
          schema: { type: "number", example: 10 },
        },
        {
          name: "offset",
          in: "query",
          required: false,
          schema: { type: "number", example: 0 },
        },
      ],
      responses: {
        200: { description: "Products listed successfully" },
        400: { description: "Invalid query params" },
      },
    },
  },

  "/product": {
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
                productName: { type: "string", example: "Mechanical Keyboard" },
                productPrice: { type: "number", example: 299.9 },
                stock: { type: "number", example: 50 },
              },
            },
          },
        },
      },
      responses: {
        201: { description: "Product created successfully" },
        400: { description: "Invalid request body" },
        401: { description: "Unauthorized" },
        403: { description: "Admin only" },
      },
    },
  },

  "/product/{productId}": {
    get: {
      summary: "Get product by ID",
      tags: ["Products"],
      parameters: [
        {
          name: "productId",
          in: "path",
          required: true,
          schema: { type: "number", example: 1 },
        },
      ],
      responses: {
        200: { description: "Product found successfully" },
        404: { description: "Product not found" },
      },
    },

    patch: {
      summary: "Edit a product",
      tags: ["Products"],
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: "productId",
          in: "path",
          required: true,
          schema: { type: "number", example: 1 },
        },
      ],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                productName: { type: "string", example: "Updated Keyboard" },
                productPrice: { type: "number", example: 399.9 },
                stock: { type: "number", example: 25 },
              },
            },
          },
        },
      },
      responses: {
        200: { description: "Product updated successfully" },
        400: { description: "Invalid request" },
        401: { description: "Unauthorized" },
        403: { description: "Admin only" },
        404: { description: "Product not found" },
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
          schema: { type: "number", example: 1 },
        },
      ],
      responses: {
        204: { description: "Product deleted successfully" },
        401: { description: "Unauthorized" },
        403: { description: "Admin only" },
        404: { description: "Product not found" },
      },
    },
  },

  "/product/{productId}/images": {
    post: {
      summary: "Upload a product image",
      tags: ["Products"],
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: "productId",
          in: "path",
          required: true,
          schema: { type: "number", example: 1 },
        },
      ],
      requestBody: {
        required: true,
        content: {
          "multipart/form-data": {
            schema: {
              type: "object",
              required: ["image"],
              properties: {
                image: { type: "string", format: "binary" },
              },
            },
          },
        },
      },
      responses: {
        201: { description: "Image uploaded successfully" },
        400: { description: "No file provided" },
        401: { description: "Unauthorized" },
        403: { description: "Admin only" },
        404: { description: "Product not found" },
      },
    },
  },

  "/product/{productId}/images/{imageId}": {
    delete: {
      summary: "Delete a product image",
      tags: ["Products"],
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: "productId",
          in: "path",
          required: true,
          schema: { type: "number", example: 1 },
        },
        {
          name: "imageId",
          in: "path",
          required: true,
          schema: { type: "number", example: 1 },
        },
      ],
      responses: {
        204: { description: "Image deleted successfully" },
        401: { description: "Unauthorized" },
        403: { description: "Admin only" },
        404: { description: "Product or image not found" },
      },
    },
  },

  "/product/{productId}/images/{imageId}/primary": {
    patch: {
      summary: "Set an image as the primary product image",
      tags: ["Products"],
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: "productId",
          in: "path",
          required: true,
          schema: { type: "number", example: 1 },
        },
        {
          name: "imageId",
          in: "path",
          required: true,
          schema: { type: "number", example: 1 },
        },
      ],
      responses: {
        204: { description: "Primary image set successfully" },
        401: { description: "Unauthorized" },
        403: { description: "Admin only" },
        404: { description: "Product or image not found" },
      },
    },
  },
};

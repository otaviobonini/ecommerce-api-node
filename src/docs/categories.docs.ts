export const categoriesDocs = {
  "/categories": {
    get: {
      summary: "List all categories",
      tags: ["Categories"],
      responses: {
        200: {
          description: "Categories listed successfully",
          content: {
            "application/json": {
              schema: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    categoryId: { type: "number", example: 1 },
                    name: { type: "string", example: "Electronics" },
                    categoryImage: {
                      type: "string",
                      nullable: true,
                      example:
                        "https://bucket.s3.amazonaws.com/categories/1/image",
                    },
                  },
                },
              },
            },
          },
        },
      },
    },

    post: {
      summary: "Create a new category",
      tags: ["Categories"],
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["name"],
              properties: {
                name: { type: "string", example: "Electronics" },
              },
            },
          },
        },
      },
      responses: {
        201: { description: "Category created successfully" },
        400: { description: "Invalid request body" },
        401: { description: "Unauthorized" },
        403: { description: "Admin only" },
        409: { description: "Category already exists" },
      },
    },
  },

  "/categories/featured/products": {
    get: {
      summary: "List featured products across all categories",
      tags: ["Categories"],
      parameters: [
        {
          name: "limit",
          in: "query",
          required: false,
          schema: { type: "number", example: 20 },
        },
        {
          name: "offset",
          in: "query",
          required: false,
          schema: { type: "number", example: 0 },
        },
      ],
      responses: {
        200: { description: "Featured products listed successfully" },
        400: { description: "Invalid query params" },
      },
    },
  },

  "/categories/{categoryId}/products": {
    get: {
      summary: "List products by category",
      tags: ["Categories"],
      parameters: [
        {
          name: "categoryId",
          in: "path",
          required: true,
          schema: { type: "number", example: 1 },
        },
        {
          name: "limit",
          in: "query",
          required: false,
          schema: { type: "number", example: 20 },
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
        400: { description: "Invalid params" },
        404: { description: "Category not found" },
      },
    },
  },

  "/categories/{categoryId}": {
    delete: {
      summary: "Delete a category",
      tags: ["Categories"],
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: "categoryId",
          in: "path",
          required: true,
          schema: { type: "number", example: 1 },
        },
      ],
      responses: {
        204: { description: "Category deleted successfully" },
        401: { description: "Unauthorized" },
        403: { description: "Admin only" },
        404: { description: "Category not found" },
      },
    },
  },

  "/categories/{categoryId}/image": {
    post: {
      summary: "Upload category image",
      tags: ["Categories"],
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: "categoryId",
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
                image: {
                  type: "string",
                  format: "binary",
                },
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
        404: { description: "Category not found" },
      },
    },
  },
};

export const addressDocs = {
  "/address": {
    post: {
      summary: "Create a new address",
      tags: ["Address"],
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["street", "city", "state", "zipCode"],
              properties: {
                street: {
                  type: "string",
                  example: "123 Main Street",
                  maxLength: 255,
                },
                city: {
                  type: "string",
                  example: "New York",
                  maxLength: 100,
                },
                state: {
                  type: "string",
                  example: "NY",
                  maxLength: 100,
                },
                zipCode: {
                  type: "string",
                  example: "10001",
                  maxLength: 20,
                },
                isDefault: {
                  type: "boolean",
                  example: false,
                },
              },
            },
          },
        },
      },
      responses: {
        201: {
          description: "Address created successfully",
        },
        400: {
          description: "Invalid request body",
        },
        401: {
          description: "Unauthorized",
        },
      },
    },

    get: {
      summary: "Get user addresses",
      tags: ["Address"],
      security: [{ bearerAuth: [] }],
      responses: {
        200: {
          description: "Addresses retrieved successfully",
        },
        401: {
          description: "Unauthorized",
        },
      },
    },
  },

  "/address/{addressId}": {
    put: {
      summary: "Update an address",
      tags: ["Address"],
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: "addressId",
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
                street: {
                  type: "string",
                  example: "Updated Street",
                  maxLength: 255,
                },
                city: {
                  type: "string",
                  example: "Los Angeles",
                  maxLength: 100,
                },
                state: {
                  type: "string",
                  example: "CA",
                  maxLength: 100,
                },
                zipCode: {
                  type: "string",
                  example: "90001",
                  maxLength: 20,
                },
                isDefault: {
                  type: "boolean",
                  example: true,
                },
              },
            },
          },
        },
      },
      responses: {
        200: {
          description: "Address updated successfully",
        },
        400: {
          description: "Invalid request body or address id",
        },
        401: {
          description: "Unauthorized",
        },
        403: {
          description: "Forbidden",
        },
        404: {
          description: "Address not found",
        },
      },
    },

    delete: {
      summary: "Delete an address",
      tags: ["Address"],
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: "addressId",
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
          description: "Address deleted successfully",
        },
        400: {
          description: "Invalid address id",
        },
        401: {
          description: "Unauthorized",
        },
        403: {
          description: "Forbidden",
        },
        404: {
          description: "Address not found",
        },
      },
    },
  },

  "/address/{addressId}/default": {
    put: {
      summary: "Set address as default",
      tags: ["Address"],
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: "addressId",
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
          description: "Default address updated successfully",
        },
        400: {
          description: "Invalid address id",
        },
        401: {
          description: "Unauthorized",
        },
        403: {
          description: "Forbidden",
        },
        404: {
          description: "Address not found",
        },
      },
    },
  },
};

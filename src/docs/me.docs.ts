export const meDocs = {
  "/me": {
    get: {
      summary: "Get the authenticated user's profile, addresses and orders",
      tags: ["Me"],
      security: [{ bearerAuth: [] }],
      responses: {
        200: {
          description: "Authenticated user details",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  userId: { type: "number", example: 1 },
                  email: { type: "string", example: "test@email.com" },
                  username: { type: "string", example: "testuser" },
                  role: {
                    type: "string",
                    enum: ["USER", "ADMIN"],
                    example: "USER",
                  },
                  address: {
                    type: "array",
                    items: { type: "object" },
                  },
                  order: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        orderId: { type: "number", example: 1 },
                        status: { type: "string", example: "PAID" },
                        total: { type: "string", example: "199.90" },
                        createdAt: { type: "string", format: "date-time" },
                      },
                    },
                  },
                },
              },
            },
          },
        },
        401: {
          description: "Missing or invalid token",
        },
      },
    },
  },
};

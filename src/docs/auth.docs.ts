export const authDocs = {
  "/register": {
    post: {
      summary: "Register a new user",
      tags: ["Auth"],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["email", "password", "username"],
              properties: {
                email: {
                  type: "string",
                  format: "email",
                  example: "test@email.com",
                },
                password: {
                  type: "string",
                  example: "password123",
                  minLength: 6,
                  maxLength: 120,
                },
                username: {
                  type: "string",
                  example: "testuser",
                  minLength: 2,
                  maxLength: 120,
                },
              },
            },
          },
        },
      },
      responses: {
        201: {
          description: "User created successfully",
        },
        400: {
          description: "Invalid request body",
        },
        409: {
          description: "User with this email already exists",
        },
      },
    },
  },

  "/login": {
    post: {
      summary: "Login and receive JWT + refresh token",
      tags: ["Auth"],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["email", "password"],
              properties: {
                email: {
                  type: "string",
                  format: "email",
                  example: "test@email.com",
                },
                password: {
                  type: "string",
                  example: "password123",
                },
              },
            },
          },
        },
      },
      responses: {
        200: {
          description:
            "Login successful — copy the token and click Authorize above",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  id: { type: "number", example: 1 },
                  email: { type: "string", example: "test@email.com" },
                  username: { type: "string", example: "testuser" },
                  token: {
                    type: "string",
                    example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
                  },
                  refreshToken: {
                    type: "string",
                    example: "550e8400-e29b-41d4-a716-446655440000",
                  },
                },
              },
            },
          },
        },
        400: {
          description: "Validation error",
        },
        401: {
          description: "Invalid credentials",
        },
      },
    },
  },

  "/refresh-token": {
    post: {
      summary: "Renew access token using a refresh token",
      tags: ["Auth"],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["refreshToken"],
              properties: {
                refreshToken: {
                  type: "string",
                  example: "550e8400-e29b-41d4-a716-446655440000",
                },
              },
            },
          },
        },
      },
      responses: {
        200: {
          description: "Tokens renewed successfully",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  token: {
                    type: "string",
                    example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
                  },
                  refreshToken: {
                    type: "string",
                    example: "550e8400-e29b-41d4-a716-446655440000",
                  },
                },
              },
            },
          },
        },
        400: {
          description: "Refresh token is required",
        },
        401: {
          description: "Invalid or expired refresh token",
        },
      },
    },
  },

  "/logout": {
    post: {
      summary: "Logout — invalidate a specific refresh token",
      tags: ["Auth"],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["refreshToken"],
              properties: {
                refreshToken: {
                  type: "string",
                  example: "550e8400-e29b-41d4-a716-446655440000",
                },
              },
            },
          },
        },
      },
      responses: {
        204: {
          description: "Logged out successfully",
        },
        400: {
          description: "Refresh token is required",
        },
      },
    },
  },

  "/logout-all": {
    post: {
      summary: "Logout from all devices — invalidate all refresh tokens",
      tags: ["Auth"],
      security: [{ bearerAuth: [] }],
      responses: {
        204: {
          description: "All sessions terminated successfully",
        },
        401: {
          description: "Unauthorized",
        },
      },
    },
  },
};

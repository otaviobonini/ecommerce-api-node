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
      summary: "Login and receive a JWT token",
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
                  token: {
                    type: "string",
                    example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
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
};

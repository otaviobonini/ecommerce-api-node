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
            "Login successful — copy the token and click Authorize above. The refresh token is NOT returned in the body: it is set as an httpOnly `refreshToken` cookie (Set-Cookie).",
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
      summary: "Renew access token using the refreshToken httpOnly cookie",
      description:
        "Reads the refresh token from the `refreshToken` httpOnly cookie (set on login), rotates it (old token is invalidated, a new cookie is issued) and returns a new access token. No request body is needed — the browser sends the cookie automatically when the request uses credentials: 'include'.",
      tags: ["Auth"],
      responses: {
        200: {
          description:
            "Access token renewed. A rotated refreshToken cookie is set via Set-Cookie.",
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
          description: "refreshToken cookie is missing",
        },
        401: {
          description: "Invalid or expired refresh token",
        },
      },
    },
  },

  "/logout": {
    post: {
      summary: "Logout — invalidate the session's refresh token",
      description:
        "Reads the refresh token from the `refreshToken` httpOnly cookie, invalidates it server-side and clears the cookie. No request body is needed.",
      tags: ["Auth"],
      responses: {
        204: {
          description: "Logged out successfully (cookie cleared)",
        },
        400: {
          description: "refreshToken cookie is missing",
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

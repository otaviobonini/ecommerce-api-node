export const orderDocs = {
  "/orders": {
    post: {
      summary: "Create a new order",
      tags: ["Orders"],
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["addressId"],
              properties: {
                addressId: {
                  type: "number",
                  example: 1,
                },
              },
            },
          },
        },
      },
      responses: {
        201: {
          description: "Order created successfully",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  orderId: {
                    type: "number",
                    example: 1,
                  },
                  paymentLink: {
                    type: "string",
                    example: "https://checkout.stripe.com/c/pay/cs_test_...",
                  },
                },
              },
            },
          },
        },
        400: {
          description: "Invalid request body or cart is empty",
        },
        401: {
          description: "Unauthorized",
        },
        403: {
          description: "Forbidden",
        },
        404: {
          description: "Address or cart not found",
        },
      },
    },

    get: {
      summary: "Get all orders",
      tags: ["Orders"],
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: "offset",
          in: "query",
          required: false,
          schema: {
            type: "number",
            example: 0,
          },
        },
        {
          name: "limit",
          in: "query",
          required: false,
          schema: {
            type: "number",
            example: 20,
            maximum: 100,
          },
        },
      ],
      responses: {
        200: {
          description: "Orders retrieved successfully",
        },
        400: {
          description: "Invalid query parameters",
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

  "/orders/me": {
    get: {
      summary: "Get authenticated user orders",
      tags: ["Orders"],
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: "status",
          in: "query",
          required: false,
          schema: {
            type: "string",
            enum: ["PENDING", "PAID", "ONGOING", "DELIVERED", "CANCELLED"],
            example: "PENDING",
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
        {
          name: "limit",
          in: "query",
          required: false,
          schema: {
            type: "number",
            example: 20,
            maximum: 100,
          },
        },
      ],
      responses: {
        200: {
          description: "User orders retrieved successfully",
        },
        400: {
          description: "Invalid query parameters",
        },
        401: {
          description: "Unauthorized",
        },
      },
    },
  },

  "/orders/{orderId}": {
    get: {
      summary: "Get order by id",
      tags: ["Orders"],
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: "orderId",
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
          description: "Order retrieved successfully",
        },
        400: {
          description: "Invalid order id",
        },
        401: {
          description: "Unauthorized",
        },
        403: {
          description: "Forbidden",
        },
        404: {
          description: "Order not found",
        },
      },
    },
  },

  "/orders/webhook": {
    post: {
      summary: "Handle Stripe webhook",
      tags: ["Orders"],
      parameters: [
        {
          name: "stripe-signature",
          in: "header",
          required: true,
          schema: {
            type: "string",
            example: "t=123456789,v1=signature...",
          },
        },
      ],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              description: "Raw Stripe webhook payload",
            },
          },
        },
      },
      responses: {
        200: {
          description: "Webhook received successfully",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  received: {
                    type: "boolean",
                    example: true,
                  },
                },
              },
            },
          },
        },
        400: {
          description: "Missing or invalid Stripe signature",
        },
      },
    },
  },

  "/orders/{orderId}/status": {
    put: {
      summary: "Update the status of an order (admin only)",
      tags: ["Orders"],
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: "orderId",
          in: "path",
          required: true,
          schema: { type: "integer", example: 1 },
        },
      ],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["status"],
              properties: {
                status: {
                  type: "string",
                  enum: [
                    "PENDING",
                    "PAID",
                    "ONGOING",
                    "DELIVERED",
                    "CANCELLED",
                  ],
                  example: "ONGOING",
                },
              },
            },
          },
        },
      },
      responses: {
        200: {
          description: "Order status updated",
        },
        401: {
          description: "Unauthorized",
        },
        403: {
          description: "Admin role required",
        },
        404: {
          description: "Order not found",
        },
      },
    },
  },
};

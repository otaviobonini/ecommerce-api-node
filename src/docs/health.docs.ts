export const healthDocs = {
  "/health": {
    get: {
      summary: "Liveness probe — checks Postgres and Redis connectivity",
      tags: ["Health"],
      responses: {
        200: {
          description: "All dependencies are reachable",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  status: { type: "string", example: "ok" },
                  database: { type: "string", example: "ok" },
                  redis: { type: "string", example: "ok" },
                },
              },
            },
          },
        },
        503: {
          description: "One or more dependencies are unreachable",
        },
      },
    },
  },
};

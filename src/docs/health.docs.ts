export const healthDocs = {
  "/live": {
    get: {
      summary: "Liveness probe — process is up (does not touch the database)",
      description:
        "Intentionally cheap: this is the endpoint the container healthcheck polls. " +
        "Querying the database here keeps serverless Postgres awake around the clock " +
        "and burns the monthly compute quota. Use /health for dependencies.",
      tags: ["Health"],
      responses: {
        200: {
          description: "Process is alive",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  status: { type: "string", example: "ok" },
                },
              },
            },
          },
        },
      },
    },
  },
  "/health": {
    get: {
      summary: "Readiness probe — checks Postgres and Redis connectivity",
      description:
        "Costs one query per call. Meant for deploy verification or external " +
        "monitoring on a wide interval, never a tight polling loop.",
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

import { Request, Response, NextFunction } from "express";
import { z, ZodError } from "zod";

type validateRequestOption = "body" | "query" | "params" | "headers";

export const validateRequest = (
  schema: z.ZodSchema,
  option: validateRequestOption,
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = schema.parse(req[option]);
      Object.defineProperty(req, option, {
        value: data,
        writable: true,
        configurable: true,
      });
      return next();
    } catch (err) {
      if (err instanceof ZodError) {
        return res.status(400).json({ error: err.issues[0]?.message });
      }
      return res.status(400).json({
        error: err instanceof Error ? err.message : "Invalid Message",
      });
    }
  };
};

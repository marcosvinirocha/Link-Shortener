import { Request, Response, NextFunction } from "express";
import { ZodSchema, ZodError, ZodIssue } from "zod";

export const validate = (schema: ZodSchema) => {
  return async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const validated = await schema.parseAsync(req.body);

      req.body = validated;

      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errors: { field: string; message: string }[] = error.issues.map(
          (issue: ZodIssue) => ({
            field: issue.path.join("."),
            message: issue.message,
          }),
        );

        res.status(400).json({
          error: "Validation failed",
          details: errors,
        });
        return;
      }

      res.status(500).json({ error: "Internal server error" });
    }
  };
};

export const validateQuery = (schema: ZodSchema) => {
  return async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const validated = await schema.parseAsync(req.query);

      req.body = validated;

      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errors: { field: string; message: string }[] = error.issues.map(
          (issue: ZodIssue) => ({
            field: issue.path.join("."),
            message: issue.message,
          }),
        );

        res.status(400).json({
          error: "Validation failed",
          details: errors,
        });
        return;
      }

      res.status(500).json({ error: "Internal server error" });
    }
  };
};

import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import Environment from "../config/env";

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
  };
}

export const authenticate = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.status(401).json({ error: "Authentication required" });
      return;
    }

    const token = authHeader.split(" ")[1];
    const secret = Environment.get("JWT_SECRET");

    const decoded = jwt.verify(token, secret) as { id: string; email: string };

    req.user = {
      id: decoded.id,
      email: decoded.email,
    };

    next();
  } catch {
    res.status(401).json({ error: "Invalid token" });
  }
};

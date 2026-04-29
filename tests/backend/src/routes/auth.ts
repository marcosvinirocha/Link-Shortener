import { Router, Response } from "express";
import { authenticate, AuthRequest } from "../middlewares/auth";
import { authLimiter } from "../middlewares/rateLimit";
import { validate } from "../middlewares/validate";
import { createUserSchema } from "../dto/user/create-user.dto";
import { loginSchema } from "../dto/user/login.dto";
import { userService } from "../services/user.service";
import { AppError } from "../errors/app-error";

const router = Router();

router.post(
  "/register",
  authLimiter,
  validate(createUserSchema),
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const result = await userService.register(req.body);
      res.status(201).json(result);
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json(error.toJSON());
        return;
      }
      throw error;
    }
  },
);

router.post(
  "/login",
  authLimiter,
  validate(loginSchema),
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const result = await userService.login(req.body);
      res.status(200).json(result);
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json(error.toJSON());
        return;
      }
      throw error;
    }
  },
);

router.get(
  "/profile",
  authenticate,
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json({ error: "Unauthorized" });
        return;
      }

      const user = await userService.getProfile(req.user.id);
      res.status(200).json({ user });
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json(error.toJSON());
        return;
      }
      throw error;
    }
  },
);

export default router;

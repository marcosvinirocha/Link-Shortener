import { Router, Response } from "express";
import { authenticate, AuthRequest } from "../middlewares/auth";
import { validate, validateQuery } from "../middlewares/validate";
import { createLinkSchema } from "../dto/link/create-link.dto";
import { paginationSchema } from "../dto/link/pagination.dto";
import { linkService } from "../services/link.service";
import { AppError } from "../errors/app-error";

const router = Router();

router.use(authenticate);

router.post(
  "/",
  validate(createLinkSchema),
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json({ error: "Unauthorized" });
        return;
      }

      const link = await linkService.createLink(req.user.id, req.body);
      res.status(201).json(link);
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json(error.toJSON());
        return;
      }
      if (error instanceof Error && error.message.includes("URL")) {
        res.status(400).json({ error: error.message });
        return;
      }
      throw error;
    }
  },
);

router.get(
  "/",
  validateQuery(paginationSchema),
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json({ error: "Unauthorized" });
        return;
      }

      const links = await linkService.listLinks(req.user.id, req.body);
      res.status(200).json(links);
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
  "/:shortCode/stats",
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json({ error: "Unauthorized" });
        return;
      }

      const stats = await linkService.getStatsByShortCode(
        req.user.id,
        req.params.shortCode as string,
      );
      res.status(200).json(stats);
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json(error.toJSON());
        return;
      }
      throw error;
    }
  },
);

router.delete(
  "/:id",
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json({ error: "Unauthorized" });
        return;
      }

      await linkService.deleteLink(req.user.id, req.params.id as string);
      res.status(204).send();
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

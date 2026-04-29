import { Router } from "express";
import authRoutes from "./auth";
import linksRoutes from "./links";

const router = Router();

router.use("/auth", authRoutes);
router.use("/links", linksRoutes);

router.get("/health", (req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    service: "link-shortener-backend",
  });
});

export default router;

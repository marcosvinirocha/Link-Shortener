import { Router, Request, Response } from "express";
import { redirectLimiter } from "../middlewares/rateLimit";
import { redirectService } from "../services/redirect.service";
import { LinkNotFoundError } from "../errors/link.errors";

const router = Router();

router.get(
  "/:code",
  redirectLimiter,
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { code } = req.params;
      const userAgent = req.headers["user-agent"];

      const forwardedFor = req.get("x-forwarded-for");
      let ip: string | string[] | undefined;
      if (forwardedFor) {
        ip = forwardedFor.split(",")[0].trim();
      } else {
        ip = req.socket.remoteAddress;
      }

      const normalizedIp = Array.isArray(ip) ? ip[0] : ip;

      const result = await redirectService.redirect(
        code,
        normalizedIp,
        typeof userAgent === "string" ? userAgent : undefined,
      );

      res.redirect(302, result.originalUrl);
    } catch (error) {
      if (error instanceof LinkNotFoundError) {
        res.status(404).json({ error: error.message });
        return;
      }

      console.error("Redirect error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },
);

export default router;

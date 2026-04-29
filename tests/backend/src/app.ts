import express from "express";
import cors from "cors";
import helmet from "helmet";
import routes from "./routes";
import redirectRoutes from "./routes/redirect";
import { createRateLimiter } from "./middlewares/rateLimit";

const app = express();

app.use(helmet());
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  }),
);

app.use(createRateLimiter());

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

app.use("/api", routes);

app.use("/", redirectRoutes);

app.use(
  (
    err: Error,
    req: express.Request,
    res: express.Response,
    _next: express.NextFunction,
  ) => {
    console.error("Unhandled error:", err);
    res.status(500).json({
      error: "Internal server error",
      ...(process.env.NODE_ENV === "development" && { details: err.message }),
    });
  },
);

app.use("*splat", (req, res) => {
  res.status(404).json({ error: "Route not found" });
});

export default app;

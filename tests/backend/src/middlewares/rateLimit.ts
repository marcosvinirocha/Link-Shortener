import rateLimit from "express-rate-limit";

export const createRateLimiter = (
  windowMs: number = 15 * 60 * 1000, // 15 minutes
  max: number = 100,
) => {
  return rateLimit({
    windowMs,
    max,
    message: { error: "Too many requests, please try again later" },
    standardHeaders: true,
    legacyHeaders: false,
  });
};

// Stricter rate limit for auth endpoints
export const authLimiter = createRateLimiter(15 * 60 * 1000, 10);

// Rate limit for public redirect endpoint
export const redirectLimiter = createRateLimiter(60 * 1000, 30);

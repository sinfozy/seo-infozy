import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

// Create redis connection
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

// Rate limiter: 5 requests per 60s
export const limiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(12, "60 s"),
  analytics: true,
});

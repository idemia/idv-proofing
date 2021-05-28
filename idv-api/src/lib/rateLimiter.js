import rateLimit from 'koa-ratelimit';

const LIMITER_REMEMBER_REQUEST_FOR = 15 * 60 * 1000; // 15 minutes.
const LIMITER_MAX_REQUESTS_PER_IP = 1000; // Limit each IP to X requests for duration (above).
const db = new Map();

const limiter = rateLimit({
  driver: 'memory',
  db,
  headers: {
    remaining: 'Rate-Limit-Remaining',
    reset: 'Rate-Limit-Reset',
    total: 'Rate-Limit-Total',
  },
  duration: LIMITER_REMEMBER_REQUEST_FOR,
  max: LIMITER_MAX_REQUESTS_PER_IP,
});

export default limiter;

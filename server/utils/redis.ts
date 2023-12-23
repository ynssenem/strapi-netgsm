import IORedis from "ioredis";

const env = process.env;

const Redis = () =>
  new IORedis({
    host: env.REDIS_HOST,
    port: env.REDIS_PORT ? parseInt(env.REDIS_PORT) : 6379,
    password: env.REDIS_PASSWORD,
    family: 4,
    db: 0,
  });

export default Redis;

import Redis from "./redis";
import crypto from "crypto";

const REDIS_KEY = `access_`;
const CLIENT = Redis();

const generate = (length: number = 6) => {
  const min = 10 ** (length - 1);
  const max = 10 ** length - 1;
  return (Math.floor(Math.random() * (max - min + 1)) + min).toString();
};

const hash = (algorithm: string) => {
  return crypto.createHash(algorithm).update(generate(15)).digest("hex");
};

const getKey = (key: string) => `${REDIS_KEY}${key}`;

const set = async (key: string, value: string, expire: number = 120) => {
  const getValue = await get(key);

  if (getValue) {
    await del(key);
  }

  return await CLIENT.set(getKey(key), value, "EX", expire);
};

const del = async (key: string) => {
  return await CLIENT.del(getKey(key));
};

const get = async (key: string) => {
  return await CLIENT.get(getKey(key));
};

const generateHash = async () => {
  const apiKey = hash("SHA1");
  const apiSecret = hash("SHA256");

  await set(apiKey, apiSecret, 600);

  return { apiKey, apiSecret };
};

export default { generateHash, get, del };

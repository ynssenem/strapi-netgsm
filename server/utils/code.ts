import Redis from "./redis";

const PREFIX = process.env.REDIS_PREFIX ?? "strapi-netgsm";
const REDIS_KEY = `${PREFIX}_`;
const CLIENT = Redis();

const generate = (length: number = 6) => {
  const min = 10 ** (length - 1);
  const max = 10 ** length - 1;
  return (Math.floor(Math.random() * (max - min + 1)) + min).toString();
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

export default { generate, set, del, get };

import { createClient } from "redis";

const user = process.env.REDIS_USER;
const password = process.env.REDIS_PASSWORD;
const credentials = user && password ? `${user}:${password}@` : "";

const databaseNumber = process.env.REDIS_DATABASE;
const database = databaseNumber ? `/${databaseNumber}` : "";

const redisUrl = `redis://${credentials}${process.env.REDIS_HOST}:${process.env.REDIS_PORT}${database}`;

const getRedisClient = createClient({
  url: redisUrl,
}).on("error", (err) => console.log("Redis Client Error", err)).connect;

export default getRedisClient;

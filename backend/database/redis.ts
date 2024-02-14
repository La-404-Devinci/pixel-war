import { createClient } from "redis";

const getRedisClient = createClient()
    .on("error", (err) => console.log("Redis Client Error", err))
    .connect();

export default getRedisClient;

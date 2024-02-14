import * as mysql from "mysql2/promise";

const access: mysql.PoolOptions = {
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    host: process.env.MYSQL_HOST,
    port: parseInt(process.env.MYSQL_PORT ?? "3306"),
    database: process.env.MYSQL_DATABASE,
    connectionLimit: 15,
};

export default mysql.createPool(access);

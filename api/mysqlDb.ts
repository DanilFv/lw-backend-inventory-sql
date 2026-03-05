import mysql, {Connection} from 'mysql2/promise';

let connection: Connection | null = null; // Изначально null

const mysqlDb = {
    async init() {
        try {
            connection = await mysql.createConnection({
                host: "localhost",
                port: 3306,
                user: "root",
                password: process.env.PASSWORD_MYSQL || "",
                database: 'inventory',
            });
            console.log("Database connection established");
        } catch (e) {
            console.error("Database connection failed:", e);
            throw e; // Пробрасываем ошибку выше в run().catch()
        }
    },
    getConnection() {
        if (!connection) {
            throw new Error("Connection not initialized. Call init() first.");
        }
        return connection;
    }
}

export default mysqlDb;

import oracledb from "oracledb";
import "dotenv/config";

// Oracle DB connection configuration
const dbConfig = {
    user: process.env.ORACLE_USER,
    password: process.env.ORACLE_PASSWORD,
    connectString: process.env.ORACLE_CONNECTION_STRING, // Example: "localhost:1521/XEPDB1"
};

// Create a connection pool (recommended for performance)
let connectionPool: oracledb.Pool;

export async function getOracleConnection() {
    try {
        // Create the pool if it doesn't exist
        if (!connectionPool) {
            connectionPool = await oracledb.createPool(dbConfig);
        }
        // Get a connection from the pool
        return await connectionPool.getConnection();
    } catch (error) {
        console.error("Oracle DB connection error:", error);
        throw error;
    }
}

// Close the pool when shutting down the server
export async function closeOraclePool() {
    try {
        if (connectionPool) {
            await connectionPool.close();
        }
    } catch (error) {
        console.error("Error closing Oracle pool:", error);
    }
}
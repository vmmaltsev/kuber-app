const fs = require("fs");
const { Pool } = require("pg");

let databaseUrl;

if (process.env.DATABASE_URL) {
    databaseUrl = process.env.DATABASE_URL;
} else if (process.env.DATABASE_URL_FILE) {
    try {
        databaseUrl = fs.readFileSync(process.env.DATABASE_URL_FILE, "utf8").trim();
    } catch (err) {
        console.error("❌ Failed to read DATABASE_URL_FILE:", err.message);
        process.exit(1);
    }
} else {
    console.error("❌ DATABASE_URL or DATABASE_URL_FILE must be set");
    process.exit(1);
}

const pool = new Pool({
    connectionString: databaseUrl,
});

// Log any connection-level errors
pool.on("error", (err) => {
    console.error("❌ Unexpected error on idle client", err);
    process.exit(1);
});

// Get current timestamp and count requests from 'node'
const getDateTimeAndRequests = async () => {
    const client = await pool.connect();
    try {
        const result = await client.query(`
      SELECT 
        NOW() AS current_time, 
        COUNT(*) AS request_count
      FROM public.request 
      WHERE api_name = 'node';
    `);

        return {
            currentTime: result.rows[0].current_time,
            requestCount: parseInt(result.rows[0].request_count, 10),
        };
    } catch (err) {
        console.error("❌ Query error in getDateTimeAndRequests:", err.stack);
        throw err;
    } finally {
        client.release();
    }
};

// Insert one row with api_name='node'
const insertRequest = async () => {
    const client = await pool.connect();
    try {
        await client.query("INSERT INTO request (api_name) VALUES ('node');");
    } catch (err) {
        console.error("❌ Query error in insertRequest:", err.stack);
        throw err;
    } finally {
        client.release();
    }
};

module.exports = {
    getDateTimeAndRequests,
    insertRequest,
};

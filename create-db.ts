import { Client } from "pg";
import * as dotenv from "dotenv";

dotenv.config();

async function createDatabase() {
  // First connect to the default postgres database
  const defaultClient = new Client({
    connectionString: process.env.DATABASE_URL?.replace(/\/[^/]+$/, "/postgres") || "postgresql://postgres:postgres@localhost:5432/postgres"
  });

  try {
    await defaultClient.connect();
    await defaultClient.query(`CREATE DATABASE ${process.env.DB_NAME || "copadelacueva"}`);
    console.log("Database created successfully");
  } catch (error: any) {
    if (error.code === "42P04") {
      console.log("Database already exists");
    } else {
      console.error("Error creating database:", error);
      process.exit(1);
    }
  } finally {
    await defaultClient.end();
  }
}

createDatabase().catch(console.error);

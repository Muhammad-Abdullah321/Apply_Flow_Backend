import dotenv from "dotenv";

dotenv.config();

export const env = {
    port: Number(process.env.PORT) || 8200,
    databaseUrl: process.env.DATABASE_URL || "",
};

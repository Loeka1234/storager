export const __prod__ = process.env.NODE_ENV === "production";

export const PORT = process.env.PORT || 3001;
export const API_Key = process.env.API_KEY || "dev";
export const CORS = process.env.CORS || "http://localhost:3000";
export const COOKIE_SECRET = process.env.COOKIE_SECRET || "dev";
export const COOKIE_NAME = "sto";

export const PG_UNIQUE_VIOLATION = 23505;

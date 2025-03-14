import { neon } from "@neondatabase/serverless";
export const neon_sql = neon(process.env.DATABASE_URL);

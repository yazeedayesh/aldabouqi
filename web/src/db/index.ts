import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

// Lazy init: reading DATABASE_URL at module load time would crash `next
// build` before Neon is provisioned / before the env var is available at
// build time. A plain lazily-assigned module-level binding is used instead
// of a Proxy wrapper, since Proxy wrappers around the db client break
// libraries (e.g. Auth.js adapters) that inspect the object directly.
let _db: ReturnType<typeof drizzle<typeof schema>> | undefined;

export function getDb() {
  if (!_db) {
    const sql = neon(process.env.DATABASE_URL!);
    _db = drizzle(sql, { schema });
  }
  return _db;
}

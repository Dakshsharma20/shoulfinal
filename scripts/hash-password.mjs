/**
 * Generates a bcrypt hash for your chosen admin password, to paste into
 * ADMIN_PASSWORD_HASH in .env.local.
 *
 * Usage (after `npm install`):
 *   node scripts/hash-password.mjs "your-chosen-password"
 */
import bcrypt from "bcryptjs";

const password = process.argv[2];

if (!password) {
  console.error("Usage: node scripts/hash-password.mjs \"your-chosen-password\"");
  process.exit(1);
}

const hash = bcrypt.hashSync(password, 10);
console.log("\nAdd this to .env.local:\n");
console.log(`ADMIN_PASSWORD_HASH=${hash}\n`);

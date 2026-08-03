/**
 * Seeds MongoDB with the site's existing product/category catalog so the
 * app isn't empty on first run.
 *
 * Usage (after `npm install` and setting up .env.local):
 *   node scripts/seed.mjs
 *
 * Safe to re-run: it skips creating anything that already exists (by
 * slug), so it won't create duplicates if you run it more than once.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import mongoose from "mongoose";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

// ---- Minimal .env.local loader (no extra dependency needed) ----
function loadEnvLocal() {
  const envPath = path.join(ROOT, ".env.local");
  if (!fs.existsSync(envPath)) return;
  const lines = fs.readFileSync(envPath, "utf-8").split("\n");
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    const value = trimmed.slice(eq + 1).trim();
    if (!(key in process.env)) process.env[key] = value;
  }
}
loadEnvLocal();

function slugify(input) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

async function main() {
  const MONGODB_URI = process.env.MONGODB_URI;
  if (!MONGODB_URI || MONGODB_URI.includes("REPLACE_ME")) {
    console.error(
      "\u274c MONGODB_URI is not set (or still has placeholder values) in .env.local.\n" +
        "   Set it to your real MongoDB Atlas connection string first."
    );
    process.exit(1);
  }

  console.log("Connecting to MongoDB...");
  await mongoose.connect(MONGODB_URI);
  const db = mongoose.connection.db;

  // ---- Categories ----
  const categoriesPath = path.join(ROOT, "data", "categories.json");
  const rawCategories = JSON.parse(fs.readFileSync(categoriesPath, "utf-8"));

  console.log(`\nSeeding ${rawCategories.length} categories...`);
  const categoryIdByName = {};

  for (let i = 0; i < rawCategories.length; i++) {
    const cat = rawCategories[i];
    const slug = slugify(cat.name);
    const existing = await db.collection("categories").findOne({ slug });
    if (existing) {
      console.log(`  \u2013 "${cat.name}" already exists, skipping`);
      categoryIdByName[cat.name] = existing._id;
      continue;
    }
    const doc = {
      name: cat.name,
      slug,
      description: cat.description ?? "",
      displayOrder: i,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const result = await db.collection("categories").insertOne(doc);
    categoryIdByName[cat.name] = result.insertedId;
    console.log(`  \u2713 Created "${cat.name}"`);
  }

  // ---- Products ----
  const productsPath = path.join(ROOT, "data", "products.json");
  const rawProducts = JSON.parse(fs.readFileSync(productsPath, "utf-8"));

  console.log(`\nSeeding ${rawProducts.length} products...`);
  let created = 0;
  let skipped = 0;

  for (let i = 0; i < rawProducts.length; i++) {
    const p = rawProducts[i];
    const existing = await db.collection("products").findOne({ slug: p.slug });
    if (existing) {
      skipped++;
      continue;
    }

    const categoryId = categoryIdByName[p.category];
    if (!categoryId) {
      console.warn(`  \u26a0 Skipping "${p.name}" \u2014 unknown category "${p.category}"`);
      continue;
    }

    const doc = {
      title: p.name,
      slug: p.slug,
      description: p.description,
      shortDescription: p.description.slice(0, 200),
      category: categoryId,
      price: p.price,
      // NOTE: these are local static file paths, not real Cloudinary
      // assets (publicId is a placeholder). That's fine for display —
      // the only thing that won't work is deleting them via the admin
      // image uploader's "delete from Cloudinary" call, which will just
      // silently no-op since the publicId doesn't exist on Cloudinary.
      // Re-upload a real image through the admin panel whenever you're
      // ready to replace a seeded placeholder.
      images: [{ url: p.image, publicId: `seed-placeholder-${p.slug}`, order: 0 }],
      featured: !!p.featured,
      bestseller: !!p.bestseller,
      newArrival: !!p.newArrival,
      inStock: true,
      isVisible: true,
      material: p.material,
      color: p.color ?? "",
      careInstructions: p.care,
      displayOrder: i,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    await db.collection("products").insertOne(doc);
    created++;
  }
  console.log(`  \u2713 Created ${created} products (${skipped} already existed, skipped)`);

  // ---- Settings (singleton) ----
  console.log("\nChecking Settings...");
  const existingSettings = await db.collection("settings").findOne({});
  if (existingSettings) {
    console.log("  \u2013 Settings document already exists, skipping");
  } else {
    await db.collection("settings").insertOne({
      storeName: "Soul Hues",
      whatsappNumber: "919144801221",
      whatsappMessage:
        "Hi Soul Hues!\nI'm interested in this jewellery piece.\nPlease share more details.",
      instagramUrl: "https://www.instagram.com/soulhues.official/",
      instagramHandle: "@soulhues.official",
      email: "",
      footerTagline:
        "Handcrafted jewellery made piece by piece in small batches, designed to be worn close and passed down.",
      footerLocation: "India",
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    console.log("  \u2713 Created default Settings document");
  }

  console.log("\n\u2705 Seed complete.");
  await mongoose.disconnect();
}

main().catch((err) => {
  console.error("\n\u274c Seed failed:", err);
  process.exit(1);
});

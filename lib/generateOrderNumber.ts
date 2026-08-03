import { connectDB } from "@/lib/db/connect";
import Order from "@/models/Order";

/**
 * Generates an order number like "SH-20260729-0001" — brand prefix, date,
 * and a daily sequence number. Human-readable (good for the customer
 * Track Order page and WhatsApp/email messages) while still sorting
 * chronologically. Retries on the rare collision from concurrent orders.
 */
export async function generateOrderNumber(): Promise<string> {
  await connectDB();

  const now = new Date();
  const datePart = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}${String(
    now.getDate()
  ).padStart(2, "0")}`;

  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const countToday = await Order.countDocuments({ createdAt: { $gte: startOfDay } });

  let sequence = countToday + 1;
  for (let attempt = 0; attempt < 5; attempt++) {
    const candidate = `SH-${datePart}-${String(sequence).padStart(4, "0")}`;
    const exists = await Order.findOne({ orderNumber: candidate }).select("_id").lean();
    if (!exists) return candidate;
    sequence += 1;
  }

  // Extremely unlikely fallback: timestamp-based suffix guarantees uniqueness.
  return `SH-${datePart}-${Date.now().toString().slice(-6)}`;
}

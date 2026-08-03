import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db/connect";
import Order from "@/models/Order";
import { requireAdmin } from "@/lib/auth/requireAdmin";
import { updateTrackingSchema } from "@/lib/validations/checkout";

type RouteParams = { params: Promise<{ id: string }> };

export async function PATCH(req: NextRequest, { params }: RouteParams) {
  const { response } = await requireAdmin();
  if (response) return response;

  const { id } = await params;

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ success: false, error: "Invalid JSON body." }, { status: 400 });
  }

  const parsed = updateTrackingSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { success: false, error: parsed.error.issues[0]?.message ?? "Invalid tracking data." },
      { status: 400 }
    );
  }

  try {
    await connectDB();
    const order = await Order.findByIdAndUpdate(
      id,
      {
        courierName: parsed.data.courierName || undefined,
        trackingNumber: parsed.data.trackingNumber || undefined,
        trackingUrl: parsed.data.trackingUrl || undefined,
      },
      { new: true, runValidators: true }
    );
    if (!order) {
      return NextResponse.json({ success: false, error: "Order not found." }, { status: 404 });
    }
    return NextResponse.json({ success: true, order });
  } catch (err) {
    console.error(`PATCH /api/admin/orders/${id}/tracking failed:`, err);
    return NextResponse.json({ success: false, error: "Failed to update tracking info." }, { status: 500 });
  }
}

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import OrderDetailView from "@/components/admin/OrderDetailView";

export default async function AdminOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div>
      <Link
        href="/admin/orders"
        className="inline-flex items-center gap-1.5 font-sans text-sm text-ink-light hover:text-ink"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        Back to Orders
      </Link>
      <div className="mt-4">
        <OrderDetailView orderId={id} />
      </div>
    </div>
  );
}

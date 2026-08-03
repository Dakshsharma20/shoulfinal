"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { Search, Loader2, ChevronLeft, ChevronRight, ShoppingBag } from "lucide-react";
import { cn, formatPrice } from "@/lib/utils";
import { ORDER_STATUS_LABELS, PAYMENT_STATUS_LABELS, ALL_ORDER_STATUSES, PAYMENT_STATUSES } from "@/lib/order-status";

interface AdminOrderRow {
  _id: string;
  orderNumber: string;
  shippingAddress: { fullName: string; phone: string };
  totalAmount: number;
  paymentStatus: string;
  orderStatus: string;
  createdAt: string;
}

const statusColors: Record<string, string> = {
  pending: "bg-cream-alt text-ink-light",
  confirmed: "bg-sage/10 text-sage-dark",
  processing: "bg-sage/10 text-sage-dark",
  packed: "bg-sage/10 text-sage-dark",
  shipped: "bg-ink/8 text-ink",
  out_for_delivery: "bg-ink/8 text-ink",
  delivered: "bg-sage-dark text-cream",
  cancelled: "bg-red-50 text-red-600",
  refunded: "bg-red-50 text-red-600",
};

const paymentColors: Record<string, string> = {
  pending: "bg-cream-alt text-ink-light",
  paid: "bg-sage-dark text-cream",
  failed: "bg-red-50 text-red-600",
  refunded: "bg-red-50 text-red-600",
};

export default function OrdersTable() {
  const [orders, setOrders] = useState<AdminOrderRow[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [orderStatus, setOrderStatus] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("");
  const [sort, setSort] = useState("newest");
  const [page, setPage] = useState(1);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (query) params.set("q", query);
      if (orderStatus) params.set("orderStatus", orderStatus);
      if (paymentStatus) params.set("paymentStatus", paymentStatus);
      params.set("sort", sort);
      params.set("page", String(page));
      params.set("limit", "20");
      const res = await fetch(`/api/admin/orders?${params.toString()}`);
      const json = await res.json();
      if (json.success) {
        setOrders(json.orders);
        setTotal(json.total);
        setTotalPages(json.totalPages);
      }
    } finally {
      setLoading(false);
    }
  }, [query, orderStatus, paymentStatus, sort, page]);

  useEffect(() => {
    setPage(1);
  }, [query, orderStatus, paymentStatus, sort]);

  useEffect(() => {
    const t = setTimeout(load, 300);
    return () => clearTimeout(t);
  }, [load]);

  const selectClass =
    "rounded-full border border-line bg-white px-4 py-2.5 font-sans text-sm text-ink outline-none focus:border-sage-dark";

  return (
    <div>
      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
        <div className="relative w-full max-w-xs">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-light" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search order #, name, phone, email..."
            className="w-full rounded-full border border-line bg-white py-2.5 pl-10 pr-4 text-sm text-ink outline-none focus:border-sage-dark"
          />
        </div>
        <select value={orderStatus} onChange={(e) => setOrderStatus(e.target.value)} className={selectClass}>
          <option value="">All Statuses</option>
          {ALL_ORDER_STATUSES.map((s) => (
            <option key={s} value={s}>{ORDER_STATUS_LABELS[s]}</option>
          ))}
        </select>
        <select value={paymentStatus} onChange={(e) => setPaymentStatus(e.target.value)} className={selectClass}>
          <option value="">All Payments</option>
          {PAYMENT_STATUSES.map((s) => (
            <option key={s} value={s}>{PAYMENT_STATUS_LABELS[s]}</option>
          ))}
        </select>
        <select value={sort} onChange={(e) => setSort(e.target.value)} className={selectClass}>
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="amount_high">Amount: High to Low</option>
          <option value="amount_low">Amount: Low to High</option>
        </select>
      </div>

      <div className="mt-6 overflow-hidden rounded-[22px] bg-white shadow-soft">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-6 w-6 animate-spin text-sage-dark" aria-hidden="true" />
          </div>
        ) : orders.length === 0 ? (
          <div className="flex flex-col items-center gap-2 py-16 text-center">
            <ShoppingBag className="h-6 w-6 text-ink-light" aria-hidden="true" />
            <p className="font-sans text-sm text-ink-light">No orders found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left">
              <thead>
                <tr className="border-b border-line text-xs uppercase tracking-wide text-ink-light">
                  <th className="px-5 py-3 font-medium">Order ID</th>
                  <th className="px-5 py-3 font-medium">Customer</th>
                  <th className="px-5 py-3 font-medium">Phone</th>
                  <th className="px-5 py-3 font-medium">Amount</th>
                  <th className="px-5 py-3 font-medium">Payment</th>
                  <th className="px-5 py-3 font-medium">Order Status</th>
                  <th className="px-5 py-3 font-medium">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {orders.map((order) => (
                  <tr key={order._id} className="cursor-pointer hover:bg-cream-alt/50">
                    <td className="px-5 py-3">
                      <Link href={`/admin/orders/${order._id}`} className="font-sans text-sm font-medium text-ink hover:text-sage-dark">
                        {order.orderNumber}
                      </Link>
                    </td>
                    <td className="px-5 py-3 font-sans text-sm text-ink">{order.shippingAddress.fullName}</td>
                    <td className="px-5 py-3 font-sans text-sm text-ink-light">{order.shippingAddress.phone}</td>
                    <td className="px-5 py-3 font-sans text-sm text-ink">{formatPrice(order.totalAmount)}</td>
                    <td className="px-5 py-3">
                      <span className={cn("rounded-full px-2.5 py-1 text-xs font-medium", paymentColors[order.paymentStatus])}>
                        {PAYMENT_STATUS_LABELS[order.paymentStatus as keyof typeof PAYMENT_STATUS_LABELS] ?? order.paymentStatus}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <span className={cn("rounded-full px-2.5 py-1 text-xs font-medium", statusColors[order.orderStatus])}>
                        {ORDER_STATUS_LABELS[order.orderStatus as keyof typeof ORDER_STATUS_LABELS] ?? order.orderStatus}
                      </span>
                    </td>
                    <td className="px-5 py-3 font-sans text-xs text-ink-light">
                      {new Date(order.createdAt).toLocaleDateString("en-IN", { dateStyle: "medium" })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {!loading && totalPages > 1 && (
        <nav aria-label="Orders pagination" className="mt-6 flex items-center justify-between">
          <p className="font-sans text-xs text-ink-light">{total} order{total === 1 ? "" : "s"} total</p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              aria-label="Previous page"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-line text-ink-light hover:border-sage-dark hover:text-ink disabled:opacity-40"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="font-sans text-sm text-ink">{page} / {totalPages}</span>
            <button
              type="button"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              aria-label="Next page"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-line text-ink-light hover:border-sage-dark hover:text-ink disabled:opacity-40"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </nav>
      )}
    </div>
  );
}

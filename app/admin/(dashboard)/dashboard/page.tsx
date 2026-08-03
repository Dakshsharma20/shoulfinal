import Link from "next/link";
import Image from "next/image";
import {
  Package,
  Star,
  Crown,
  Sparkles,
  ArrowRight,
  ShoppingBag,
  Clock,
  IndianRupee,
  CalendarDays,
} from "lucide-react";
import { connectDB } from "@/lib/db/connect";
import Product from "@/models/Product";
import "@/models/Category";
import StatCard from "@/components/admin/StatCard";
import { formatPrice, cn } from "@/lib/utils";
import { getAdminDashboardOrderStats } from "@/lib/data/orders";
import { ORDER_STATUS_LABELS, PAYMENT_STATUS_LABELS, type OrderStatus, type PaymentStatus } from "@/lib/order-status";

async function getProductStats() {
  await connectDB();
  const [total, featured, bestsellers, newArrivals, recent] = await Promise.all([
    Product.countDocuments({}),
    Product.countDocuments({ featured: true }),
    Product.countDocuments({ bestseller: true }),
    Product.countDocuments({ newArrival: true }),
    Product.find({}).sort({ createdAt: -1 }).limit(5).populate("category", "name").lean(),
  ]);
  return { total, featured, bestsellers, newArrivals, recent };
}

export default async function AdminDashboardPage() {
  const [productStats, orderStats] = await Promise.all([
    getProductStats(),
    getAdminDashboardOrderStats(),
  ]);

  return (
    <div>
      <div className="flex flex-col gap-1">
        <h1 className="font-serif text-3xl tracking-tight text-ink">Dashboard</h1>
        <p className="font-sans text-sm text-ink-light">
          A quick look at orders and your catalog.
        </p>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Today's Orders" value={orderStats.todayOrders} icon={CalendarDays} />
        <StatCard label="Pending Orders" value={orderStats.pendingOrders} icon={Clock} />
        <StatCard label="Revenue" value={formatPrice(orderStats.totalRevenue)} icon={IndianRupee} accent="ink" />
        <StatCard label="This Month's Revenue" value={formatPrice(orderStats.monthlyRevenue)} icon={IndianRupee} accent="ink" />
      </div>

      <div className="mt-10 rounded-[22px] bg-white p-6 shadow-soft md:p-8">
        <div className="flex items-center justify-between">
          <h2 className="font-serif text-xl tracking-tight text-ink">Recent Orders</h2>
          <Link
            href="/admin/orders"
            className="inline-flex items-center gap-1 font-sans text-sm font-medium text-sage-dark hover:underline"
          >
            View all <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
          </Link>
        </div>

        {orderStats.recentOrders.length === 0 ? (
          <p className="mt-6 font-sans text-sm text-ink-light">
            No orders yet — they&rsquo;ll show up here as soon as a customer checks out.
          </p>
        ) : (
          <div className="mt-6 divide-y divide-line">
            {orderStats.recentOrders.map((order) => (
              <Link
                key={order._id}
                href={`/admin/orders/${order._id}`}
                className="flex items-center gap-4 py-3.5 transition-colors hover:bg-cream-alt/50"
              >
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-sage/10 text-sage-dark">
                  <ShoppingBag className="h-4 w-4" aria-hidden="true" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-sans text-sm font-medium text-ink">
                    {order.orderNumber} &middot; {order.shippingAddress.fullName}
                  </p>
                  <p className="text-xs text-ink-light">
                    {formatPrice(order.totalAmount)} &middot;{" "}
                    {new Date(order.createdAt).toLocaleDateString("en-IN", { dateStyle: "medium" })}
                  </p>
                </div>
                <span
                  className={cn(
                    "flex-shrink-0 rounded-full px-2.5 py-1 text-[11px] font-medium",
                    order.paymentStatus === "paid" ? "bg-sage-dark text-cream" : "bg-cream-alt text-ink-light"
                  )}
                >
                  {PAYMENT_STATUS_LABELS[order.paymentStatus as PaymentStatus] ?? order.paymentStatus}
                </span>
                <span className="flex-shrink-0 rounded-full bg-ink/8 px-2.5 py-1 text-[11px] font-medium text-ink">
                  {ORDER_STATUS_LABELS[order.orderStatus as OrderStatus] ?? order.orderStatus}
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>

      <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Products" value={productStats.total} icon={Package} />
        <StatCard label="Featured Products" value={productStats.featured} icon={Star} />
        <StatCard label="Best Sellers" value={productStats.bestsellers} icon={Crown} />
        <StatCard label="New Arrivals" value={productStats.newArrivals} icon={Sparkles} />
      </div>

      <div className="mt-10 rounded-[22px] bg-white p-6 shadow-soft md:p-8">
        <div className="flex items-center justify-between">
          <h2 className="font-serif text-xl tracking-tight text-ink">Recent Products</h2>
          <Link
            href="/admin/products"
            className="inline-flex items-center gap-1 font-sans text-sm font-medium text-sage-dark hover:underline"
          >
            View all <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
          </Link>
        </div>

        {productStats.recent.length === 0 ? (
          <p className="mt-6 font-sans text-sm text-ink-light">
            No products yet.{" "}
            <Link href="/admin/products/new" className="font-medium text-sage-dark hover:underline">
              Create your first product
            </Link>
            .
          </p>
        ) : (
          <div className="mt-6 divide-y divide-line">
            {productStats.recent.map((p) => {
              const product = p as unknown as {
                _id: string;
                title: string;
                price: number;
                images: { url: string }[];
                category?: { name: string };
                isVisible: boolean;
              };
              return (
                <Link
                  key={product._id}
                  href={`/admin/products/${product._id}/edit`}
                  className="flex items-center gap-4 py-3.5 transition-colors hover:bg-cream-alt/50"
                >
                  <div className="relative h-14 w-14 flex-shrink-0 overflow-hidden rounded-xl bg-cream-alt">
                    {product.images?.[0] && (
                      <Image
                        src={product.images[0].url}
                        alt=""
                        fill
                        sizes="56px"
                        className="object-cover"
                      />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-sans text-sm font-medium text-ink">
                      {product.title}
                    </p>
                    <p className="text-xs text-ink-light">
                      {product.category?.name ?? "Uncategorised"} &middot; {formatPrice(product.price)}
                    </p>
                  </div>
                  {!product.isVisible && (
                    <span className="flex-shrink-0 rounded-full bg-ink/8 px-2.5 py-1 text-[11px] font-medium text-ink-light">
                      Hidden
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

import OrdersTable from "@/components/admin/OrdersTable";

export default function AdminOrdersPage() {
  return (
    <div>
      <h1 className="font-serif text-3xl tracking-tight text-ink">Orders</h1>
      <p className="mt-1 font-sans text-sm text-ink-light">
        Every order placed through the storefront.
      </p>
      <div className="mt-8">
        <OrdersTable />
      </div>
    </div>
  );
}

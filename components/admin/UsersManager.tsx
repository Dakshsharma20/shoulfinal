"use client";

import { useCallback, useEffect, useState, type FormEvent } from "react";
import { Search, Users, ShoppingBag, IndianRupee, ChevronLeft, ChevronRight } from "lucide-react";
import { formatPrice } from "@/lib/utils";

type Customer = {
  key: string;
  name: string;
  email: string;
  phone: string;
  orders: number;
  totalSpent: number;
  lastOrderAt: string;
};

export default function UsersManager() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [query, setQuery] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const loadCustomers = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page), limit: "20" });
      if (search) params.set("q", search);
      const res = await fetch(`/api/admin/users?${params.toString()}`, { cache: "no-store" });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || "Failed to load customers");
      setCustomers(data.customers);
      setTotal(data.total);
      setTotalPages(data.totalPages);
    } catch {
      setCustomers([]);
      setTotal(0);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => {
    void loadCustomers();
  }, [loadCustomers]);

  function submitSearch(e: FormEvent) {
    e.preventDefault();
    setPage(1);
    setSearch(query.trim());
  }

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-[20px] bg-white p-5 shadow-soft">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sage/10 text-sage-dark">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-ink-light">Customers</p>
              <p className="font-serif text-2xl text-ink">{total}</p>
            </div>
          </div>
        </div>
        <div className="rounded-[20px] bg-white p-5 shadow-soft">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cream-alt text-ink">
              <ShoppingBag className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-ink-light">Showing orders</p>
              <p className="font-serif text-2xl text-ink">{customers.reduce((sum, c) => sum + c.orders, 0)}</p>
            </div>
          </div>
        </div>
        <div className="rounded-[20px] bg-white p-5 shadow-soft">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sage/10 text-sage-dark">
              <IndianRupee className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-ink-light">Showing revenue</p>
              <p className="font-serif text-2xl text-ink">{formatPrice(customers.reduce((sum, c) => sum + c.totalSpent, 0))}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-[22px] bg-white p-5 shadow-soft md:p-6">
        <form onSubmit={submitSearch} className="flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-light" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name, email or phone..."
              className="w-full rounded-xl border border-line bg-cream-alt/30 py-2.5 pl-10 pr-4 text-sm text-ink outline-none transition focus:border-sage-dark"
            />
          </div>
          <button
            type="submit"
            className="rounded-xl bg-sage-dark px-5 py-2.5 text-sm font-medium text-cream transition hover:opacity-90"
          >
            Search
          </button>
        </form>

        <div className="mt-5 overflow-x-auto">
          <table className="w-full min-w-[760px] border-collapse text-left">
            <thead>
              <tr className="border-b border-line text-xs text-ink-light">
                <th className="px-3 py-3 font-medium">Customer</th>
                <th className="px-3 py-3 font-medium">Phone</th>
                <th className="px-3 py-3 font-medium">Orders</th>
                <th className="px-3 py-3 font-medium">Total Spent</th>
                <th className="px-3 py-3 font-medium">Last Order</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {loading ? (
                <tr><td colSpan={5} className="px-3 py-12 text-center text-sm text-ink-light">Loading customers...</td></tr>
              ) : customers.length === 0 ? (
                <tr><td colSpan={5} className="px-3 py-12 text-center text-sm text-ink-light">No customers found.</td></tr>
              ) : (
                customers.map((customer) => (
                  <tr key={customer.key} className="transition-colors hover:bg-cream-alt/40">
                    <td className="px-3 py-4">
                      <div className="font-medium text-ink">{customer.name}</div>
                      <div className="mt-0.5 text-xs text-ink-light">{customer.email}</div>
                    </td>
                    <td className="px-3 py-4 text-sm text-ink/80">{customer.phone}</td>
                    <td className="px-3 py-4 text-sm font-medium text-ink">{customer.orders}</td>
                    <td className="px-3 py-4 text-sm font-medium text-ink">{formatPrice(customer.totalSpent)}</td>
                    <td className="px-3 py-4 text-sm text-ink/80">
                      {new Date(customer.lastOrderAt).toLocaleDateString("en-IN", { dateStyle: "medium" })}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-5 flex items-center justify-between border-t border-line pt-4">
          <p className="text-xs text-ink-light">Page {page} of {totalPages}</p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={page <= 1 || loading}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-line text-ink disabled:opacity-40"
              aria-label="Previous page"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              disabled={page >= totalPages || loading}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-line text-ink disabled:opacity-40"
              aria-label="Next page"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

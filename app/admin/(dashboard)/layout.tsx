import type { Metadata } from "next";
import Sidebar from "@/components/admin/Sidebar";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-cream-alt/60">
      <Sidebar />
      <div className="lg:pl-64">
        <main className="mx-auto max-w-6xl px-4 py-8 md:px-8 md:py-10">{children}</main>
      </div>
    </div>
  );
}

import UsersManager from "@/components/admin/UsersManager";

export default function AdminUsersPage() {
  return (
    <div>
      <h1 className="font-serif text-3xl tracking-tight text-ink">User Management</h1>
      <p className="mt-1 font-sans text-sm text-ink-light">
        View and manage customers based on their order history.
      </p>
      <div className="mt-8">
        <UsersManager />
      </div>
    </div>
  );
}

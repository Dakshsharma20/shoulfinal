import SettingsForm from "@/components/admin/SettingsForm";

export default function AdminSettingsPage() {
  return (
    <div>
      <h1 className="font-serif text-3xl tracking-tight text-ink">Settings</h1>
      <p className="mt-1 font-sans text-sm text-ink-light">
        Store details, WhatsApp, Instagram, logo, and footer — all reflected live on the site.
      </p>
      <div className="mt-8 max-w-2xl">
        <SettingsForm />
      </div>
    </div>
  );
}

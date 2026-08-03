export function formatPrice(price: number): string {
  return `\u20b9${price.toLocaleString("en-IN")}`;
}

export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

/**
 * Converts a string like "Gold Vine Hoops" into "gold-vine-hoops".
 * Used to auto-fill slug fields in the admin forms.
 */
export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

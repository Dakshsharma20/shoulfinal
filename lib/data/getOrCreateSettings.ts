import { connectDB } from "@/lib/db/connect";
import Settings, { type SettingsDocument } from "@/models/Settings";

/**
 * Settings is a singleton — there should only ever be one document. This
 * fetches it, creating one with schema defaults on first run so the site
 * never has to handle a "no settings yet" state.
 */
export async function getOrCreateSettings(): Promise<SettingsDocument> {
  await connectDB();
  let settings = await Settings.findOne();
  if (!settings) {
    settings = await Settings.create({});
  }
  return settings;
}

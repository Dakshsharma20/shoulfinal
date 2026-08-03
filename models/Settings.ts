import mongoose, { Schema, model, models } from "mongoose";

export interface SettingsDocument extends mongoose.Document {
  storeName: string;
  whatsappNumber: string;
  whatsappMessage: string;
  instagramUrl: string;
  instagramHandle: string;
  email: string;
  logo?: { url: string; publicId: string };
  heroBanner?: { url: string; publicId: string };
  footerTagline: string;
  footerLocation: string;
  updatedAt: Date;
}

const SettingsSchema = new Schema<SettingsDocument>(
  {
    storeName: { type: String, required: true, default: "Soul Hues" },
    whatsappNumber: { type: String, required: true, default: "919144801221" },
    whatsappMessage: {
      type: String,
      required: true,
      default:
        "Hi Soul Hues!\nI'm interested in this jewellery piece.\nPlease share more details.",
    },
    instagramUrl: {
      type: String,
      required: true,
      default: "https://www.instagram.com/soulhues.official/",
    },
    instagramHandle: { type: String, required: true, default: "@soulhues.official" },
    email: { type: String, default: "" },
    logo: {
      url: { type: String },
      publicId: { type: String },
    },
    heroBanner: {
      url: { type: String },
      publicId: { type: String },
    },
    footerTagline: {
      type: String,
      default:
        "Handcrafted jewellery made piece by piece in small batches, designed to be worn close and passed down.",
    },
    footerLocation: { type: String, default: "India" },
  },
  { timestamps: true }
);

export default (models.Settings as mongoose.Model<SettingsDocument>) ||
  model<SettingsDocument>("Settings", SettingsSchema);

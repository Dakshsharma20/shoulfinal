import mongoose, { Schema, model, models } from "mongoose";

export interface CategoryDocument extends mongoose.Document {
  name: string;
  slug: string;
  description?: string;
  image?: {
    url: string;
    publicId: string;
  };
  displayOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

const CategorySchema = new Schema<CategoryDocument>(
  {
    name: { type: String, required: true, trim: true, unique: true },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    description: { type: String },
    image: {
      url: { type: String },
      publicId: { type: String },
    },
    displayOrder: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default (models.Category as mongoose.Model<CategoryDocument>) ||
  model<CategoryDocument>("Category", CategorySchema);

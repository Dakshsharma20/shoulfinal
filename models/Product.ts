import mongoose, { Schema, model, models, Types } from "mongoose";

export interface ProductImage {
  url: string;
  publicId: string;
  order: number;
}

export interface ProductDocument extends mongoose.Document {
  title: string;
  slug: string;
  description: string;
  shortDescription: string;
  category: Types.ObjectId;
  price: number;
  images: ProductImage[];
  featured: boolean;
  bestseller: boolean;
  newArrival: boolean;
  inStock: boolean;
  isVisible: boolean;
  material: string;
  color?: string;
  careInstructions: string;
  displayOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

const ProductImageSchema = new Schema<ProductImage>(
  {
    url: { type: String, required: true },
    publicId: { type: String, required: true },
    order: { type: Number, default: 0 },
  },
  { _id: false }
);

const ProductSchema = new Schema<ProductDocument>(
  {
    title: { type: String, required: true, trim: true, maxlength: 120 },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    description: { type: String, required: true },
    shortDescription: { type: String, required: true, maxlength: 200 },
    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
      index: true,
    },
    price: { type: Number, required: true, min: 0 },
    images: {
      type: [ProductImageSchema],
      default: [],
      validate: {
        validator: (arr: ProductImage[]) => arr.length > 0,
        message: "At least one product image is required.",
      },
    },
    featured: { type: Boolean, default: false, index: true },
    bestseller: { type: Boolean, default: false, index: true },
    newArrival: { type: Boolean, default: false, index: true },
    inStock: { type: Boolean, default: true },
    // Not in the original spec, but required for the "Hide / Show Product"
    // admin action to actually persist anything.
    isVisible: { type: Boolean, default: true, index: true },
    material: { type: String, required: true },
    // Not in the original spec, but the existing product detail UI already
    // displays a "Colour" field alongside Material/Care, so it's kept as an
    // optional field to avoid removing that row from the live design.
    color: { type: String },
    careInstructions: { type: String, required: true },
    displayOrder: { type: Number, default: 0, index: true },
  },
  { timestamps: true }
);

ProductSchema.index({ title: "text", description: "text" });

export default (models.Product as mongoose.Model<ProductDocument>) ||
  model<ProductDocument>("Product", ProductSchema);

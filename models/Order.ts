import mongoose, { Schema, model, models, Types } from "mongoose";
import { ALL_ORDER_STATUSES, PAYMENT_STATUSES, type OrderStatus, type PaymentStatus } from "@/lib/order-status";

export interface OrderItem {
  product: Types.ObjectId;
  title: string;
  image: string;
  price: number;
  quantity: number;
}

export interface ShippingAddress {
  fullName: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  state: string;
  pinCode: string;
  country: string;
}

export interface StatusHistoryEntry {
  status: OrderStatus;
  note?: string;
  changedAt: Date;
}

export interface OrderDocument extends mongoose.Document {
  orderNumber: string;
  items: OrderItem[];
  shippingAddress: ShippingAddress;
  orderNotes?: string;

  subtotal: number;
  shippingCharge: number;
  tax: number;
  totalAmount: number;

  paymentMethod: "razorpay";
  paymentStatus: PaymentStatus;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  razorpaySignature?: string;

  orderStatus: OrderStatus;
  statusHistory: StatusHistoryEntry[];

  courierName?: string;
  trackingNumber?: string;
  trackingUrl?: string;

  emailsSent: {
    orderConfirmation: boolean;
    paymentConfirmation: boolean;
    shippingNotification: boolean;
    deliveryNotification: boolean;
  };
  whatsappNotified: boolean;

  createdAt: Date;
  updatedAt: Date;
}

const OrderItemSchema = new Schema<OrderItem>(
  {
    product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    title: { type: String, required: true },
    image: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    quantity: { type: Number, required: true, min: 1 },
  },
  { _id: false }
);

const ShippingAddressSchema = new Schema<ShippingAddress>(
  {
    fullName: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    address: { type: String, required: true, trim: true },
    city: { type: String, required: true, trim: true },
    state: { type: String, required: true, trim: true },
    pinCode: { type: String, required: true, trim: true },
    country: { type: String, required: true, trim: true, default: "India" },
  },
  { _id: false }
);

const StatusHistorySchema = new Schema<StatusHistoryEntry>(
  {
    status: { type: String, enum: ALL_ORDER_STATUSES, required: true },
    note: { type: String },
    changedAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const OrderSchema = new Schema<OrderDocument>(
  {
    orderNumber: { type: String, required: true, unique: true, index: true },
    items: {
      type: [OrderItemSchema],
      default: [],
      validate: {
        validator: (arr: OrderItem[]) => arr.length > 0,
        message: "An order must contain at least one item.",
      },
    },
    shippingAddress: { type: ShippingAddressSchema, required: true },
    orderNotes: { type: String, trim: true, maxlength: 500 },

    subtotal: { type: Number, required: true, min: 0 },
    // Placeholder-rate shipping calculation, editable per order by admin
    // if needed later. See lib/cart-context.tsx for the current rule.
    shippingCharge: { type: Number, required: true, min: 0, default: 0 },
    // Tax is a placeholder (0 by default) per spec — wire up a real rate
    // here when the business registers for GST/tax collection.
    tax: { type: Number, required: true, min: 0, default: 0 },
    totalAmount: { type: Number, required: true, min: 0 },

    paymentMethod: { type: String, enum: ["razorpay"], default: "razorpay" },
    paymentStatus: {
      type: String,
      enum: PAYMENT_STATUSES,
      default: "pending",
      index: true,
    },
    razorpayOrderId: { type: String, index: true },
    razorpayPaymentId: { type: String },
    razorpaySignature: { type: String },

    orderStatus: {
      type: String,
      enum: ALL_ORDER_STATUSES,
      default: "pending",
      index: true,
    },
    statusHistory: { type: [StatusHistorySchema], default: [] },

    courierName: { type: String, trim: true },
    trackingNumber: { type: String, trim: true },
    trackingUrl: { type: String, trim: true },

    emailsSent: {
      orderConfirmation: { type: Boolean, default: false },
      paymentConfirmation: { type: Boolean, default: false },
      shippingNotification: { type: Boolean, default: false },
      deliveryNotification: { type: Boolean, default: false },
    },
    whatsappNotified: { type: Boolean, default: false },
  },
  { timestamps: true }
);

OrderSchema.index({ "shippingAddress.phone": 1 });
OrderSchema.index({ createdAt: -1 });

export default (models.Order as mongoose.Model<OrderDocument>) ||
  model<OrderDocument>("Order", OrderSchema);

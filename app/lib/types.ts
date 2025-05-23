import type { Session } from "~/database/schema.server";
import { OrderStatus } from "./enums";

export type SessionValidationResult =
  | { session: Session; user: User }
  | { session: null; user: null };

export type User = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  avatar: string | null;
  type: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
};

export type CartItem = {
  id: string;
  price: number;
  discount: number;
  quantity: number;
  name: string;
  image: string;
};

export type Product = {
  id: string;
  name: string;
  price: number;
  description: string;
  discount: number;
  images: string[];
  stock: number;
  details: string;
  tag: string;
};

export type Feedback = {
  id: string;
  name: string;
  email: string;
  phone: string;
  comment: string;
  createdAt: string;
};

export type Review = {
  id: string;
  user: string;
  title: string;
  comment: string;
  image: string;
  createdAt: string;
};

export type Order = {
  id: string;
  userId: string;
  status: OrderStatus;
  transactionId: string;
  deliveryAddress: string;
  createdAt: string;
  updatedAt: string;
};

export type ProductOrder = {
  orderId: string;
  productId: string;
  price: string;
  discount: string;
  quantity: string;
  createdAt: Date;
};

export type OrderItemDto = {
  productId: string;
  quantity: number;
};

import type { Session, User } from "~/database/schema.ts";

export type SessionValidationResult =
  | { session: Session; user: User }
  | { session: null; user: null };

export type CartItem = {
  id: string;
  price: number;
  discount: number;
  quantity: number;
  name: string;
  image: string;
};

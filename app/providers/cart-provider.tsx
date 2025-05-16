import { message } from "antd";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type PropsWithChildren,
} from "react";
import type { Product } from "~/database/schema";
import { config } from "~/lib/config";
import type { CartItem } from "~/lib/types";

type CartState = {
  items: CartItem[];
  addItem: (product: Product) => void;
  removeItem: (id: string) => void;
  updateItem: (productId: string, quantity: number) => void;
  clear: () => void;
};

const CartContext = createContext<CartState>({
  items: [],
  addItem: (product: Product) => {},
  removeItem: (id: string) => {},
  updateItem: (productId: string, quantity: number) => {},
  clear: () => {},
});

export function useCart() {
  const ctx = useContext(CartContext);
  return ctx;
}

export function CartProvider({ children }: PropsWithChildren) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [messageApi, contextHolder] = message.useMessage();

  function saveItems(newItems: CartItem[]) {
    setItems(newItems);
    localStorage.setItem(config.storage.cartName, JSON.stringify(newItems));
  }

  function addItem(product: Product) {
    const item = items.find((item) => item.id === product.id);
    if (!item) {
      const newItem: CartItem = {
        id: product.id,
        price: product.price,
        discount: product.discount,
        quantity: 1,
        image: (product.images as string[])[0],
        name: product.name,
      };
      saveItems([...items, newItem]);
      messageApi.success("Item added to cart");
    }
  }

  function removeItem(itemID: string) {
    saveItems(items.filter((item) => item.id !== itemID));
    messageApi.success("Item removed from cart");
  }

  function updateItem(itemId: string, quantity: number) {
    saveItems(items.map((i) => (i.id === itemId ? { ...i, quantity } : i)));
  }

  useEffect(() => {
    const itemsJson = localStorage.getItem(config.storage.cartName);
    if (itemsJson) {
      setItems(JSON.parse(itemsJson));
    }
  }, []);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateItem,
        clear: () => saveItems([]),
      }}
    >
      {contextHolder}
      {children}
    </CartContext.Provider>
  );
}

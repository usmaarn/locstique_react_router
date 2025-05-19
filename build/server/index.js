import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import { PassThrough } from "node:stream";
import { createReadableStreamFromReadable } from "@react-router/node";
import { ServerRouter, useMatches, useActionData, useLoaderData, useParams, useRouteError, createCookieSessionStorage, useNavigate, useNavigation, Meta, Links, ScrollRestoration, Scripts, Outlet, Link, useFetcher, data, redirect, useSearchParams, useLocation } from "react-router";
import { isbot } from "isbot";
import { renderToPipeableStream } from "react-dom/server";
import { createElement, createContext, useState, useEffect, useContext, useTransition, useMemo, lazy, useRef, Suspense } from "react";
import { StyleProvider } from "@ant-design/cssinjs";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { message, ConfigProvider, App, Button, Result, Space, Spin, Tag, Badge, Drawer, Flex, List, Typography, InputNumber, Dropdown, Avatar, Layout as Layout$1, Menu, Input, Divider, Row, Col, FloatButton, Card, Form, Popover, Checkbox, Select, Skeleton, Collapse, Modal, Affix, Statistic, Table, Upload, Image, Segmented, Popconfirm } from "antd";
import "@ant-design/v5-patch-for-react-19";
import { pgTable, timestamp, varchar, text, integer, json, doublePrecision, primaryKey, jsonb } from "drizzle-orm/pg-core";
import { v7 } from "uuid";
import { encodeHexLowerCase, encodeBase32LowerCaseNoPadding } from "@oslojs/encoding";
import "dotenv/config";
import { drizzle } from "drizzle-orm/postgres-js";
import { relations as relations$1, eq, sql, and, ne } from "drizzle-orm";
import postgres from "postgres";
import { sha256 } from "@oslojs/crypto/sha2";
import { TagFilled, ShoppingCartOutlined, MinusOutlined, PlusOutlined, DeleteOutlined, DashboardOutlined, UserOutlined, LogoutOutlined, MenuOutlined, UpOutlined, ArrowRightOutlined, TruckOutlined, HeartOutlined, RollbackOutlined, StarOutlined, SendOutlined, ReloadOutlined, UnorderedListOutlined, TagsOutlined, CommentOutlined, SettingOutlined, MenuUnfoldOutlined, QuestionCircleOutlined } from "@ant-design/icons";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { NumericFormat } from "react-number-format";
import { LocalFileStorage } from "@mjackson/file-storage/local";
import * as fs from "node:fs/promises";
import path from "node:path";
import { z } from "zod";
import { createTransport } from "nodemailer";
import * as argon2 from "argon2";
import { verify } from "argon2";
import { Line } from "@ant-design/charts";
const streamTimeout = 5e3;
function handleRequest(request, responseStatusCode, responseHeaders, routerContext, loadContext) {
  return new Promise((resolve, reject) => {
    let shellRendered = false;
    let userAgent = request.headers.get("user-agent");
    let readyOption = userAgent && isbot(userAgent) || routerContext.isSpaMode ? "onAllReady" : "onShellReady";
    const { pipe, abort } = renderToPipeableStream(
      /* @__PURE__ */ jsx(ServerRouter, { context: routerContext, url: request.url }),
      {
        [readyOption]() {
          shellRendered = true;
          const body = new PassThrough();
          const stream = createReadableStreamFromReadable(body);
          responseHeaders.set("Content-Type", "text/html");
          resolve(
            new Response(stream, {
              headers: responseHeaders,
              status: responseStatusCode
            })
          );
          pipe(body);
        },
        onShellError(error) {
          reject(error);
        },
        onError(error) {
          responseStatusCode = 500;
          if (shellRendered) {
            console.error(error);
          }
        }
      }
    );
    setTimeout(abort, streamTimeout + 1e3);
  });
}
const entryServer = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: handleRequest,
  streamTimeout
}, Symbol.toStringTag, { value: "Module" }));
function withComponentProps(Component) {
  return function Wrapped() {
    const props = {
      params: useParams(),
      loaderData: useLoaderData(),
      actionData: useActionData(),
      matches: useMatches()
    };
    return createElement(Component, props);
  };
}
function withHydrateFallbackProps(HydrateFallback4) {
  return function Wrapped() {
    const props = {
      params: useParams(),
      loaderData: useLoaderData(),
      actionData: useActionData()
    };
    return createElement(HydrateFallback4, props);
  };
}
function withErrorBoundaryProps(ErrorBoundary3) {
  return function Wrapped() {
    const props = {
      params: useParams(),
      loaderData: useLoaderData(),
      actionData: useActionData(),
      error: useRouteError()
    };
    return createElement(ErrorBoundary3, props);
  };
}
const config = {
  appName: "Locstique",
  appVersion: "1.0",
  storage: {
    subscribedName: "is_locstique_subscriber",
    authName: "locstique_auth",
    cartName: "locstique_cart",
    tokenName: "locstique_access_token",
    appVersion: "locstique_app_version"
  }
};
const CartContext = createContext({
  items: [],
  addItem: (product) => {
  },
  removeItem: (id) => {
  },
  updateItem: (productId, quantity) => {
  },
  clear: () => {
  }
});
function useCart() {
  const ctx = useContext(CartContext);
  return ctx;
}
function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const [messageApi, contextHolder] = message.useMessage();
  function saveItems(newItems) {
    setItems(newItems);
    localStorage.setItem(config.storage.cartName, JSON.stringify(newItems));
  }
  function addItem(product) {
    const item = items.find((item2) => item2.id === product.id);
    if (!item) {
      const newItem = {
        id: product.id,
        price: product.price,
        discount: product.discount,
        quantity: 1,
        image: product.images[0],
        name: product.name
      };
      saveItems([...items, newItem]);
      messageApi.success("Item added to cart");
    }
  }
  function removeItem(itemID) {
    saveItems(items.filter((item) => item.id !== itemID));
    messageApi.success("Item removed from cart");
  }
  function updateItem(itemId, quantity) {
    saveItems(
      items.map(
        (i) => i.id === itemId ? { ...i, quantity: quantity < 1 ? 1 : quantity } : i
      )
    );
  }
  useEffect(() => {
    const itemsJson = localStorage.getItem(config.storage.cartName);
    if (itemsJson) {
      setItems(JSON.parse(itemsJson));
    }
  }, []);
  return /* @__PURE__ */ jsxs(
    CartContext.Provider,
    {
      value: {
        items,
        addItem,
        removeItem,
        updateItem,
        clear: () => saveItems([])
      },
      children: [
        contextHolder,
        children
      ]
    }
  );
}
const queryClient = new QueryClient();
function AppProvider({ children }) {
  return /* @__PURE__ */ jsx(QueryClientProvider, { client: queryClient, children: /* @__PURE__ */ jsx(StyleProvider, { hashPriority: "high", layer: false, children: /* @__PURE__ */ jsx(
    ConfigProvider,
    {
      theme: {
        token: {
          colorPrimary: "#1e2939",
          colorLink: "#1e2939"
          // borderRadius: 0,
          // fontFamily: '"Noto Sans", sans-serif',
        },
        components: {
          Typography: {
            titleMarginBottom: 0,
            titleMarginTop: 0,
            margin: 0
          }
        }
      },
      children: /* @__PURE__ */ jsx(CartProvider, { children: /* @__PURE__ */ jsx(App, { children }) })
    }
  ) }) });
}
const { getSession, commitSession, destroySession } = createCookieSessionStorage({
  // a Cookie from `createCookie` or the CookieOptions to create one
  cookie: {
    name: "__session",
    // all of these are optional
    // domain:  "locstique.com",
    // Expires can also be set (although maxAge overrides it when used in combination).
    // Note that this method is NOT recommended as `new Date` creates only one date on each server deployment, not a dynamic date in the future!
    //
    // expires: new Date(Date.now() + 60_000),
    httpOnly: true,
    maxAge: 24 * 60 * 60,
    path: "/",
    sameSite: "lax",
    secrets: ["s3cret1"],
    secure: process.env.APP_ENV === "production"
  }
});
var UserType = /* @__PURE__ */ ((UserType2) => {
  UserType2["CUSTOMER"] = "5";
  UserType2["ADMIN"] = "10";
  return UserType2;
})(UserType || {});
var OrderStatus = /* @__PURE__ */ ((OrderStatus2) => {
  OrderStatus2["PENDING_PAYMENT"] = "5";
  OrderStatus2["PENDING_DELIVERY"] = "10";
  OrderStatus2["DELIVERED"] = "15";
  return OrderStatus2;
})(OrderStatus || {});
function generateUnqueString(prefix = "PRD") {
  const timestamp2 = Date.now().toString(36);
  const random = Math.random().toString(8).substring(2).toUpperCase();
  return `${prefix}-${timestamp2}-${random}`.toUpperCase();
}
async function validateSchema(schema2, data2) {
  const result = await schema2.safeParseAsync(data2);
  const errors = {};
  if (!result.success) {
    for (const issue of result.error.issues) {
      errors[issue.path[0]] = issue.message;
    }
    return { errors };
  }
  return { data: result.data };
}
const usersTable = pgTable("users", {
  id: varchar("id").primaryKey().$defaultFn(v7),
  name: varchar("name").notNull(),
  email: varchar("email").notNull().unique("users_email_idx"),
  phone: varchar("phone", { length: 20 }).unique("users_phone_idx"),
  avatar: varchar("avatar"),
  type: text("type").notNull().default(UserType.CUSTOMER),
  password: varchar("password").notNull(),
  createdAt: timestamp("createdAt", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updatedAt", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => /* @__PURE__ */ new Date())
});
const sessionsTable = pgTable("sessions", {
  id: varchar("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => usersTable.id),
  expiresAt: timestamp("expires_at", {
    withTimezone: true,
    mode: "date"
  }).notNull()
});
const productsTable = pgTable("products", {
  id: varchar("id").primaryKey().$defaultFn(v7),
  name: varchar("name").unique("product_name_idx").notNull(),
  details: text("details").notNull().default(""),
  description: text("description").notNull(),
  price: doublePrecision("price").notNull(),
  discount: doublePrecision("discount").notNull().default(0),
  images: json("images").notNull().default([]),
  stock: integer("stock").notNull().default(0),
  tag: varchar("tag").default("🎁 BUY 1, GET 1 FREE HOLIDAY SALE 🎁"),
  createdAt: timestamp("createdAt", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updatedAt", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => /* @__PURE__ */ new Date())
});
const cartsTable = pgTable(
  "carts",
  {
    userId: varchar("user_id").references(() => usersTable.id).notNull(),
    productId: varchar("product_id").references(() => productsTable.id).notNull(),
    quantity: integer("quantity").notNull(),
    createdAt: timestamp("createdAt", { withTimezone: true }).notNull().defaultNow()
  },
  (t) => [primaryKey({ name: "cart_id", columns: [t.productId, t.userId] })]
);
const ordersTable = pgTable("orders", {
  id: varchar("id").primaryKey().$defaultFn(() => generateUnqueString("TRN_")),
  userId: varchar("user_id").references(() => usersTable.id).notNull(),
  status: varchar("status", { length: 10 }).default(
    OrderStatus.PENDING_PAYMENT
  ),
  transactionId: varchar("transaction_id"),
  deliveryAddress: varchar("delivery_address"),
  createdAt: timestamp("createdAt", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updatedAt", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => /* @__PURE__ */ new Date())
});
const productOrderTable = pgTable(
  "product_order",
  {
    orderId: varchar("order_id").references(() => ordersTable.id).notNull(),
    productId: varchar("product_id").references(() => productsTable.id).notNull(),
    price: doublePrecision("price").notNull(),
    discount: doublePrecision("discount").notNull().default(0),
    quantity: integer("quantity").notNull(),
    createdAt: timestamp("createdAt", { withTimezone: true }).notNull().defaultNow()
  },
  (t) => [
    primaryKey({ name: "product_order_id", columns: [t.productId, t.orderId] })
  ]
);
const subscribersTable = pgTable("subscribers", {
  id: varchar("id").primaryKey().$defaultFn(v7),
  email: varchar("email").notNull().unique("subscribers_email_idx"),
  createdAt: timestamp("createdAt", { withTimezone: true }).notNull().defaultNow()
});
const feedbacksTable = pgTable("feedbacks", {
  id: varchar("id").primaryKey().$defaultFn(v7),
  name: varchar("name"),
  email: varchar("email"),
  phone: varchar("phone"),
  comment: varchar("comment").notNull(),
  createdAt: timestamp("createdAt", { withTimezone: true }).notNull().defaultNow()
});
const settingsTable = pgTable("settings", {
  id: varchar("id").primaryKey().$defaultFn(v7),
  name: varchar("name").notNull().unique("settings_name_idx"),
  value: jsonb("value"),
  comment: varchar("comment"),
  createdAt: timestamp("createdAt", { withTimezone: true }).notNull().defaultNow()
});
const reviewsTable = pgTable("reviews", {
  id: varchar("id").primaryKey().$defaultFn(v7),
  user: varchar("user").notNull(),
  image: varchar("image"),
  title: varchar("title").notNull(),
  comment: varchar("comment"),
  createdAt: timestamp("createdAt", { withTimezone: true }).notNull().defaultNow()
});
const schema = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  cartsTable,
  feedbacksTable,
  ordersTable,
  productOrderTable,
  productsTable,
  reviewsTable,
  sessionsTable,
  settingsTable,
  subscribersTable,
  usersTable
}, Symbol.toStringTag, { value: "Module" }));
const productRelations = relations$1(productsTable, ({ one, many }) => ({
  carts: many(cartsTable)
  // reviews: many(reviewsTable),
}));
const cartRelations = relations$1(cartsTable, ({ one }) => ({
  user: one(usersTable, {
    fields: [cartsTable.userId],
    references: [usersTable.id]
  }),
  product: one(productsTable, {
    fields: [cartsTable.productId],
    references: [productsTable.id]
  })
}));
const orderRelations = relations$1(ordersTable, ({ one, many }) => ({
  user: one(usersTable, {
    fields: [ordersTable.userId],
    references: [usersTable.id]
  }),
  items: many(productOrderTable)
}));
const productOrderRelations = relations$1(
  productOrderTable,
  ({ one }) => ({
    order: one(ordersTable, {
      fields: [productOrderTable.orderId],
      references: [ordersTable.id]
    }),
    product: one(productsTable, {
      fields: [productOrderTable.productId],
      references: [productsTable.id]
    })
  })
);
const relations = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  cartRelations,
  orderRelations,
  productOrderRelations,
  productRelations
}, Symbol.toStringTag, { value: "Module" }));
const client = postgres(process.env.DATABASE_URL);
const db = drizzle(client, {
  schema: {
    ...schema,
    ...relations
  }
});
const sessionService = {
  generateSessionToken() {
    const bytes = new Uint8Array(20);
    crypto.getRandomValues(bytes);
    const token = encodeBase32LowerCaseNoPadding(bytes);
    return token;
  },
  async create(token, userId) {
    const sessionId = encodeHexLowerCase(
      sha256(new TextEncoder().encode(token))
    );
    const session = {
      id: sessionId,
      userId,
      expiresAt: new Date(Date.now() + 1e3 * 60 * 60 * 24 * 30)
    };
    await db.insert(sessionsTable).values(session);
    return session;
  },
  async validateSessionToken(sessionId) {
    const result = await db.select({ user: usersTable, session: sessionsTable }).from(sessionsTable).innerJoin(usersTable, eq(sessionsTable.userId, usersTable.id)).where(eq(sessionsTable.id, sessionId));
    if (result.length < 1) {
      return { session: null, user: null };
    }
    const { user, session } = result[0];
    if (Date.now() >= session.expiresAt.getTime()) {
      await db.delete(sessionsTable).where(eq(sessionsTable.id, session.id));
      return { session: null, user: null };
    }
    if (Date.now() >= session.expiresAt.getTime() - 1e3 * 60 * 60 * 24 * 15) {
      session.expiresAt = new Date(Date.now() + 1e3 * 60 * 60 * 24 * 30);
      await db.update(sessionsTable).set({
        expiresAt: session.expiresAt
      }).where(eq(sessionsTable.id, session.id));
    }
    return { session, user };
  },
  async invalidate(sessionId) {
    await db.delete(sessionsTable).where(eq(sessionsTable.id, sessionId));
  },
  async invalidateAll(userId) {
    await db.delete(sessionsTable).where(eq(sessionsTable.userId, userId));
  }
};
function ButtonLink({ to, ...props }) {
  const navigate = useNavigate();
  return /* @__PURE__ */ jsx(
    Button,
    {
      ...props,
      onClick: (e) => props.onClick ? props.onClick(e) : navigate(to)
    }
  );
}
const ErrorPage = ({
  status = 500,
  message: message2 = "Interna Server Error",
  details = "An unexpected error occurred."
}) => {
  const navigate = useNavigate();
  return /* @__PURE__ */ jsx("main", { className: "pt-16 p-4 container mx-auto", children: /* @__PURE__ */ jsx(
    Result,
    {
      status,
      title: message2,
      subTitle: details,
      extra: /* @__PURE__ */ jsxs(Space, { children: [
        /* @__PURE__ */ jsx(ButtonLink, { to: "/", type: "primary", children: "Back to Home" }),
        status !== 404 && /* @__PURE__ */ jsx(Button, { onClick: () => navigate(0), color: "blue", variant: "solid", children: "Reload Page" })
      ] })
    }
  ) });
};
const links = () => [{
  rel: "preconnect",
  href: "https://fonts.googleapis.com"
}, {
  rel: "preconnect",
  href: "https://fonts.gstatic.com",
  crossOrigin: "anonymous"
}, {
  rel: "stylesheet",
  href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap"
}];
function meta$7({}) {
  return [{
    title: `${config.appName}`
  }, {
    name: "description",
    content: "Welcome to Locstique!"
  }];
}
async function loader$h({
  request
}) {
  const session = await getSession(request.headers.get("Cookie"));
  const sessionId = session.get("userId");
  if (sessionId) {
    const result = await sessionService.validateSessionToken(sessionId);
    if (result.user) {
      const {
        password,
        ...user
      } = result.user;
      return {
        user
      };
    }
    return result;
  }
}
async function clientLoader$3({
  serverLoader
}) {
  const appVersion = localStorage.getItem(config.storage.appVersion);
  if (!appVersion || appVersion != config.appVersion) {
    localStorage.removeItem(config.storage.cartName);
    localStorage.removeItem(config.storage.authName);
    localStorage.removeItem(config.storage.tokenName);
    localStorage.setItem(config.storage.appVersion, config.appVersion);
  }
  const response = await serverLoader();
  localStorage.setItem(config.storage.authName, JSON.stringify((response == null ? void 0 : response.user) ?? ""));
}
function Layout({
  children
}) {
  const navigation = useNavigation();
  const isNavigating = Boolean(navigation.location);
  return /* @__PURE__ */ jsxs("html", {
    lang: "en",
    children: [/* @__PURE__ */ jsxs("head", {
      children: [/* @__PURE__ */ jsx("meta", {
        charSet: "utf-8"
      }), /* @__PURE__ */ jsx("meta", {
        name: "viewport",
        content: "width=device-width, initial-scale=1"
      }), /* @__PURE__ */ jsx(Meta, {}), /* @__PURE__ */ jsx(Links, {})]
    }), /* @__PURE__ */ jsxs("body", {
      children: [/* @__PURE__ */ jsxs(AppProvider, {
        children: [/* @__PURE__ */ jsx(Spin, {
          spinning: isNavigating,
          fullscreen: true
        }), children]
      }), /* @__PURE__ */ jsx(ScrollRestoration, {}), /* @__PURE__ */ jsx(Scripts, {})]
    })]
  });
}
const root = withComponentProps(function App2() {
  return /* @__PURE__ */ jsx(Outlet, {});
});
const ErrorBoundary = withErrorBoundaryProps(function ErrorBoundary2({
  error
}) {
  return /* @__PURE__ */ jsx(ErrorPage, {
    status: (error == null ? void 0 : error.status) === 404 ? 404 : 500,
    message: error.status === 404 ? "Page Not Found" : void 0,
    details: error.status === 404 ? "The page you are looking for does not exist" : void 0
  });
});
const route0 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  ErrorBoundary,
  Layout,
  clientLoader: clientLoader$3,
  default: root,
  links,
  loader: loader$h,
  meta: meta$7
}, Symbol.toStringTag, { value: "Module" }));
function useAuth() {
  const [user, setUser] = useState(null);
  useEffect(() => {
    const userJson = localStorage.getItem(config.storage.authName);
    if (userJson) {
      setUser(JSON.parse(userJson));
    }
  }, []);
  return { user };
}
function cn(...inputs) {
  return twMerge(clsx(inputs));
}
function calculateDiscount(price, discount) {
  return discount > 0 ? price - calculatePercentage(price, discount) : price;
}
function calculatePercentage(num, percentage) {
  return num / 100 * percentage;
}
function setFieldErrors(form, errors) {
  if (errors) {
    const errorMap = Object.entries(errors).map(([name, err]) => ({
      name,
      errors: [err]
    }));
    form.setFields(errorMap);
  }
}
function getImageSrc(value) {
  return value.startsWith("http") ? value : "/uploads/" + value;
}
const AppLogo = ({
  className,
  ...props
}) => {
  return /* @__PURE__ */ jsxs(
    Link,
    {
      to: "/",
      className: cn("text-2xl sm:text-3xl text-black! uppercase", className),
      ...props,
      children: [
        /* @__PURE__ */ jsx("b", { children: "Locs" }),
        /* @__PURE__ */ jsx("span", { className: "font-light", children: "tique" })
      ]
    }
  );
};
const ProductContext = createContext(null);
const useProductContext = () => {
  const ctx = useContext(ProductContext);
  if (!ctx) {
    throw new Error("useProductContext must be used within ProductProvider");
  }
  return ctx;
};
const ProductProvider = ({
  product,
  children
}) => {
  if (!product) {
    return /* @__PURE__ */ jsx("p", { children: "No Product passed" });
  }
  return /* @__PURE__ */ jsx(ProductContext.Provider, { value: product, children });
};
function ProductImage({
  size,
  className,
  ...props
}) {
  var _a;
  const product = useProductContext();
  return /* @__PURE__ */ jsx(
    "img",
    {
      width: size,
      height: size,
      src: getImageSrc((_a = product.images) == null ? void 0 : _a[0]),
      alt: "Product",
      className,
      ...props
    }
  );
}
function ProductPrice(props) {
  const product = useProductContext();
  return /* @__PURE__ */ jsx(
    NumericFormat,
    {
      allowNegative: false,
      decimalScale: 2,
      displayType: "text",
      value: product.price,
      prefix: "$",
      ...props
    }
  );
}
function ProductDiscount(props) {
  const product = useProductContext();
  return /* @__PURE__ */ jsx(
    NumericFormat,
    {
      allowNegative: false,
      decimalScale: 2,
      displayType: "text",
      value: calculateDiscount(product.price, product.discount),
      prefix: "$",
      ...props
    }
  );
}
function ProductTitle(props) {
  const product = useProductContext();
  return /* @__PURE__ */ jsx("span", { ...props, children: product.name });
}
function ProductTag(props) {
  const product = useProductContext();
  return /* @__PURE__ */ jsx("span", { ...props, children: product.tag });
}
function ProductDescription({
  className,
  ...props
}) {
  const product = useProductContext();
  return /* @__PURE__ */ jsx(
    "div",
    {
      className: cn(className),
      ...props,
      dangerouslySetInnerHTML: { __html: product.description }
    }
  );
}
function ProductDetails({ className, ...props }) {
  const product = useProductContext();
  return /* @__PURE__ */ jsx(
    "div",
    {
      className: cn(className),
      ...props,
      dangerouslySetInnerHTML: { __html: product.details }
    }
  );
}
const AddToCartButton = ({ children, ...props }) => {
  const product = useProductContext();
  const [loading, startTransition] = useTransition();
  const cart = useCart();
  const [inCart, setInCart] = useState(
    cart.items.some((i) => i.id === product.id)
  );
  const handleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    startTransition(async () => cart.addItem(product));
  };
  useEffect(() => {
    setInCart(cart.items.some((i) => i.id === product.id));
  }, [product, cart.items]);
  return /* @__PURE__ */ jsx(
    Button,
    {
      htmlType: "button",
      disabled: loading || inCart,
      onClick: handleClick,
      ...props,
      loading,
      children
    }
  );
};
const RemoveFromCartButton = ({ children, ...props }) => {
  const product = useProductContext();
  const [loading, startTransition] = useTransition();
  const cart = useCart();
  const [inCart, setInCart] = useState(
    cart.items.some((i) => i.id === product.id)
  );
  const handleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    startTransition(async () => cart.removeItem(product.id));
  };
  useEffect(() => {
    setInCart(cart.items.some((i) => i.id === product.id));
  }, [product, cart.items]);
  return /* @__PURE__ */ jsx(
    Button,
    {
      disabled: loading || !inCart,
      onClick: handleClick,
      ...props,
      loading,
      children
    }
  );
};
function ProductDiscountTag({ className, ...props }) {
  const product = useProductContext();
  return product.discount ? /* @__PURE__ */ jsxs(
    Tag,
    {
      className: cn(
        "bg-foreground! text-background! inline-flex! items-center! rounded-sm! font-bold! border-primary!",
        className
      ),
      icon: /* @__PURE__ */ jsx(TagFilled, {}),
      ...props,
      children: [
        "SAVE ",
        product.discount,
        "%"
      ]
    }
  ) : null;
}
function PriceFormat(props) {
  return /* @__PURE__ */ jsx(
    NumericFormat,
    {
      displayType: "text",
      decimalScale: 2,
      prefix: "$",
      thousandSeparator: true,
      ...props
    }
  );
}
const CartMenu = () => {
  const cart = useCart();
  const [open, setOpen] = useState(false);
  const navigation = useNavigation();
  const totalAmount = cart.items.reduce(
    (acc, item) => acc + item.quantity * calculateDiscount(item.price, item.discount),
    0
  );
  useEffect(() => {
    setOpen(false);
  }, [navigation.location]);
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(Badge, { count: cart.items.length, size: "small", children: /* @__PURE__ */ jsx(
      Button,
      {
        onClick: () => setOpen(true),
        icon: /* @__PURE__ */ jsx(ShoppingCartOutlined, { className: "text-3xl!" }),
        type: "text",
        size: "small",
        className: "relative"
      }
    ) }),
    /* @__PURE__ */ jsx(Drawer, { open, onClose: () => setOpen(false), title: "Your Cart", children: /* @__PURE__ */ jsxs(Flex, { vertical: true, className: "h-full", children: [
      /* @__PURE__ */ jsx(
        List,
        {
          className: "grow!",
          size: "small",
          itemLayout: "vertical",
          dataSource: cart.items,
          renderItem: (item) => /* @__PURE__ */ jsx(Item, { item }, item.id)
        }
      ),
      /* @__PURE__ */ jsxs(
        Space,
        {
          hidden: !cart.items.length,
          direction: "vertical",
          className: "w-full",
          children: [
            /* @__PURE__ */ jsxs(Flex, { justify: "space-between", children: [
              /* @__PURE__ */ jsx(Typography.Title, { level: 4, children: "Subtotal" }),
              /* @__PURE__ */ jsx(Typography.Title, { level: 4, children: /* @__PURE__ */ jsx(PriceFormat, { value: totalAmount }) })
            ] }),
            /* @__PURE__ */ jsx(Link, { to: "/checkout", children: /* @__PURE__ */ jsx(Button, { className: "w-full", type: "primary", size: "large", children: "Buy It Now" }) })
          ]
        }
      )
    ] }) })
  ] });
};
function Item({ item }) {
  const cart = useCart();
  return /* @__PURE__ */ jsx(ProductProvider, { product: item, children: /* @__PURE__ */ jsx(
    List.Item,
    {
      extra: /* @__PURE__ */ jsx(
        RemoveFromCartButton,
        {
          icon: /* @__PURE__ */ jsx(DeleteOutlined, {}),
          size: "small",
          type: "text"
        }
      ),
      children: /* @__PURE__ */ jsx(
        List.Item.Meta,
        {
          avatar: /* @__PURE__ */ jsx("img", { src: getImageSrc(item.image), width: 40 }),
          title: /* @__PURE__ */ jsx(ProductTitle, { className: "text-sm! font-medium" }),
          description: /* @__PURE__ */ jsxs(Flex, { justify: "space-between", align: "end", children: [
            /* @__PURE__ */ jsxs(Space.Compact, { children: [
              /* @__PURE__ */ jsx(
                Button,
                {
                  onClick: () => cart.updateItem(item.id, item.quantity - 1),
                  disabled: item.quantity <= 1,
                  icon: /* @__PURE__ */ jsx(MinusOutlined, {})
                }
              ),
              /* @__PURE__ */ jsx(
                InputNumber,
                {
                  value: item.quantity,
                  style: { width: 70 },
                  min: 1,
                  onChange: (v) => cart.updateItem(item.id, v)
                }
              ),
              /* @__PURE__ */ jsx(
                Button,
                {
                  onClick: () => cart.updateItem(item.id, item.quantity + 1),
                  icon: /* @__PURE__ */ jsx(PlusOutlined, {})
                }
              )
            ] }),
            /* @__PURE__ */ jsx(Typography.Title, { level: 5, className: "text-sm!", children: /* @__PURE__ */ jsx(
              PriceFormat,
              {
                value: calculateDiscount(item.price, item.discount) * item.quantity
              }
            ) })
          ] })
        }
      )
    }
  ) });
}
const UserMenu = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const fetcher = useFetcher();
  if (!user) return null;
  const items = [
    {
      key: "/dashboard",
      icon: /* @__PURE__ */ jsx(DashboardOutlined, {}),
      label: "Dashboard",
      hide: (user == null ? void 0 : user.type) !== UserType.ADMIN,
      onClick: () => navigate("/dashboard")
    },
    {
      key: "/profile",
      icon: /* @__PURE__ */ jsx(UserOutlined, {}),
      label: "Profile",
      onClick: () => navigate("/profile")
    },
    {
      key: "logout",
      icon: /* @__PURE__ */ jsx(LogoutOutlined, {}),
      label: "Logout",
      danger: true,
      onClick: () => fetcher.submit(null, { method: "POST", action: "/logout" })
    }
  ];
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(Spin, { spinning: fetcher.state != "idle", fullscreen: true }),
    /* @__PURE__ */ jsx(
      Dropdown,
      {
        trigger: "click",
        menu: { items: items.filter((item) => !item.hide) },
        children: /* @__PURE__ */ jsx("button", { className: "cursor-pointer", children: /* @__PURE__ */ jsx(Avatar, { icon: /* @__PURE__ */ jsx(UserOutlined, {}) }) })
      }
    )
  ] });
};
const menuItems = [
  {
    key: "/",
    label: "Home"
  },
  {
    key: "/shop",
    label: "Shop"
  },
  {
    key: "/contact",
    label: "Contact Us"
  }
];
const Navbar = () => {
  const auth = useAuth();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const navigation = useNavigation();
  useEffect(() => {
    setOpen(false);
  }, [navigation.location]);
  return /* @__PURE__ */ jsx(Layout$1.Header, { className: "bg-white! px-3! md:h-24!", children: /* @__PURE__ */ jsxs(
    Flex,
    {
      align: "center",
      justify: "space-between",
      className: "max-w-7xl! mx-auto! h-full",
      children: [
        /* @__PURE__ */ jsx("div", { className: "hidden md:flex items-center gap-5", children: menuItems.map((item) => /* @__PURE__ */ jsx(
          Link,
          {
            to: item.key,
            className: "text-sm font-medium text-primary!",
            children: item.label
          },
          item.key
        )) }),
        /* @__PURE__ */ jsx(
          Button,
          {
            icon: /* @__PURE__ */ jsx(MenuOutlined, { className: "text-xl!" }),
            type: "text",
            size: "small",
            className: "md:hidden!",
            onClick: () => setOpen(true)
          }
        ),
        /* @__PURE__ */ jsx(Drawer, { title: "Menu", open, onClose: () => setOpen(false), children: /* @__PURE__ */ jsx(
          Menu,
          {
            items: menuItems,
            mode: "inline",
            style: { border: 0 },
            onClick: (info) => navigate(info.key)
          }
        ) }),
        /* @__PURE__ */ jsx(AppLogo, { className: "md:text-5xl" }),
        /* @__PURE__ */ jsxs("div", { className: "place-self-end flex h-full items-center gap-3", children: [
          auth.user && /* @__PURE__ */ jsx(UserMenu, {}),
          /* @__PURE__ */ jsx(CartMenu, {})
        ] })
      ]
    }
  ) });
};
const Footer = () => {
  const [loading, startTransition] = useTransition();
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  useEffect(() => {
    const defaultSubscribed = localStorage.getItem(
      config.storage.subscribedName
    );
    if (defaultSubscribed && defaultSubscribed === "true") {
      setSubscribed(true);
    }
  }, []);
  useEffect(() => {
    localStorage.setItem(
      config.storage.subscribedName,
      subscribed ? "true" : "false"
    );
  }, [subscribed]);
  function handleSubscribe() {
    startTransition(async () => {
      var _a, _b;
      try {
        message.success("Subscription successful!");
        setSubscribed(true);
      } catch (error) {
        message.error(((_b = (_a = error == null ? void 0 : error.response) == null ? void 0 : _a.data) == null ? void 0 : _b.message) ?? "An error occurred!");
      }
    });
  }
  return /* @__PURE__ */ jsxs(Layout$1.Footer, { className: "bg-primary! px-0!", children: [
    /* @__PURE__ */ jsxs(Flex, { vertical: true, gap: 12, hidden: subscribed, className: "px-4!", children: [
      /* @__PURE__ */ jsx(Typography.Title, { level: 2, className: "text-center text-gray-200!", children: "Subscribe to our Email" }),
      /* @__PURE__ */ jsx(Typography.Paragraph, { className: "text-gray-300! text-center", children: "Join our email list for exclusive offers and the latest news." }),
      /* @__PURE__ */ jsxs(Space, { direction: "vertical", className: "w-full max-w-[400px] mx-auto", children: [
        /* @__PURE__ */ jsx(
          Input,
          {
            placeholder: "Email Address",
            value: email,
            size: "large",
            className: "bg-transparent! text-gray-300! border-gray-700! placeholder:text-gray-400!",
            onChange: (e) => setEmail(e.currentTarget.value)
          }
        ),
        /* @__PURE__ */ jsx(
          Button,
          {
            size: "large",
            className: "w-full bg-gray-700! border-none! text-white!",
            onClick: handleSubscribe,
            loading,
            children: "Subscribe"
          }
        )
      ] })
    ] }),
    !subscribed && /* @__PURE__ */ jsx(Divider, { className: "bg-gray-800!" }),
    /* @__PURE__ */ jsxs(Row, { gutter: [30, 12], className: "px-4 max-w-7xl mx-auto!", children: [
      /* @__PURE__ */ jsxs(Col, { span: 12, md: 6, children: [
        /* @__PURE__ */ jsx(Typography.Title, { level: 4, className: "text-gray-200!", children: "Who We are?" }),
        /* @__PURE__ */ jsx(Typography.Paragraph, { className: "mt-2 text-gray-300!", children: "Welcome to LocsTique, where timeless elegance meets modern empowerment. We curate a collection of women's products that inspire confidence and celebrate individuality." })
      ] }),
      /* @__PURE__ */ jsxs(Col, { span: 12, md: 6, children: [
        /* @__PURE__ */ jsx(Typography.Title, { level: 4, className: "text-gray-200!", children: "Our Mission" }),
        /* @__PURE__ */ jsx(Typography.Paragraph, { className: "mt-2 text-gray-300!", children: "Empowering women through curated beauty. Our mission is simple - celebrate confidence, individuality, and style. Join us on a journey where beauty meets empowerment." })
      ] }),
      /* @__PURE__ */ jsxs(Col, { span: 12, md: 6, children: [
        /* @__PURE__ */ jsx(Typography.Title, { level: 4, className: "text-gray-200!", children: "Policies" }),
        /* @__PURE__ */ jsxs(Space, { direction: "vertical", className: "mt-2", children: [
          /* @__PURE__ */ jsx(Link, { className: "text-gray-300! hover:underline!", to: "/contact", children: "Contact Us" }),
          /* @__PURE__ */ jsx(
            Link,
            {
              className: "text-gray-300! hover:underline!",
              to: "/pages/shipping_policy",
              children: "Shipping Policy"
            }
          ),
          /* @__PURE__ */ jsx(
            Link,
            {
              className: "text-gray-300! hover:underline!",
              to: "/pages/terms_of_service",
              children: "Terms of Service"
            }
          ),
          /* @__PURE__ */ jsx(
            Link,
            {
              className: "text-gray-300! hover:underline!",
              to: "/pages/refund_policy",
              children: "Refund Policy"
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxs(Col, { span: 12, md: 6, children: [
        /* @__PURE__ */ jsx(Typography.Title, { level: 4, className: "text-gray-200!", children: "Need Help?" }),
        /* @__PURE__ */ jsxs(Space, { direction: "vertical", className: "mt-2", children: [
          /* @__PURE__ */ jsx(Link, { className: "text-gray-300! hover:underline!", to: "/", children: "Home" }),
          /* @__PURE__ */ jsx(Link, { className: "text-gray-300! hover:underline!", to: "/shop", children: "Shop" }),
          /* @__PURE__ */ jsx(Link, { className: "text-gray-300! hover:underline!", to: "/contact", children: "Contact Us" })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsx(Divider, { className: "bg-gray-800!" }),
    /* @__PURE__ */ jsx("section", { children: /* @__PURE__ */ jsxs(Typography.Paragraph, { className: "text-center text-gray-300! m-0!", children: [
      "© ",
      (/* @__PURE__ */ new Date()).getFullYear(),
      ", Locstique"
    ] }) })
  ] });
};
const PublicLayout = () => {
  return /* @__PURE__ */ jsxs(Layout$1, {
    id: "page",
    className: "min-h-screen bg-white flex flex-col",
    children: [/* @__PURE__ */ jsx(Banner, {}), /* @__PURE__ */ jsx(Navbar, {}), /* @__PURE__ */ jsxs(Layout$1.Content, {
      className: cn("grow! bg-white"),
      children: [/* @__PURE__ */ jsx(FloatButton, {
        href: "#page",
        icon: /* @__PURE__ */ jsx(UpOutlined, {})
      }), /* @__PURE__ */ jsx(Outlet, {})]
    }), /* @__PURE__ */ jsx(Footer, {})]
  });
};
function Banner() {
  return /* @__PURE__ */ jsx(Card, {
    className: "text-center bg-purple-900! rounded-none! border-0!",
    classNames: {
      body: "py-2.5!"
    },
    children: /* @__PURE__ */ jsx(Typography.Paragraph, {
      className: "text-base! font-bold text-center text-white! m-0!",
      children: "50% Off + FREE Shipping Today"
    })
  });
}
const layout$1 = withComponentProps(PublicLayout);
const route1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: layout$1
}, Symbol.toStringTag, { value: "Module" }));
const HeroSection = ({ data: data2 }) => {
  return /* @__PURE__ */ jsxs(
    "section",
    {
      style: {
        backgroundImage: `linear-gradient(to right, rgba(10, 10, 10, 0.654), rgba(78, 4, 64, 0.777)), url(${data2 == null ? void 0 : data2.bg_image})`,
        backgroundPosition: "center",
        backgroundSize: "cover"
      },
      className: "hero h-96 md:h-[36rem] bg-black flex flex-col text-white  gap-5 items-center justify-center ",
      children: [
        /* @__PURE__ */ jsx(Typography.Title, { className: "text-white! font-black", children: data2 == null ? void 0 : data2.hero_heading }),
        /* @__PURE__ */ jsx(Typography.Paragraph, { style: { color: "white" }, children: data2 == null ? void 0 : data2.sub_heading }),
        /* @__PURE__ */ jsx(Link, { to: "/shop", children: /* @__PURE__ */ jsx(
          Button,
          {
            size: "large",
            icon: /* @__PURE__ */ jsx(ArrowRightOutlined, {}),
            variant: "outlined",
            className: "font-bold! bg-transparent! border-2! text-white! px-8! py-6!",
            iconPosition: "end",
            children: "Shop Now"
          }
        ) })
      ]
    }
  );
};
const ProductCard = ({
  product,
  showAddToCart,
  className,
  ...props
}) => {
  return /* @__PURE__ */ jsx(ProductProvider, { product, children: /* @__PURE__ */ jsxs(
    Link,
    {
      to: `/shop/${product.id}`,
      className: cn(
        "shrink-0! w-full max-w-40 md:max-w-96 bg-gray-50! rounded-md shadow border",
        className
      ),
      ...props,
      children: [
        /* @__PURE__ */ jsxs("div", { className: "relative h-32 md:h-64", children: [
          /* @__PURE__ */ jsx(ProductImage, { height: 100, className: "h-full w-full object-contain" }),
          /* @__PURE__ */ jsx(ProductDiscountTag, { className: "text-[10px]! md:text-xs! h-5! md:h-6! px-1! absolute! bottom-2 left-2!" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "px-3 py-2", children: [
          /* @__PURE__ */ jsx(
            Typography.Title,
            {
              level: 5,
              className: "leading-tight text-sm! md:text-lg! lg:text-xl! mb-2",
              ellipsis: { rows: 2 },
              children: product.name
            }
          ),
          /* @__PURE__ */ jsxs("h3", { className: "text-sm md:text-base lg:text-lg md:mt-2 text-purple-400 space-x-1", children: [
            /* @__PURE__ */ jsx(ProductDiscount, { className: "font-bold" }),
            /* @__PURE__ */ jsx(
              ProductPrice,
              {
                hidden: !product.discount,
                className: "text-xs md:text-sm font-medium text-foreground line-through"
              }
            )
          ] }),
          /* @__PURE__ */ jsx(
            AddToCartButton,
            {
              hidden: !showAddToCart,
              type: "primary",
              className: "w-full text-xs! h-7! md:h-9! md:text-sm! mt-3",
              children: "Add to Cart"
            }
          )
        ] })
      ]
    }
  ) }, product.id);
};
const FeaturedProducts = ({ products: products2 }) => {
  return /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center gap-10 container px-5 py-10", children: [
    /* @__PURE__ */ jsx(Typography.Title, { className: "text-3xl! text-center font-bold!", children: "Fall/Winter Essentials" }),
    /* @__PURE__ */ jsx("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 items-start", children: products2 == null ? void 0 : products2.map((product) => /* @__PURE__ */ jsx(ProductCard, { product }, product.id)) }),
    /* @__PURE__ */ jsx(Link, { to: "/shop", children: /* @__PURE__ */ jsx(Button, { icon: /* @__PURE__ */ jsx(ArrowRightOutlined, {}), iconPosition: "end", type: "primary", children: "View All" }) })
  ] });
};
const BannerSection = () => {
  return /* @__PURE__ */ jsxs("div", { className: "md:grid grid-cols-3 mx-auto max-w-6xl px-3 py-8 rounded-2xl overflow-hidden", children: [
    /* @__PURE__ */ jsx("div", { className: "h-64 md:h-auto bg-pink-400 overflow-hidden", children: /* @__PURE__ */ jsx(
      "img",
      {
        src: "//glotique.co/cdn/shop/files/image22.png?v=1706809837&width=1500",
        alt: "",
        srcSet: "//glotique.co/cdn/shop/files/image22.png?v=1706809837&width=165 165w, //glotique.co/cdn/shop/files/image22.png?v=1706809837&width=360 360w, //glotique.co/cdn/shop/files/image22.png?v=1706809837&width=535 535w, //glotique.co/cdn/shop/files/image22.png?v=1706809837&width=750 750w, //glotique.co/cdn/shop/files/image22.png?v=1706809837&width=1070 1070w, //glotique.co/cdn/shop/files/image22.png?v=1706809837&width=1500 1500w",
        width: "1500",
        height: "999",
        loading: "lazy",
        sizes: "(min-width: 1400px) 650px,\n              (min-width: 750px) calc((100vw - 130px) / 2), calc((100vw - 50px) / 2)",
        className: "object-cover w-full h-full"
      }
    ) }),
    /* @__PURE__ */ jsxs("div", { className: "md:col-span-2 space-y-4! bg-primary p-10 md:p-16 text-center md:text-left", children: [
      /* @__PURE__ */ jsx(Typography.Title, { className: "text-white!", children: "The Essence of Modern Beauty" }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx(Typography.Paragraph, { className: "text-gray-300!", children: "Dedicated to empowering beauty through modern fashion" }),
        /* @__PURE__ */ jsx(Typography.Paragraph, { className: "text-gray-300!", children: "Our quality-driven, trend-conscious collections amplified each woman's unique elegance." })
      ] }),
      /* @__PURE__ */ jsx(Link, { to: "/shop", className: "inline-block mt-5", children: /* @__PURE__ */ jsx(
        Button,
        {
          size: "large",
          icon: /* @__PURE__ */ jsx(ArrowRightOutlined, {}),
          iconPosition: "end",
          className: "px-5! font-bold!",
          children: "Shop Now"
        }
      ) })
    ] })
  ] });
};
const features = [
  {
    icon: TruckOutlined,
    heading: "Fast & Secured Shipping",
    subheading: "Your Style, Delivered with Speed and Confidence"
  },
  {
    icon: HeartOutlined,
    heading: "100% Satisfaction Guarantee",
    subheading: "Shop confidently knowing that you are getting the best in style & fit."
  },
  {
    icon: RollbackOutlined,
    heading: "Easy Returns",
    subheading: "Effortless Refunds for a Seamless Shopping Experience"
  },
  {
    icon: StarOutlined,
    heading: "Over 10,000 Glo Ups",
    subheading: "We've helpred over 10,000 girls feel & look their best with our products"
  }
];
const FeaturesSection = () => {
  return /* @__PURE__ */ jsxs("section", { className: "bg-neutral-100 py-10 px-4 space-y-12!", children: [
    /* @__PURE__ */ jsx(
      Typography.Title,
      {
        level: 3,
        className: "text-center md:text-3xl! font-extrabold!",
        children: "The Locstique Promise"
      }
    ),
    /* @__PURE__ */ jsx("div", { className: "grid sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto", children: features.map((feature, index2) => /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsxs(Space, { direction: "vertical", align: "center", children: [
      /* @__PURE__ */ jsx(feature.icon, { className: "text-6xl! text-purple-600!" }),
      /* @__PURE__ */ jsx(Typography.Title, { level: 3, className: "text-center font-bold", children: feature.heading }),
      /* @__PURE__ */ jsx(Typography.Paragraph, { className: "m-0! text-center", children: feature.subheading })
    ] }) }, index2)) })
  ] });
};
const settingsService = {
  async get(name) {
    const record = await db.query.settingsTable.findFirst({
      where: (t, fn) => fn.eq(t.name, name)
    });
    return record;
  },
  async set(name, value) {
    const result = await db.insert(settingsTable).values({ name, value }).onConflictDoUpdate({
      target: settingsTable.name,
      set: { value }
    }).returning();
    return result[0];
  }
};
const TEMP_DIR = path.join(process.cwd(), "storage/tmp");
const UPLOAD_DIR = path.join(process.cwd(), "public/uploads");
new LocalFileStorage(UPLOAD_DIR);
const uploadService = {
  async saveTemp(file) {
    const arrayBuffer = await file.arrayBuffer();
    const fileName = v7() + file.name;
    await fs.mkdir(TEMP_DIR, { recursive: true });
    const filePath = path.join(TEMP_DIR, fileName);
    await fs.writeFile(filePath, Buffer.from(arrayBuffer));
    return fileName;
  },
  async storeFile(file, folder = "") {
    try {
      const source = path.join(TEMP_DIR, file);
      const destination = path.join(UPLOAD_DIR, folder, file);
      await fs.access(source);
      await fs.mkdir(path.join(UPLOAD_DIR, folder), { recursive: true });
      await fs.rename(source, destination);
      return path.join(folder, file);
    } catch (err) {
      console.error("Error moving file:", err);
      return file;
    }
  },
  async deleteFile(filePath) {
    const sourcePath = path.join(UPLOAD_DIR, filePath);
    fs.unlink(sourcePath).catch((err) => {
      console.log("File does not exist");
    });
  }
};
const productService = {
  queryProducts: async (query) => {
    const size = (query == null ? void 0 : query.size) ? parseInt(query.size) : void 0;
    const page = (query == null ? void 0 : query.page) ? parseInt(query.page) : void 0;
    return await db.query.productsTable.findMany({
      where: (t, fn) => fn.and(
        (query == null ? void 0 : query.id) && fn.inArray(t.id, query.id),
        (query == null ? void 0 : query.name) && fn.ilike(t.name, query.name)
      ),
      limit: size,
      offset: page && size ? (page > 1 ? page - 1 : 1) * size : void 0,
      orderBy: (t, { desc }) => [desc(t.createdAt)]
    });
  },
  async findById(id) {
    return db.query.productsTable.findFirst({
      where: (t, fn) => fn.eq(t.id, id)
    });
  },
  async create(dto) {
    const images = [];
    for (const image of dto.images) {
      if (image) images.push(await uploadService.storeFile(image, "products"));
    }
    const result = await db.insert(productsTable).values({
      name: dto.name,
      discount: dto.discount,
      description: dto.description,
      details: dto.details,
      price: dto.price,
      stock: dto.stock,
      images,
      tag: dto.tag
    }).returning();
    return result[0];
  },
  async update(product, dto) {
    const images = [];
    const imagesToDelete = product.images.filter(
      (image) => !dto.images.includes(image)
    );
    for (const image of imagesToDelete) {
      await uploadService.deleteFile(image);
    }
    for (const image of dto.images) {
      images.push(await uploadService.storeFile(image, "products"));
    }
    const result = await db.update(productsTable).set({
      name: dto.name,
      discount: dto.discount,
      description: dto.description,
      details: dto.details,
      price: dto.price,
      stock: dto.stock,
      images,
      tag: dto.tag
    }).where(eq(productsTable.id, dto.id)).returning();
    return result[0];
  },
  async delete(product) {
    for (let image of product.images) {
      await uploadService.deleteFile(image);
    }
    await db.delete(productsTable).where(eq(productsTable.id, product.id));
  }
};
function meta$6({}) {
  return [{
    title: "Locstique | Your one stop fashion center."
  }, {
    name: "description",
    content: "Welcome to Locstique!"
  }];
}
async function loader$g({
  params
}) {
  const settings2 = await settingsService.get("home_page");
  const featuredProducts = await productService.queryProducts({
    size: 4
  });
  return {
    settings: (settings2 == null ? void 0 : settings2.value) ?? {},
    featuredProducts
  };
}
const index$1 = withComponentProps(function Home({
  loaderData
}) {
  return /* @__PURE__ */ jsxs(Fragment, {
    children: [/* @__PURE__ */ jsx(HeroSection, {
      data: loaderData.settings
    }), /* @__PURE__ */ jsx(FeaturedProducts, {
      products: loaderData.featuredProducts
    }), /* @__PURE__ */ jsx(BannerSection, {}), /* @__PURE__ */ jsx(FeaturesSection, {}), /* @__PURE__ */ jsxs("section", {
      className: "p-8 md:py-12 lg:py-16 text-center space-y-8 max-w-4xl mx-auto",
      children: [/* @__PURE__ */ jsx("h3", {
        className: "text-3xl md:text-4xl lg:text-5xl font-bold",
        children: "You Deserve the Best!"
      }), /* @__PURE__ */ jsxs("div", {
        className: "space-y-3 text-sm lg:text-base tracking-wide leading-7",
        children: [/* @__PURE__ */ jsxs("p", {
          children: ["We believe every woman ", /* @__PURE__ */ jsx("b", {
            children: "deserves to adorn herself"
          }), " most finely, reflecting her individuality and confidence."]
        }), /* @__PURE__ */ jsxs("p", {
          children: ["Our curated collection of women's wear is metculously crafted to offer you ", /* @__PURE__ */ jsx("b", {
            children: "the best in style, quality"
          }), ", and expression. Embrace the ", /* @__PURE__ */ jsx("b", {
            children: "luxury you deserve"
          }), " and ", /* @__PURE__ */ jsx("b", {
            children: "redefine"
          }), " your wardrobe with Locstique"]
        })]
      }), /* @__PURE__ */ jsx(Link, {
        to: "/shop",
        children: /* @__PURE__ */ jsx(Button, {
          className: "h-12! px-8!",
          type: "primary",
          children: "Explore our collection"
        })
      })]
    })]
  });
});
const route2 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: index$1,
  loader: loader$g,
  meta: meta$6
}, Symbol.toStringTag, { value: "Module" }));
const ProductsFilter = () => {
  const [form] = Form.useForm();
  return /* @__PURE__ */ jsxs(Flex, { style: { marginBottom: 10 }, align: "start", justify: "space-between", children: [
    /* @__PURE__ */ jsx(
      Popover,
      {
        placement: "bottomLeft",
        trigger: "click",
        title: /* @__PURE__ */ jsxs(Flex, { gap: 5, children: [
          /* @__PURE__ */ jsx(Typography.Title, { style: { flexGrow: 1 }, level: 5, children: "Filter & Sorting" }),
          /* @__PURE__ */ jsx(Button, { size: "small", type: "primary", children: "Apply" }),
          /* @__PURE__ */ jsx(Button, { size: "small", children: "Reset" })
        ] }),
        content: () => /* @__PURE__ */ jsxs(Form, { children: [
          /* @__PURE__ */ jsxs(Form.Item, { label: "Availability", children: [
            /* @__PURE__ */ jsx(Checkbox, { children: "In Stock" }),
            /* @__PURE__ */ jsx(Checkbox, { children: "Out of Stock" })
          ] }),
          /* @__PURE__ */ jsx(Form.Item, { label: "Price range", children: /* @__PURE__ */ jsxs(Space.Compact, { children: [
            /* @__PURE__ */ jsx(InputNumber, {}),
            /* @__PURE__ */ jsx(InputNumber, {})
          ] }) })
        ] }),
        children: /* @__PURE__ */ jsx(Button, { children: "Filter" })
      }
    ),
    /* @__PURE__ */ jsxs(Space, { children: [
      /* @__PURE__ */ jsx(Typography.Paragraph, { className: "hidden md:block m-0!", children: "Sort By:" }),
      /* @__PURE__ */ jsx(
        Select,
        {
          style: { width: 180 },
          placeholder: "Sort By",
          options: [
            { label: "Best Selling", value: "best_selling" },
            { label: "Alphabetical A-Z", value: "name_asc" },
            { label: "Alphabetical Z-A", value: "name_desc" },
            { label: "Price: Low to High", value: "price_asc" },
            { label: "Price: High to Low", value: "price_desc" },
            { label: "Oldest Product", value: "oldest" },
            { label: "Laest Products", value: "latest" }
          ]
        }
      )
    ] })
  ] });
};
function meta$5({}) {
  return [{
    title: "Locstique | Shop"
  }, {
    name: "description",
    content: "Welcome to Locstique!"
  }];
}
async function loader$f({
  params
}) {
  const products2 = await productService.queryProducts({
    size: 20
  });
  return {
    products: products2
  };
}
async function clientLoader$2({
  params,
  serverLoader
}) {
  return await serverLoader();
}
const shop = withComponentProps(function Page({
  loaderData
}) {
  return /* @__PURE__ */ jsxs("div", {
    className: "py-8 px-3 max-w-7xl mx-auto space-y-5",
    children: [/* @__PURE__ */ jsx(Typography.Title, {
      level: 1,
      className: "text-center mb-5!",
      children: "Best Sellers"
    }), /* @__PURE__ */ jsx(ProductsFilter, {}), /* @__PURE__ */ jsx("div", {
      className: "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-5 lg:gap-8 items-start",
      children: loaderData.products.map((product) => /* @__PURE__ */ jsx(ProductCard, {
        product,
        showAddToCart: true
      }, product.id))
    })]
  });
});
const HydrateFallback$1 = withHydrateFallbackProps(function HydrateFallback() {
  return /* @__PURE__ */ jsxs("div", {
    className: "py-8 px-3 max-w-7xl mx-auto space-y-5",
    children: [/* @__PURE__ */ jsx(Typography.Title, {
      level: 1,
      className: "text-center mb-5!",
      children: "Best Sellers"
    }), /* @__PURE__ */ jsx(ProductsFilter, {}), /* @__PURE__ */ jsx("div", {
      className: "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-5 lg:gap-8 items-start",
      children: Array(20).map((id) => /* @__PURE__ */ jsxs("div", {
        className: "",
        children: [/* @__PURE__ */ jsx(Skeleton.Image, {
          active: true
        }), /* @__PURE__ */ jsx(Skeleton, {
          active: true,
          paragraph: {
            rows: 2,
            style: {
              height: 20
            }
          }
        }), /* @__PURE__ */ jsxs(Space, {
          children: [/* @__PURE__ */ jsx(Skeleton.Button, {
            active: true
          }), /* @__PURE__ */ jsx(Skeleton.Button, {
            active: true
          })]
        }), /* @__PURE__ */ jsx(Skeleton.Button, {
          active: true,
          block: true
        })]
      }, id))
    })]
  });
});
const route3 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  HydrateFallback: HydrateFallback$1,
  clientLoader: clientLoader$2,
  default: shop,
  loader: loader$f,
  meta: meta$5
}, Symbol.toStringTag, { value: "Module" }));
z.object({
  user: z.string().nonempty({ message: "User is required" }),
  image: z.string().nonempty({ message: "Image is required" }),
  title: z.string().nonempty({ message: "Title is required" }),
  comment: z.string().nonempty({ message: "Comment is required" })
});
const reviewService = {
  async create(dto) {
    let imagePath = await uploadService.storeFile(dto.image, "reviews");
    const result = await db.insert(reviewsTable).values({
      title: dto.title,
      user: dto.user,
      comment: dto.comment,
      image: imagePath
    }).returning();
    return result[0];
  },
  async queryReviews(params) {
    const result = await db.query.reviewsTable.findMany({
      limit: params.limit
    });
    return result;
  },
  async findById(reviewId) {
    return await db.query.reviewsTable.findFirst({
      where: (t, fn) => fn.eq(t.id, reviewId)
    });
  },
  async deleteReview(review) {
    if (review) {
      await uploadService.deleteFile(review.image).catch((err) => console.log(err));
      await db.delete(reviewsTable).where(eq(reviewsTable.id, review.id));
    }
  }
};
function meta$4({
  params
}) {
  return [{
    title: `Locstique | ${params.id}`
  }, {
    name: "description",
    content: "Welcome to Locstique!"
  }];
}
async function loader$e({
  params
}) {
  const productId = params.id;
  const product = await productService.findById(productId);
  if (!product) throw data({
    message: "Product Not Found"
  }, 404);
  return {
    product,
    relatedProducts: await productService.queryProducts({
      size: 8
    }),
    reviews: await reviewService.queryReviews({})
  };
}
const shop_$id = withComponentProps(function Page2({
  loaderData: {
    product,
    relatedProducts,
    reviews: reviews2
  }
}) {
  const productImages = product.images.map((image) => getImageSrc(image));
  const [activeImage, setActiveImage] = useState(productImages[0]);
  useEffect(() => {
    setActiveImage(productImages[0]);
  }, [productImages]);
  return /* @__PURE__ */ jsxs(ProductProvider, {
    product,
    children: [/* @__PURE__ */ jsxs("div", {
      className: "max-w-6xl mx-auto px-4 py-8 md:space-y-16",
      children: [/* @__PURE__ */ jsxs("div", {
        className: "grid md:grid-cols-2 gap-8",
        children: [/* @__PURE__ */ jsxs("div", {
          children: [/* @__PURE__ */ jsx("img", {
            width: "100%",
            className: "object-contain h-[250px]! md:h-[400px]!",
            src: activeImage
          }), /* @__PURE__ */ jsx("div", {
            className: "flex justify-center overflow-x-auto gap-2",
            children: productImages.map((image) => /* @__PURE__ */ jsx(Button, {
              htmlType: "button",
              className: "size-12! border shrink-0! p-0.5!",
              onClick: () => setActiveImage(image),
              children: /* @__PURE__ */ jsx("img", {
                src: image
              })
            }, image))
          })]
        }), /* @__PURE__ */ jsxs("div", {
          className: "space-y-5!",
          children: [/* @__PURE__ */ jsx(Tag, {
            color: "red",
            className: "font-semibold! py-1.5! text-sm!",
            children: /* @__PURE__ */ jsx(ProductTag, {})
          }), /* @__PURE__ */ jsx(Typography.Title, {
            className: "text-3xl! lg:text-4xl! font-bold! mb-6!",
            children: /* @__PURE__ */ jsx(ProductTitle, {})
          }), /* @__PURE__ */ jsxs("div", {
            className: "inline-flex items-center gap-4",
            children: [/* @__PURE__ */ jsxs(Typography.Title, {
              className: "text-xl! font-bold text-purple-400! space-x-1",
              children: [/* @__PURE__ */ jsx(ProductDiscount, {}), /* @__PURE__ */ jsx(ProductPrice, {
                hidden: !product.discount,
                className: "text-foreground line-through text-base!"
              })]
            }), /* @__PURE__ */ jsx(ProductDiscountTag, {
              className: ""
            })]
          }), /* @__PURE__ */ jsx(ProductDescription, {
            className: "prose prose-sm leading-7"
          }), /* @__PURE__ */ jsx(AddToCartButton, {
            className: "w-full h-12! uppercase font-bold!",
            type: "primary",
            children: "Add To Cart"
          }), /* @__PURE__ */ jsx(Collapse, {
            expandIconPosition: "end",
            items: [{
              key: "trial",
              label: /* @__PURE__ */ jsxs(Space, {
                align: "center",
                children: [/* @__PURE__ */ jsx(RollbackOutlined, {
                  className: "text-lg!"
                }), /* @__PURE__ */ jsx(Typography.Text, {
                  className: "text-base! font-bold",
                  children: "30 Days Risk Free Trial"
                })]
              }),
              children: /* @__PURE__ */ jsx("div", {
                children: "Try it out & if it doesn't fit or you don't like it you can just ship it back for a replacement or refund within 30 days"
              })
            }]
          })]
        })]
      }), /* @__PURE__ */ jsx(ProductDetails, {
        className: "text-center space-y-4 text-sm leading-7 mt-8 max-w-3xl mx-auto prose-sm"
      })]
    }), /* @__PURE__ */ jsxs("div", {
      className: "max-w-7xl mx-auto px-4",
      children: [/* @__PURE__ */ jsx("h3", {
        className: "text-2xl font-bold mb-4 md:mb-8",
        children: "More Products"
      }), /* @__PURE__ */ jsx("div", {
        className: "flex overflow-x-auto gap-3 pb-3",
        children: relatedProducts == null ? void 0 : relatedProducts.map((product2) => /* @__PURE__ */ jsx(ProductCard, {
          className: "md:max-w-60",
          product: product2
        }, product2.id))
      })]
    }), /* @__PURE__ */ jsx("div", {
      className: "my-4",
      children: /* @__PURE__ */ jsxs("section", {
        className: "bg-primary p-8 md:py-16",
        children: [/* @__PURE__ */ jsx("h3", {
          className: "text-white text-2xl font-bold text-center md:mb-8",
          children: "Why Buy From Us?"
        }), /* @__PURE__ */ jsxs("div", {
          className: "divide-y divide-gray-800 md:divide-y-0 gap-8 flex overflow-auto md:grid grid-cols-3 max-w-6xl mx-auto",
          children: [/* @__PURE__ */ jsxs("div", {
            className: "text-center gap-3 flex flex-col items-center py-6 min-w-64",
            children: [/* @__PURE__ */ jsx("img", {
              src: "/why_01.png",
              width: 80,
              height: 80
            }), /* @__PURE__ */ jsx("h3", {
              className: "text-white font-bold text-xl",
              children: "Natural Ingredients"
            }), /* @__PURE__ */ jsx("p", {
              className: "text-sm text-gray-200",
              children: "At Locstique we create all our products with carefully selected hypoallergenic and natural ingredients."
            })]
          }), /* @__PURE__ */ jsxs("div", {
            className: "text-center gap-3 flex flex-col items-center py-6 min-w-64",
            children: [/* @__PURE__ */ jsx("img", {
              src: "/why_02.png",
              width: 80,
              height: 80
            }), /* @__PURE__ */ jsx("h3", {
              className: "text-white font-bold text-xl",
              children: "Crafted With Love"
            }), /* @__PURE__ */ jsx("p", {
              className: "text-sm text-gray-200",
              children: "From premium ingredients to thoughtful formulas, our brand is dedicated to delivering an extraordinary experience."
            })]
          }), /* @__PURE__ */ jsxs("div", {
            className: "text-center gap-3 flex flex-col items-center py-6 min-w-64",
            children: [/* @__PURE__ */ jsx("img", {
              src: "/why_03.png",
              width: 80,
              height: 80
            }), /* @__PURE__ */ jsx("h3", {
              className: "text-white font-bold text-xl",
              children: "We're Here For You"
            }), /* @__PURE__ */ jsx("p", {
              className: "text-sm text-gray-200",
              children: "Our support staff is here to help 7 days a week with returns, refunds, or any questions."
            })]
          })]
        })]
      })
    }), /* @__PURE__ */ jsxs("div", {
      className: "fixed z-50 bottom-0 left-0 bg-white w-screen px-4 py-2 md:px-16 border-t flex items-center justify-between gap-4",
      children: [/* @__PURE__ */ jsxs("div", {
        className: "",
        children: [/* @__PURE__ */ jsx(Typography.Title, {
          ellipsis: {
            rows: 2
          },
          className: "leading-4 text-sm! md:text-lg! font-black!",
          children: /* @__PURE__ */ jsx(ProductTitle, {})
        }), /* @__PURE__ */ jsxs("div", {
          className: "flex items-center gap-2 mt-2",
          children: [/* @__PURE__ */ jsxs("h3", {
            className: "text-xs md:text-lg font-bold text-purple-400 space-x-1",
            children: [/* @__PURE__ */ jsx(ProductDiscount, {}), /* @__PURE__ */ jsx(ProductPrice, {
              hidden: !product.discount,
              className: "text-foreground line-through"
            })]
          }), /* @__PURE__ */ jsx(ProductDiscountTag, {
            className: "text-[9px]! h-4! px-1!"
          })]
        })]
      }), /* @__PURE__ */ jsx("div", {
        className: "",
        children: /* @__PURE__ */ jsx(AddToCartButton, {
          className: "text-xs! px-2! h-7! md:px-4! md:h-9!",
          type: "primary",
          children: "Add to Cart"
        })
      })]
    }), /* @__PURE__ */ jsxs("div", {
      className: "flex justify-center flex-col gap-5 w-full max-w-6xl mx-auto px-4 py-8",
      children: [/* @__PURE__ */ jsx(Typography.Title, {
        level: 3,
        className: "text-center font-black",
        children: "Try It Out Risk-Free For 30 Days 💜"
      }), /* @__PURE__ */ jsx(Row, {
        gutter: [24, 24],
        children: reviews2 == null ? void 0 : reviews2.map((el) => /* @__PURE__ */ jsx(Col, {
          span: 24,
          md: 8,
          className: "text-center",
          children: /* @__PURE__ */ jsxs(Space, {
            direction: "vertical",
            align: "center",
            children: [/* @__PURE__ */ jsx(Avatar, {
              size: "large",
              src: getImageSrc(el.image)
            }), /* @__PURE__ */ jsx(Typography.Title, {
              level: 5,
              children: el.title
            }), /* @__PURE__ */ jsx(Typography.Paragraph, {
              className: "text-xs m-0!",
              children: el.comment
            }), /* @__PURE__ */ jsx(Typography.Title, {
              level: 5,
              className: "m-0 text-xs",
              children: el.user
            })]
          })
        }, el.id))
      })]
    })]
  });
});
const route4 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: shop_$id,
  loader: loader$e,
  meta: meta$4
}, Symbol.toStringTag, { value: "Module" }));
function meta$3({
  params
}) {
  return [{
    title: `Locstique | ${params.page}`
  }];
}
async function loader$d({
  params
}) {
  const settings2 = await settingsService.get(params.page);
  if (!settings2) throw data({
    message: "Product Not Found"
  }, 404);
  return {
    page: settings2.value
  };
}
const showPage = withComponentProps(function Page3({
  loaderData: {
    page
  }
}) {
  return /* @__PURE__ */ jsxs("div", {
    className: "max-w-3xl mx-auto px-4 py-8 leading-8",
    children: [/* @__PURE__ */ jsx("h1", {
      className: "text-3xl md:text-4xl font-bold mb-8",
      children: page == null ? void 0 : page.title
    }), /* @__PURE__ */ jsx("div", {
      className: "",
      dangerouslySetInnerHTML: {
        __html: page == null ? void 0 : page.content
      }
    })]
  });
});
const route5 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: showPage,
  loader: loader$d,
  meta: meta$3
}, Symbol.toStringTag, { value: "Module" }));
function meta$2({}) {
  return [{
    title: "Locstique | Contact Us"
  }];
}
async function loader$c({
  params
}) {
  const settings2 = await settingsService.get("home_page");
  const featuredProducts = await productService.queryProducts({
    size: 4
  });
  return {
    settings: (settings2 == null ? void 0 : settings2.value) ?? {},
    featuredProducts
  };
}
async function action$9({
  request
}) {
  const data2 = await request.json();
  const schema2 = z.object({
    name: z.string().optional(),
    email: z.string().email(),
    phone: z.string().optional(),
    comment: z.string().min(5)
  });
  const validated = await validateSchema(schema2, data2);
  if (validated.errors) {
    return {
      errors: validated.errors
    };
  }
  await db.insert(feedbacksTable).values({
    name: validated.data.name,
    email: validated.data.email,
    phone: validated.data.phone,
    comment: validated.data.comment
  });
  return {
    success: true
  };
}
const contact = withComponentProps(function Home2({
  loaderData
}) {
  const [form] = Form.useForm();
  const fetcher = useFetcher();
  useEffect(() => {
    var _a, _b;
    setFieldErrors(form, (_a = fetcher.data) == null ? void 0 : _a.errors);
    if ((_b = fetcher.data) == null ? void 0 : _b.success) {
      Modal.success({
        title: "Message Sent",
        content: /* @__PURE__ */ jsxs("div", {
          children: [/* @__PURE__ */ jsx(Typography.Paragraph, {
            children: "Your message has been sent successfully!, We will get in touch as soon as possible if need be."
          }), /* @__PURE__ */ jsx(Typography.Paragraph, {
            children: "Have a nice day."
          })]
        })
      });
      form.resetFields();
    }
  }, [fetcher.data]);
  return /* @__PURE__ */ jsxs("div", {
    className: "max-w-2xl mx-auto space-y-5 px-4 py-16",
    children: [/* @__PURE__ */ jsx(Typography.Title, {
      level: 4,
      className: "text-2xl font-bold text-center",
      children: "Get in Touch. We're Here to Help!"
    }), /* @__PURE__ */ jsxs(Typography.Paragraph, {
      className: " text-gray-500! text-center",
      children: ["At ", config.appName, ", your satisfaction is our top priority. We encourage you to reach out with any questions, concerns, or feedback, as our dedicated team is always eager to assist you. Whether you need help with product inquiries or simply want to share your experience with us, we're just a message away.", " "]
    }), /* @__PURE__ */ jsxs(Form, {
      form,
      onFinish: (v) => fetcher.submit(v, {
        method: "POST",
        encType: "application/json"
      }),
      children: [/* @__PURE__ */ jsxs(Row, {
        gutter: 12,
        children: [/* @__PURE__ */ jsx(Col, {
          span: 24,
          md: 12,
          children: /* @__PURE__ */ jsx(Form.Item, {
            name: "name",
            rules: [{
              required: true
            }],
            children: /* @__PURE__ */ jsx(Input, {
              placeholder: "Full Name"
            })
          })
        }), /* @__PURE__ */ jsx(Col, {
          span: 24,
          md: 12,
          children: /* @__PURE__ */ jsx(Form.Item, {
            name: "email",
            rules: [{
              required: true
            }],
            children: /* @__PURE__ */ jsx(Input, {
              type: "email",
              placeholder: "Email Address"
            })
          })
        })]
      }), /* @__PURE__ */ jsx(Form.Item, {
        name: "phone",
        rules: [{
          required: true
        }],
        children: /* @__PURE__ */ jsx(Input, {
          type: "tel",
          placeholder: "Phone Number"
        })
      }), /* @__PURE__ */ jsx(Form.Item, {
        name: "comment",
        rules: [{
          required: true
        }],
        children: /* @__PURE__ */ jsx(Input.TextArea, {
          placeholder: "Message"
        })
      }), /* @__PURE__ */ jsxs(Button, {
        loading: fetcher.state != "idle",
        type: "primary",
        htmlType: "submit",
        children: ["Send Comment ", /* @__PURE__ */ jsx(SendOutlined, {})]
      })]
    })]
  });
});
const route6 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  action: action$9,
  default: contact,
  loader: loader$c,
  meta: meta$2
}, Symbol.toStringTag, { value: "Module" }));
function CheckoutFallback() {
  return /* @__PURE__ */ jsxs(Row, { gutter: [24, 24], className: "p-3 max-w-6xl mx-auto! mb-12!", children: [
    /* @__PURE__ */ jsx(Col, { span: 24, md: 16, children: /* @__PURE__ */ jsxs(Space, { direction: "vertical", size: "large", className: "w-full", children: [
      /* @__PURE__ */ jsx(Card, { children: /* @__PURE__ */ jsx(
        List,
        {
          dataSource: [1, 2],
          renderItem: () => /* @__PURE__ */ jsx(Skeleton, { avatar: true, paragraph: { rows: 2 }, loading: true })
        }
      ) }),
      /* @__PURE__ */ jsx(Card, { children: /* @__PURE__ */ jsx(Skeleton.Input, { className: "w-full! h-16!" }) })
    ] }) }),
    /* @__PURE__ */ jsx(Col, { span: 24, md: 8, children: /* @__PURE__ */ jsxs(Card, { children: [
      /* @__PURE__ */ jsx(Skeleton, { loading: true, paragraph: true }),
      /* @__PURE__ */ jsx(Skeleton.Button, { className: "w-full! mt-4" })
    ] }) })
  ] });
}
const CheckoutSummary = ({ loading }) => {
  const { items } = useLoaderData();
  const totalItems = items.reduce((prev, cur) => prev + cur.quantity, 0);
  const deliveryFee = 0;
  const discountAmount = items.reduce(
    (cum, item) => cum + (item.price - calculateDiscount(item.price, item.discount)) * item.quantity,
    0
  );
  const totalAmount = items.reduce(
    (acc, item) => acc + item.quantity * item.price,
    0
  );
  const total = deliveryFee + totalAmount - discountAmount;
  const discountPercentage = discountAmount / totalAmount * 100;
  return /* @__PURE__ */ jsxs(Card, { title: "Order Summary", className: "bg-gray-50!", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex justify-between", children: [
      /* @__PURE__ */ jsxs("p", { children: [
        "Item's Total",
        " (",
        totalItems,
        ")"
      ] }),
      /* @__PURE__ */ jsx(PriceFormat, { value: totalAmount })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex justify-between", children: [
      /* @__PURE__ */ jsx("p", { children: "Delivery Fee" }),
      /* @__PURE__ */ jsx(PriceFormat, { value: deliveryFee })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex justify-between", children: [
      /* @__PURE__ */ jsxs("p", { children: [
        "Discount(",
        /* @__PURE__ */ jsx(
          PriceFormat,
          {
            prefix: "",
            suffix: "%",
            decimalScale: 0,
            value: discountPercentage
          }
        ),
        ")"
      ] }),
      /* @__PURE__ */ jsx(PriceFormat, { value: discountAmount })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex justify-between border-t pt-3", children: [
      /* @__PURE__ */ jsx("p", { className: "font-bold", children: "Total" }),
      /* @__PURE__ */ jsx(PriceFormat, { value: total })
    ] }),
    /* @__PURE__ */ jsx(
      Button,
      {
        className: "w-full mt-8",
        loading,
        htmlType: "submit",
        size: "large",
        type: "primary",
        children: "Checkout"
      }
    )
  ] });
};
const CheckoutItems = () => {
  const { items } = useLoaderData();
  return /* @__PURE__ */ jsxs(Space, { direction: "vertical", size: "large", className: "w-full", children: [
    /* @__PURE__ */ jsx(
      Card,
      {
        title: "Cart Items",
        className: "bg-gray-50!",
        classNames: { body: "p-0!" },
        children: /* @__PURE__ */ jsx(
          List,
          {
            size: "small",
            dataSource: items,
            renderItem: (item, index2) => /* @__PURE__ */ jsx(List.Item, { children: /* @__PURE__ */ jsx(
              List.Item.Meta,
              {
                avatar: /* @__PURE__ */ jsx(
                  Avatar,
                  {
                    src: getImageSrc(item.image),
                    shape: "square",
                    size: "large"
                  }
                ),
                title: item.name,
                description: /* @__PURE__ */ jsxs("p", { children: [
                  "QTY: ",
                  item.quantity
                ] })
              }
            ) })
          }
        )
      }
    ),
    /* @__PURE__ */ jsx(Card, { className: "bg-gray-50!", title: "Delivery Address", children: /* @__PURE__ */ jsx(Form.Item, { name: "address", rules: [{ required: true }], children: /* @__PURE__ */ jsx(Input.TextArea, { placeholder: "Enter delivery address" }) }) })
  ] });
};
const orderService = {
  async findById(orderId) {
    return db.query.ordersTable.findFirst({
      where: eq(ordersTable.id, orderId),
      with: { items: { with: { product: true } } }
    });
  },
  async markAsPaid(orderId, transactionId) {
    await db.update(ordersTable).set({
      status: OrderStatus.PENDING_DELIVERY,
      transactionId
    }).where(eq(ordersTable.id, orderId));
  },
  async markAsDelivered(orderId) {
    await db.update(ordersTable).set({
      status: OrderStatus.DELIVERED
    }).where(eq(ordersTable.id, orderId));
  },
  async markAsUnpaid(orderId) {
    await db.update(ordersTable).set({
      status: OrderStatus.PENDING_PAYMENT
    }).where(eq(ordersTable.id, orderId)).returning();
  },
  async addItem(orderId, dto) {
    let result = await db.insert(productOrderTable).values({
      orderId,
      ...dto
    }).returning();
    return result[0];
  },
  async queryOrders(query) {
    const size = (query == null ? void 0 : query.size) ? parseInt(query.size) : void 0;
    const page = (query == null ? void 0 : query.page) ? parseInt(query.page) : void 0;
    return await db.query.ordersTable.findMany({
      limit: size,
      offset: page && size ? (page > 1 ? page - 1 : 1) * size : void 0,
      orderBy: (t, { desc }) => [desc(t.createdAt)]
    });
  }
};
const transporter = createTransport({
  host: process.env.MAIL_HOST,
  port: Number(process.env.MAIL_PORT),
  secure: true,
  auth: {
    user: process.env.MAIL_USERNAME,
    pass: process.env.MAIL_PASSWORD
  }
});
const mailService = {
  async sendMail(to, subject, html) {
    const info = await transporter.sendMail({
      from: `"${process.env.APP_NAME}" <${process.env.MAIL_USERNAME}>`,
      to,
      subject,
      html
    });
    return info;
  }
};
function paymentSuccessfulTemplate(customerName, amount, transactionId, transactionDate) {
  return `
  <!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Payment Successful</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      font-family: Arial, sans-serif;
      background-color: #f4f4f4;
    }
    .email-container {
      max-width: 600px;
      margin: auto;
      background-color: #ffffff;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 0 10px rgba(0,0,0,0.05);
    }
    .header {
      background-color: #4CAF50;
      color: white;
      text-align: center;
      padding: 20px;
    }
    .content {
      padding: 30px;
      text-align: left;
      color: #333;
    }
    .content h2 {
      margin-top: 0;
    }
    .footer {
      background-color: #eeeeee;
      text-align: center;
      padding: 15px;
      font-size: 12px;
      color: #777;
    }
    @media only screen and (max-width: 600px) {
      .content, .header, .footer {
        padding: 20px;
      }
    }
  </style>
</head>
<body>

  <div class="email-container">
    <div class="header">
      <h1>Payment Successful</h1>
    </div>

    <div class="content">
      <h2>Hi ${customerName},</h2>
      <p>Thank you for your payment! We're happy to confirm that we've received your payment of <strong>$${amount}</strong>.</p>
      <p><strong>Transaction ID:</strong> ${transactionId}</p>
      <p><strong>Date:</strong> ${transactionDate}</p>
      <p>If you have any questions, feel free to contact our support team.</p>
      <p>Thank you for your business!</p>
      <p>Best regards,<br>The ${process.env.APP_NAME} Team</p>
    </div>

    <div class="footer">
      &copy; ${(/* @__PURE__ */ new Date()).getFullYear()} ${process.env.APP_NAME}. All rights reserved.
    </div>
  </div>

</body>
</html>

  `;
}
const paymentService = {
  async makePayment(user, requestData) {
    var _a, _b;
    try {
      const items = requestData.items;
      const products2 = [];
      for (const item of items) {
        const product = await productService.findById(item.id);
        if (product) products2.push({ ...product, quantity: item.quantity });
      }
      const deliveryAddress = requestData.address;
      const totalAmount = products2.reduce(
        (cum, product) => cum + product.quantity * calculateDiscount(product.price, product.discount),
        0
      );
      const txResponse = await db.transaction(async (tx) => {
        var _a2, _b2, _c;
        const order = (await tx.insert(ordersTable).values({
          userId: user.id,
          status: OrderStatus.PENDING_PAYMENT,
          deliveryAddress
        }).returning())[0];
        for (const item of items) {
          const product = await productService.findById(item.id);
          if (product) {
            await tx.insert(productOrderTable).values({
              orderId: order.id,
              productId: product.id,
              price: product.price,
              quantity: item.quantity,
              discount: product.discount
            });
          }
        }
        if (!order) {
          return { success: false };
        }
        const settings2 = await settingsService.get("payment");
        if (!(settings2 == null ? void 0 : settings2.value)) {
          return { success: false };
        }
        const response = await fetch(
          "https://api.flutterwave.com/v3/payments",
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${((_a2 = settings2 == null ? void 0 : settings2.value) == null ? void 0 : _a2.secret_key) ?? process.env.FLW_SECRET_KEY}`,
              "Content-Type": "application/json"
              // Tells the server you're sending JSON
            },
            body: JSON.stringify({
              tx_ref: order.id,
              // tx_ref: generateUnqueString("TRX"),
              amount: totalAmount,
              currency: ((_b2 = settings2 == null ? void 0 : settings2.value) == null ? void 0 : _b2.currency) ?? "USD",
              redirect_url: (_c = settings2 == null ? void 0 : settings2.value) == null ? void 0 : _c.redirect_url,
              customer: {
                email: user.email,
                name: user.name,
                phonenumber: "09011223344"
              },
              customizations: {
                title: process.env.APP_NAME
              }
            })
          }
        );
        return await response.json();
      });
      if ((txResponse == null ? void 0 : txResponse.status) === "success") {
        return { redirectUrl: txResponse.data.link, success: true };
      }
      console.log(txResponse);
      return { success: false, error: (_b = (_a = txResponse == null ? void 0 : txResponse.errors) == null ? void 0 : _a[0]) == null ? void 0 : _b.message };
    } catch (error) {
      return { success: false };
    }
  },
  async verifyPayment(user, requestData) {
    var _a;
    const txRef = requestData.txRef;
    const transactionId = requestData.transactionId;
    if (!txRef || !transactionId) {
      return { success: false };
    }
    const order = await orderService.findById(txRef);
    if (!order) {
      return { success: false };
    }
    const settings2 = await settingsService.get("payment");
    if (!(settings2 == null ? void 0 : settings2.value)) {
      return { success: false };
    }
    const response = await fetch(
      `https://api.flutterwave.com/v3/transactions/${transactionId}/verify`,
      {
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${((_a = settings2 == null ? void 0 : settings2.value) == null ? void 0 : _a.secret_key) ?? process.env.FLW_SECRET_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );
    const totalAmount = order.items.reduce(
      (cur, item) => cur + item.quantity * calculateDiscount(item.price, item.discount),
      0
    );
    const data2 = await response.json();
    if (data2.status === "success" && data2.data.status === "successful" && data2.data.charged_amount >= Math.round(totalAmount * 100) / 100) {
      await orderService.markAsPaid(data2.data.tx_ref, transactionId);
      if (order.status === OrderStatus.PENDING_PAYMENT) {
        await mailService.sendMail(
          user.email,
          "Payment Successful",
          paymentSuccessfulTemplate(
            user.name,
            totalAmount,
            transactionId,
            order.createdAt.toDateString()
          )
        );
      }
      return { success: true };
    }
    return { success: false };
  },
  async verifyOrderPayment(order) {
    try {
      if (order.status === OrderStatus.PENDING_DELIVERY) {
        const response = await fetch(
          `https://api.flutterwave.com/v3/transactions/${order.transactionId}/verify`,
          {
            headers: {
              accept: "application/json",
              Authorization: `Bearer ${process.env.FLW_SECRET_KEY}`,
              "Content-Type": "application/json"
            }
          }
        );
        const responseData = await response.json();
        if (responseData.status === "error" && responseData.data === null) {
          await orderService.markAsUnpaid(order.id);
        } else {
          const totalAmount = order.items.reduce(
            (cur, item) => cur + item.quantity * calculateDiscount(item.price, item.discount),
            0
          );
          if (totalAmount && responseData.data.charged_amount < Number(totalAmount.toFixed(2))) {
            await orderService.markAsUnpaid(order.id);
          }
        }
        const validatedOrder = await db.query.ordersTable.findFirst({
          where: (t, fn) => fn.eq(t.id, order.id),
          with: { items: { with: { product: true } } }
        });
        return { success: true, data: validatedOrder };
      }
    } catch (error) {
      return { success: false };
    }
  }
};
async function clientLoader$1({
  params
}) {
  const itemsJson = localStorage.getItem(config.storage.cartName);
  if (itemsJson) {
    const items = JSON.parse(itemsJson);
    if (items.length > 0) return {
      items
    };
  }
  return redirect("/shop");
}
async function action$8({
  request
}) {
  const formData = await request.formData();
  const items = JSON.parse(formData.get("items") ?? "[]");
  const address = formData.get("address");
  const session = await getSession(request.headers.get("Cookie"));
  const sessionId = session.get("userId");
  if (sessionId) {
    const result = await sessionService.validateSessionToken(sessionId);
    if (result.user) {
      const response = await paymentService.makePayment(result.user, {
        items,
        address
      });
      if (response.redirectUrl) {
        return redirect(response.redirectUrl);
      }
      return {
        message: (response == null ? void 0 : response.error) ?? "Unable to perform action"
      };
    }
  }
  return redirect(`/login?redirect_url=${request.url}`);
}
const checkout = withComponentProps(function Page4({
  loaderData: {
    items
  }
}) {
  const fetcher = useFetcher();
  const loading = fetcher.state !== "idle";
  function handleCheckout(values) {
    fetcher.submit({
      ...values,
      items: JSON.stringify(items.map((item) => ({
        id: item.id,
        quantity: item.quantity
      })))
    }, {
      method: "POST"
    });
  }
  useEffect(() => {
    var _a;
    if ((_a = fetcher.data) == null ? void 0 : _a.message) {
      message.error(fetcher.data.message);
    }
  }, [fetcher.data]);
  return /* @__PURE__ */ jsx(Form, {
    onFinish: handleCheckout,
    children: /* @__PURE__ */ jsxs(Row, {
      gutter: [24, 24],
      className: "p-3 max-w-6xl mx-auto!",
      children: [/* @__PURE__ */ jsx(Col, {
        span: 24,
        md: 16,
        children: /* @__PURE__ */ jsx(CheckoutItems, {})
      }), /* @__PURE__ */ jsx(Col, {
        span: 24,
        md: 8,
        children: /* @__PURE__ */ jsx(CheckoutSummary, {
          loading
        })
      })]
    })
  });
});
const HydrateFallback2 = withHydrateFallbackProps(function HydrateFallback3() {
  return /* @__PURE__ */ jsx(CheckoutFallback, {});
});
const route7 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  HydrateFallback: HydrateFallback2,
  action: action$8,
  clientLoader: clientLoader$1,
  default: checkout
}, Symbol.toStringTag, { value: "Module" }));
async function loader$b({
  params
}) {
  const order = await orderService.findById(params.id);
  if (!order) {
    throw data({
      message: "Order not found"
    }, 404);
  }
  const response = await paymentService.verifyOrderPayment(order);
  if (response == null ? void 0 : response.success) {
    return {
      order: response.data
    };
  }
  return {
    order: {
      ...order,
      status: 0
    }
  };
}
const showOrder = withComponentProps(function Page5({
  loaderData
}) {
  const order = loaderData.order;
  const totalAmount = order == null ? void 0 : order.items.reduce((total, item) => total + item.price * item.quantity, 0);
  const totalItems = order.items.reduce((total, item) => item + item.quantity, 0);
  const deliveryFee = 0;
  const discountAmount = order.items.reduce((total, item) => total + (item.price - calculateDiscount(item.price, item.discount)), 0);
  const discountPercentage = discountAmount / totalAmount * 100;
  function displayStatus(status) {
    switch (status) {
      case OrderStatus.PENDING_PAYMENT:
        return /* @__PURE__ */ jsx(Tag, {
          color: "red",
          children: "PENDING PAYMENT"
        });
      case OrderStatus.PENDING_DELIVERY:
        return /* @__PURE__ */ jsx(Tag, {
          color: "blue",
          children: "PENDING DELIVERY"
        });
      case OrderStatus.DELIVERED:
        return /* @__PURE__ */ jsx(Tag, {
          color: "green",
          children: "DELIVERED"
        });
      default:
        return /* @__PURE__ */ jsx(Tag, {
          children: "UNKNOWN"
        });
    }
  }
  return /* @__PURE__ */ jsxs(Row, {
    gutter: [24, 24],
    className: "p-3 max-w-6xl! mx-auto!",
    children: [/* @__PURE__ */ jsx(Col, {
      span: 24,
      children: /* @__PURE__ */ jsx("h2", {
        className: "md:col-span-3 text-2xl font-bold",
        children: "Order Details"
      })
    }), /* @__PURE__ */ jsx(Col, {
      span: 24,
      md: 16,
      children: /* @__PURE__ */ jsxs(Space, {
        direction: "vertical",
        className: "w-full!",
        children: [/* @__PURE__ */ jsx(Card, {
          title: "Order Items",
          className: "bg-gray-50!",
          classNames: {
            body: "p-0!"
          },
          children: /* @__PURE__ */ jsx(List, {
            size: "small",
            dataSource: order.items,
            renderItem: (item, index2) => /* @__PURE__ */ jsx(List.Item, {
              children: /* @__PURE__ */ jsx(List.Item.Meta, {
                avatar: /* @__PURE__ */ jsx(Avatar, {
                  src: getImageSrc(item.product.images[0]),
                  shape: "square",
                  size: "large"
                }),
                title: item.product.name,
                description: /* @__PURE__ */ jsxs("p", {
                  children: ["QTY: ", item.quantity]
                })
              })
            })
          })
        }), /* @__PURE__ */ jsx(Card, {
          title: "Delivery Address",
          className: "bg-gray-50!",
          children: /* @__PURE__ */ jsx(Input.TextArea, {
            placeholder: "Enter delivery address",
            readOnly: true,
            disabled: true,
            value: order.deliveryAddress,
            name: "address"
          })
        })]
      })
    }), /* @__PURE__ */ jsx(Col, {
      span: 24,
      md: 8,
      children: /* @__PURE__ */ jsxs(Card, {
        title: "Order Summary",
        className: "bg-gray-50!",
        classNames: {
          body: "space-y-2"
        },
        children: [/* @__PURE__ */ jsxs("div", {
          className: "flex justify-between",
          children: [/* @__PURE__ */ jsxs("p", {
            children: ["Item's Total", " (", totalItems, ")"]
          }), /* @__PURE__ */ jsx(PriceFormat, {
            value: totalAmount
          })]
        }), /* @__PURE__ */ jsxs("div", {
          className: "flex justify-between",
          children: [/* @__PURE__ */ jsx("p", {
            children: "Delivery Fee"
          }), /* @__PURE__ */ jsx(PriceFormat, {
            value: deliveryFee
          })]
        }), /* @__PURE__ */ jsxs("div", {
          className: "flex justify-between",
          children: [/* @__PURE__ */ jsxs("p", {
            children: ["Discount(", discountPercentage.toFixed(1), "%)"]
          }), /* @__PURE__ */ jsx(PriceFormat, {
            value: discountAmount
          })]
        }), /* @__PURE__ */ jsxs("div", {
          className: "flex justify-between border-t pt-3 font-bold",
          children: [/* @__PURE__ */ jsx("p", {
            children: "Total"
          }), /* @__PURE__ */ jsx(PriceFormat, {
            value: totalAmount - discountAmount
          })]
        }), /* @__PURE__ */ jsxs("div", {
          className: "flex justify-between border-t pt-3",
          children: [/* @__PURE__ */ jsx("p", {
            className: "font-bold",
            children: "Status"
          }), /* @__PURE__ */ jsx("p", {
            className: "font-bold",
            children: displayStatus(order.status)
          })]
        })]
      })
    })]
  });
});
const route8 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: showOrder,
  loader: loader$b
}, Symbol.toStringTag, { value: "Module" }));
const userService = {
  async findByEmail(email) {
    const result = db.query.usersTable.findFirst({
      where: (t, fn) => fn.eq(t.email, email)
    });
    return result;
  },
  async findByType(type) {
    return db.query.usersTable.findMany({
      where: (t, fn) => fn.eq(t.type, type)
    });
  },
  async create(dto, type) {
    const result = await db.insert(usersTable).values({
      name: dto.name,
      email: dto.email,
      type,
      password: await argon2.hash(dto.password)
    }).returning();
    return result[0];
  }
};
async function loader$a({
  request
}) {
  const search = new URLSearchParams(request.url.split("?")[1]);
  const user = await userService.findByEmail("admin@test.com");
  const txRef = search.get("tx_ref");
  const transactionId = search.get("transaction_id");
  if (user) {
    if (txRef && transactionId) {
      const response = await paymentService.verifyPayment(user, {
        txRef,
        transactionId
      });
      if (response.success) {
        return {
          paymentStatus: OrderStatus.PENDING_DELIVERY,
          txRef: search.get("tx_ref")
        };
      }
    }
  }
  return {
    paymentStatus: OrderStatus.PENDING_PAYMENT
  };
}
async function clientLoader({
  request,
  serverLoader
}) {
  const cartItem = localStorage.getItem(config.storage.cartName);
  if (!cartItem) return redirect("/shop");
  const response = await serverLoader();
  if (response.paymentStatus === OrderStatus.PENDING_DELIVERY) {
    localStorage.removeItem(config.storage.cartName);
  }
  return response;
}
const checkout_payment_status = withComponentProps(function Page6({
  loaderData
}) {
  if (loaderData.paymentStatus === OrderStatus.PENDING_PAYMENT) {
    return /* @__PURE__ */ jsx("div", {
      className: "p-5",
      children: /* @__PURE__ */ jsx(Result, {
        status: "error",
        title: "Payment Failed",
        subTitle: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quos, dolores vitae nam eveniet odio asperiores",
        extra: /* @__PURE__ */ jsx(Link, {
          to: "/checkout",
          children: /* @__PURE__ */ jsx(Button, {
            danger: true,
            icon: /* @__PURE__ */ jsx(ReloadOutlined, {}),
            type: "primary",
            children: "Retry"
          })
        })
      })
    });
  }
  return /* @__PURE__ */ jsx("div", {
    className: "p-5",
    children: /* @__PURE__ */ jsx(Result, {
      status: "success",
      title: "Payment Sucessful",
      subTitle: /* @__PURE__ */ jsxs("div", {
        children: [/* @__PURE__ */ jsxs("p", {
          className: "text-xs text-center mt-5 text-gray-500",
          children: ["Your payment has been recieved and your order with ID:", " ", /* @__PURE__ */ jsx(Link, {
            to: `/orders/${loaderData.txRef}`,
            className: "font-medium hover:underline",
            children: loaderData.txRef
          }), " ", "is being processed."]
        }), /* @__PURE__ */ jsxs("p", {
          className: "text-xs text-center mt-5 text-gray-500",
          children: [" ", "Thank you for shopping with us."]
        })]
      }),
      extra: /* @__PURE__ */ jsx(Link, {
        to: "/shop",
        children: /* @__PURE__ */ jsx(Button, {
          icon: /* @__PURE__ */ jsx(ArrowRightOutlined, {}),
          iconPosition: "end",
          type: "primary",
          children: "Shop More"
        })
      })
    })
  });
});
const route9 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  clientLoader,
  default: checkout_payment_status,
  loader: loader$a
}, Symbol.toStringTag, { value: "Module" }));
z.object({
  name: z.string().trim().nonempty({ message: "Name is required" }).regex(/^[a-zA-Z]{3,}(?:\s[a-zA-Z]{3,})+$/, {
    message: "Enter full name (at least two words, each 3+ letters)"
  }),
  email: z.string().trim().nonempty({ message: "Email is required" }).email({ message: "Invalid email address" }).refine(
    async (value) => {
      const user = await userService.findByEmail(value);
      return user === void 0;
    },
    { message: "Email already exists" }
  ),
  password: z.string().trim().nonempty({ message: "Password is required" }).min(8, { message: "Password must be at least 8 characters" }),
  confirmPassword: z.string().trim().nonempty({ message: "Confirm password is required" }).min(8, { message: "Confirm password must be at least 8 characters" })
  // terms: z.literal("on", { message: "You must accept the Terms & Conditions" }),
}).refine((data2) => data2.password === data2.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"]
});
const loginSchema = z.object({
  email: z.string().trim().nonempty({ message: "Email is required" }).email({ message: "Invalid email address" }),
  password: z.string().trim().nonempty({ message: "Password is required" })
});
function meta$1({}) {
  return [{
    title: `${config.appName} | Login`
  }];
}
async function loader$9({
  request
}) {
  const session = await getSession(request.headers.get("Cookie"));
  if (session.has("userId")) {
    return redirect("/");
  }
}
async function action$7({
  request
}) {
  const formData = await request.formData();
  const validated = await validateSchema(loginSchema, Object.fromEntries(formData));
  if (validated.data) {
    const user = await userService.findByEmail(validated.data.email);
    if (user) {
      const isMatchedPassword = await verify(user.password, validated.data.password);
      if (isMatchedPassword) {
        const session = await getSession(request.headers.get("Cookie"));
        const sessionId = sessionService.generateSessionToken();
        const userSession = await sessionService.create(sessionId, user.id);
        session.set("userId", userSession.id);
        const searchParams = new URLSearchParams(request.url.split("?")[1]);
        const redirectUrl = searchParams.get("redirect_url") ?? "/";
        return redirect(redirectUrl, {
          headers: {
            "Set-Cookie": await commitSession(session)
          }
        });
      }
    }
  }
  return {
    error: "Incorrect email or password"
  };
}
const login = withComponentProps(function Page7(props) {
  const [searchParams] = useSearchParams();
  const fetcher = useFetcher();
  const pending = fetcher.state !== "idle";
  const [form] = Form.useForm();
  function handleSubmit(values) {
    fetcher.submit(values, {
      method: "POST"
    });
  }
  useEffect(() => {
    var _a;
    if ((_a = fetcher.data) == null ? void 0 : _a.error) {
      form.setFields([{
        name: "email",
        errors: [fetcher.data.error]
      }]);
    }
  }, [fetcher.data]);
  return /* @__PURE__ */ jsx("div", {
    className: "max-w-[400px] mx-auto py-8",
    children: /* @__PURE__ */ jsxs(Form, {
      form,
      size: "large",
      onFinish: handleSubmit,
      className: "w-full",
      children: [/* @__PURE__ */ jsx(Typography.Title, {
        level: 4,
        children: "Login"
      }), /* @__PURE__ */ jsx(Typography.Paragraph, {
        children: "Resume your activities."
      }), /* @__PURE__ */ jsx(Form.Item, {
        name: "email",
        rules: [{
          required: true
        }],
        children: /* @__PURE__ */ jsx(Input, {
          type: "email",
          placeholder: "Email address"
        })
      }), /* @__PURE__ */ jsx(Form.Item, {
        name: "password",
        rules: [{
          required: true
        }],
        children: /* @__PURE__ */ jsx(Input.Password, {
          placeholder: "Password"
        })
      }), /* @__PURE__ */ jsx(Button, {
        htmlType: "submit",
        type: "primary",
        className: "w-full",
        loading: pending,
        children: "Login"
      }), /* @__PURE__ */ jsx(Divider, {}), /* @__PURE__ */ jsx("div", {
        className: "",
        children: /* @__PURE__ */ jsxs("p", {
          children: ["Don't have an account? ", /* @__PURE__ */ jsx(Link, {
            to: `/register?redirect_url=${searchParams.get("redirect_url")}`,
            className: "text-blue-600!",
            children: "Sign Up"
          })]
        })
      })]
    })
  });
});
const route10 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  action: action$7,
  default: login,
  loader: loader$9,
  meta: meta$1
}, Symbol.toStringTag, { value: "Module" }));
function meta({}) {
  return [{
    title: `${config.appName} | Register`
  }];
}
const register = withComponentProps(function Page8(props) {
  const [searchParams] = useSearchParams();
  function handleSubmit() {
  }
  return /* @__PURE__ */ jsx("div", {
    className: "max-w-[400px] mx-auto py-8",
    children: /* @__PURE__ */ jsxs(Form, {
      size: "large",
      onFinish: handleSubmit,
      className: "w-full",
      children: [/* @__PURE__ */ jsx(Typography.Title, {
        level: 4,
        children: "Register"
      }), /* @__PURE__ */ jsx(Typography.Paragraph, {
        children: "Lets get you started."
      }), /* @__PURE__ */ jsx(Form.Item, {
        name: "name",
        children: /* @__PURE__ */ jsx(Input, {
          placeholder: "Full name: e.g: john doe"
        })
      }), /* @__PURE__ */ jsx(Form.Item, {
        name: "email",
        rules: [{
          required: true
        }],
        children: /* @__PURE__ */ jsx(Input, {
          type: "email",
          placeholder: "Email address"
        })
      }), /* @__PURE__ */ jsx(Form.Item, {
        name: "password",
        rules: [{
          required: true
        }],
        children: /* @__PURE__ */ jsx(Input.Password, {
          placeholder: "Password"
        })
      }), /* @__PURE__ */ jsx(Form.Item, {
        name: "confirmPassword",
        rules: [{
          required: true
        }],
        children: /* @__PURE__ */ jsx(Input.Password, {
          placeholder: "Confirm Password"
        })
      }), /* @__PURE__ */ jsx(Button, {
        htmlType: "submit",
        type: "primary",
        className: "w-full",
        children: "Register"
      }), /* @__PURE__ */ jsx(Divider, {}), /* @__PURE__ */ jsx("div", {
        className: "",
        children: /* @__PURE__ */ jsxs("p", {
          children: ["Already have an account? ", /* @__PURE__ */ jsx(Link, {
            to: `/login?redirect_url=${searchParams.get("redirect_url")}`,
            className: "text-blue-600!",
            children: "Sign In"
          })]
        })
      })]
    })
  });
});
const route11 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: register,
  meta
}, Symbol.toStringTag, { value: "Module" }));
async function action$6({
  request
}) {
  const session = await getSession(request.headers.get("Cookie"));
  const sessionId = session.get("userId");
  if (sessionId) {
    await sessionService.invalidate(sessionId);
    session.unset("userId");
  }
  return redirect("/", {
    headers: {
      "Set-Cookie": await commitSession(session)
    }
  });
}
const route12 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  action: action$6
}, Symbol.toStringTag, { value: "Module" }));
const Sidebar = ({ open }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const items = [
    {
      icon: /* @__PURE__ */ jsx(DashboardOutlined, {}),
      label: "Dashboard",
      key: "/dashboard"
    },
    {
      icon: /* @__PURE__ */ jsx(UnorderedListOutlined, {}),
      label: "Products",
      key: "/dashboard/products"
    },
    {
      icon: /* @__PURE__ */ jsx(TagsOutlined, {}),
      label: "Feedbacks",
      key: "/dashboard/feedbacks"
    },
    {
      icon: /* @__PURE__ */ jsx(ShoppingCartOutlined, {}),
      label: "Orders",
      key: "/dashboard/orders"
    },
    {
      icon: /* @__PURE__ */ jsx(UserOutlined, {}),
      label: "Customers",
      key: "/dashboard/customers"
    },
    {
      icon: /* @__PURE__ */ jsx(CommentOutlined, {}),
      label: "Reviews",
      key: "/dashboard/reviews"
    },
    {
      key: "/dashboard/settings/home_page",
      icon: /* @__PURE__ */ jsx(SettingOutlined, {}),
      label: "Settings",
      style: { marginTop: 100 }
    }
  ];
  return /* @__PURE__ */ jsx(
    Layout$1.Sider,
    {
      width: 256,
      className: cn(
        "fixed! top-0 z-50! bg-white! p-4 shadow h-screen md:static!",
        open ? "left-0" : "-left-[256px]"
      ),
      children: /* @__PURE__ */ jsxs("aside", { className: "h-full flex flex-col", children: [
        /* @__PURE__ */ jsx("div", { className: "p-3", children: /* @__PURE__ */ jsx(AppLogo, {}) }),
        /* @__PURE__ */ jsx("div", { className: "grow", children: /* @__PURE__ */ jsx(
          Menu,
          {
            onSelect: ({ key }) => navigate(key),
            defaultSelectedKeys: [location.pathname],
            theme: "light",
            mode: "inline",
            items
          }
        ) })
      ] })
    }
  );
};
async function loader$8({
  request
}) {
  const session = await getSession(request.headers.get("Cookie"));
  const sessionId = session.get("userId");
  if (sessionId) {
    const result = await sessionService.validateSessionToken(sessionId);
    if (result.user && result.session && result.user.type === UserType.ADMIN) {
      return result;
    }
  }
  return redirect("/login?redirect_url=" + request.url);
}
const layout = withComponentProps(function DashboardLayout() {
  const [open, setOpen] = useState(false);
  const navigation = useNavigation();
  useEffect(() => {
    setOpen(false);
  }, [navigation.location]);
  return /* @__PURE__ */ jsxs(Layout$1, {
    className: "h-screen! flex! max-w-screen! overflow-x-hidden!",
    children: [/* @__PURE__ */ jsx(Sidebar, {
      open
    }), /* @__PURE__ */ jsxs(Layout$1, {
      className: "h-full! max-w-full! overflow-x-hidden! overflow-y-auto!",
      children: [/* @__PURE__ */ jsx(Affix, {
        children: /* @__PURE__ */ jsxs(Layout$1.Header, {
          className: cn("shadow sticky top-0 z-10 bg-white! px-5! flex items-center justify-between"),
          children: [/* @__PURE__ */ jsx("div", {
            className: "flex items-center",
            children: /* @__PURE__ */ jsx(AppLogo, {
              className: "text-xl! md:hidden"
            })
          }), /* @__PURE__ */ jsxs("div", {
            className: "flex items-center gap-2",
            children: [/* @__PURE__ */ jsx(UserMenu, {}), /* @__PURE__ */ jsx(Button, {
              onClick: () => setOpen(!open),
              icon: /* @__PURE__ */ jsx(MenuUnfoldOutlined, {})
            })]
          })]
        })
      }), /* @__PURE__ */ jsx(Layout$1.Content, {
        className: cn("p-3 max-w-full!"),
        children: /* @__PURE__ */ jsx(Outlet, {})
      }), /* @__PURE__ */ jsx(Layout$1.Footer, {})]
    })]
  });
});
const route13 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: layout,
  loader: loader$8
}, Symbol.toStringTag, { value: "Module" }));
function SectionCards() {
  const { revenue, customersCount, productsCount } = useLoaderData();
  return /* @__PURE__ */ jsxs(Row, { gutter: [24, 8], children: [
    /* @__PURE__ */ jsx(Col, { span: 24, md: 8, children: /* @__PURE__ */ jsx(Card, { children: /* @__PURE__ */ jsx(
      Statistic,
      {
        title: "Total Revenue",
        valueRender: () => /* @__PURE__ */ jsx(PriceFormat, { value: revenue })
      }
    ) }) }),
    /* @__PURE__ */ jsx(Col, { span: 24, md: 8, children: /* @__PURE__ */ jsx(Card, { children: /* @__PURE__ */ jsx(Statistic, { title: "Total Customers", value: customersCount }) }) }),
    /* @__PURE__ */ jsx(Col, { span: 24, md: 8, children: /* @__PURE__ */ jsx(Card, { children: /* @__PURE__ */ jsx(Statistic, { title: "Total Products", value: productsCount }) }) })
  ] });
}
const chartData = [
  { date: "2024-04-01", desktop: 222 },
  { date: "2024-04-02", desktop: 97 },
  { date: "2024-04-03", desktop: 167 },
  { date: "2024-04-04", desktop: 242 },
  { date: "2024-04-05", desktop: 373 },
  { date: "2024-04-06", desktop: 301 },
  { date: "2024-04-07", desktop: 245 },
  { date: "2024-04-08", desktop: 409 },
  { date: "2024-04-09", desktop: 59 },
  { date: "2024-04-10", desktop: 261 },
  { date: "2024-04-11", desktop: 327 },
  { date: "2024-04-12", desktop: 292 },
  { date: "2024-04-13", desktop: 342 },
  { date: "2024-04-14", desktop: 137 },
  { date: "2024-04-15", desktop: 120 },
  { date: "2024-04-16", desktop: 138 },
  { date: "2024-04-17", desktop: 446 },
  { date: "2024-04-18", desktop: 364 },
  { date: "2024-04-19", desktop: 243 },
  { date: "2024-04-20", desktop: 89 },
  { date: "2024-04-21", desktop: 137 },
  { date: "2024-04-22", desktop: 224 },
  { date: "2024-04-23", desktop: 138 },
  { date: "2024-04-24", desktop: 387 },
  { date: "2024-04-25", desktop: 215 },
  { date: "2024-04-26", desktop: 75 },
  { date: "2024-04-27", desktop: 383 },
  { date: "2024-04-28", desktop: 122 },
  { date: "2024-04-29", desktop: 315 },
  { date: "2024-04-30", desktop: 454 },
  { date: "2024-05-01", desktop: 165 },
  { date: "2024-05-02", desktop: 293 },
  { date: "2024-05-03", desktop: 247 },
  { date: "2024-05-04", desktop: 385 },
  { date: "2024-05-05", desktop: 481 },
  { date: "2024-05-06", desktop: 498 },
  { date: "2024-05-07", desktop: 388 },
  { date: "2024-05-08", desktop: 149 },
  { date: "2024-05-09", desktop: 227 },
  { date: "2024-05-10", desktop: 293 },
  { date: "2024-05-11", desktop: 335 },
  { date: "2024-05-12", desktop: 197 },
  { date: "2024-05-13", desktop: 197 },
  { date: "2024-05-14", desktop: 448 },
  { date: "2024-05-15", desktop: 473 },
  { date: "2024-05-16", desktop: 338 },
  { date: "2024-05-17", desktop: 499 },
  { date: "2024-05-18", desktop: 315 },
  { date: "2024-05-19", desktop: 235 },
  { date: "2024-05-20", desktop: 177 },
  { date: "2024-05-21", desktop: 82 },
  { date: "2024-05-22", desktop: 81 },
  { date: "2024-05-23", desktop: 252 },
  { date: "2024-05-24", desktop: 294 },
  { date: "2024-05-25", desktop: 201 },
  { date: "2024-05-26", desktop: 213 },
  { date: "2024-05-27", desktop: 420 },
  { date: "2024-05-28", desktop: 233 },
  { date: "2024-05-29", desktop: 78 },
  { date: "2024-05-30", desktop: 340 },
  { date: "2024-05-31", desktop: 178 },
  { date: "2024-06-01", desktop: 178 },
  { date: "2024-06-02", desktop: 470 },
  { date: "2024-06-03", desktop: 103 },
  { date: "2024-06-04", desktop: 439 },
  { date: "2024-06-05", desktop: 88 },
  { date: "2024-06-06", desktop: 294 },
  { date: "2024-06-07", desktop: 323 },
  { date: "2024-06-08", desktop: 385 },
  { date: "2024-06-09", desktop: 438 },
  { date: "2024-06-10", desktop: 155 },
  { date: "2024-06-11", desktop: 92 },
  { date: "2024-06-12", desktop: 492 },
  { date: "2024-06-13", desktop: 81 },
  { date: "2024-06-14", desktop: 426 },
  { date: "2024-06-15", desktop: 307 },
  { date: "2024-06-16", desktop: 371 },
  { date: "2024-06-17", desktop: 475 },
  { date: "2024-06-18", desktop: 107 },
  { date: "2024-06-19", desktop: 341 },
  { date: "2024-06-20", desktop: 408 },
  { date: "2024-06-21", desktop: 169 },
  { date: "2024-06-22", desktop: 317 },
  { date: "2024-06-23", desktop: 480 },
  { date: "2024-06-24", desktop: 132 },
  { date: "2024-06-25", desktop: 141 },
  { date: "2024-06-26", desktop: 434 },
  { date: "2024-06-27", desktop: 448 },
  { date: "2024-06-28", desktop: 149 },
  { date: "2024-06-29", desktop: 103 },
  { date: "2024-06-30", desktop: 446 }
];
function ChartTable() {
  const chartConfig = {
    data: chartData,
    xField: "date",
    yField: "desktop"
  };
  return /* @__PURE__ */ jsx(Card, { title: "Total Revenue", children: /* @__PURE__ */ jsx(Line, { className: "max-w-full", ...chartConfig }) });
}
const columns = [
  {
    title: "Id",
    dataIndex: "id"
  },
  {
    title: "Transaction ID",
    dataIndex: "transactionId"
  },
  {
    title: "Status",
    dataIndex: "status",
    render: (value) => {
      switch (value) {
        case OrderStatus.PENDING_PAYMENT:
          return /* @__PURE__ */ jsx(Tag, { color: "red", children: "PENDING PAYMENT" });
        case OrderStatus.PENDING_DELIVERY:
          return /* @__PURE__ */ jsx(Tag, { children: "PENDING DELIVERY" });
        case OrderStatus.DELIVERED:
          return /* @__PURE__ */ jsx(Tag, { color: "green", children: "DELIVERED" });
        default:
          return /* @__PURE__ */ jsx(Tag, { color: "", children: "UNKNOWN" });
      }
    }
  },
  {
    title: "Action",
    render: (_, row) => /* @__PURE__ */ jsx("div", { className: "", children: /* @__PURE__ */ jsx(Link, { to: `/orders/${row.id}`, children: /* @__PURE__ */ jsx(Button, { type: "primary", size: "small", children: "View Details" }) }) })
  }
];
const RecentOrders = () => {
  const { recentOrders } = useLoaderData();
  return /* @__PURE__ */ jsx(Card, { title: "Recent Orders", children: /* @__PURE__ */ jsx(
    Table,
    {
      size: "small",
      scroll: { x: 1e3 },
      dataSource: recentOrders,
      columns
    }
  ) });
};
async function loader$7({}) {
  var _a, _b;
  const revenue = await db.select({
    totalAmount: sql`
      SUM((${productOrderTable.price} - (${productOrderTable.price} * ${productOrderTable.discount} / 100)) * ${productOrderTable.quantity})
    `.as("totalAmount")
  }).from(productOrderTable).innerJoin(ordersTable, eq(productOrderTable.orderId, ordersTable.id)).where(and(ne(ordersTable.status, OrderStatus.PENDING_PAYMENT)));
  const productsCount = await db.select({
    count: sql`COUNT(*)`.as("count")
  }).from(productsTable);
  const customersCount = await db.select({
    count: sql`COUNT(*)`.as("count")
  }).from(usersTable).where(eq(usersTable.type, UserType.CUSTOMER));
  return {
    revenue: revenue[0].totalAmount,
    productsCount: ((_a = productsCount[0]) == null ? void 0 : _a.count) ?? 0,
    customersCount: ((_b = customersCount[0]) == null ? void 0 : _b.count) ?? 0,
    recentOrders: await orderService.queryOrders({
      size: 5
    })
  };
}
const index = withComponentProps(function Page9() {
  return /* @__PURE__ */ jsxs(Space, {
    direction: "vertical",
    className: "w-full",
    children: [/* @__PURE__ */ jsx(SectionCards, {}), /* @__PURE__ */ jsx(ChartTable, {}), /* @__PURE__ */ jsx(RecentOrders, {})]
  });
});
const route14 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: index,
  loader: loader$7
}, Symbol.toStringTag, { value: "Module" }));
async function loader$6({
  params
}) {
  const feedbacks2 = await db.query.feedbacksTable.findMany();
  return {
    feedbacks: feedbacks2
  };
}
const feedbacks = withComponentProps(function Page10({
  loaderData: {
    feedbacks: feedbacks2
  }
}) {
  const columns2 = useMemo(() => [{
    title: "Name",
    dataIndex: "name"
  }, {
    title: "Email",
    dataIndex: "email"
  }, {
    title: "Phone Number",
    dataIndex: "phone",
    render: (value) => value ?? "N/A"
  }, {
    title: "Action",
    id: "action",
    render: (_, data2) => /* @__PURE__ */ jsx("div", {
      className: "space-x-2",
      children: /* @__PURE__ */ jsx(Button, {
        type: "primary",
        onClick: () => displayComment(data2.comment),
        size: "small",
        children: "View Comment"
      })
    })
  }], []);
  function displayComment(comment) {
    Modal.info({
      title: "User Comment",
      content: comment
    });
  }
  return /* @__PURE__ */ jsx(Card, {
    title: "Feedbacks",
    children: /* @__PURE__ */ jsx(Table, {
      scroll: {
        x: 1e3
      },
      columns: columns2,
      dataSource: feedbacks2
    })
  });
});
const route15 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: feedbacks,
  loader: loader$6
}, Symbol.toStringTag, { value: "Module" }));
async function loader$5({}) {
  const orders2 = await orderService.queryOrders({});
  return {
    orders: orders2
  };
}
const orders = withComponentProps(function Page11({
  loaderData: {
    orders: orders2
  }
}) {
  const columns2 = useMemo(() => [{
    title: "Id",
    dataIndex: "id"
  }, {
    title: "Transaction ID",
    dataIndex: "transactionId"
  }, {
    title: "Status",
    dataIndex: "status",
    render: (value) => {
      switch (value) {
        case OrderStatus.PENDING_PAYMENT:
          return /* @__PURE__ */ jsx(Tag, {
            color: "red",
            children: "PENDING PAYMENT"
          });
        case OrderStatus.PENDING_DELIVERY:
          return /* @__PURE__ */ jsx(Tag, {
            color: "blue",
            children: "PENDING DELIVERY"
          });
        case OrderStatus.DELIVERED:
          return /* @__PURE__ */ jsx(Tag, {
            color: "green",
            children: "DELIVERED"
          });
        default:
          return /* @__PURE__ */ jsx(Tag, {
            color: "blue",
            children: "UNKNOWN"
          });
      }
    }
  }, {
    title: "Action",
    render: (_, data2) => /* @__PURE__ */ jsx("div", {
      className: "",
      children: /* @__PURE__ */ jsx(ButtonLink, {
        type: "primary",
        size: "small",
        className: "hover:underline",
        to: `/orders/${data2.id}`,
        children: "Details"
      })
    })
  }], []);
  return /* @__PURE__ */ jsx(Card, {
    title: "Orders",
    children: /* @__PURE__ */ jsx(Table, {
      size: "small",
      scroll: {
        x: 1e3
      },
      columns: columns2,
      dataSource: orders2
    })
  });
});
const route16 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: orders,
  loader: loader$5
}, Symbol.toStringTag, { value: "Module" }));
async function loader$4() {
  const customers2 = await userService.findByType(UserType.CUSTOMER);
  return {
    customers: customers2
  };
}
const customers = withComponentProps(function Page12({
  loaderData: {
    customers: customers2
  }
}) {
  const columns2 = useMemo(() => [{
    title: "Name",
    dataIndex: "name"
  }, {
    title: "Email Address",
    dataIndex: "email"
  }, {
    title: "Phone Number",
    dataIndex: "phone",
    render: (value) => value ?? "N/A"
  }, {
    title: "Date Joined",
    dataIndex: "createdAt",
    render: (value) => new Date(value).toDateString()
  }], []);
  return /* @__PURE__ */ jsx(Card, {
    title: "Customers",
    children: /* @__PURE__ */ jsx(Table, {
      size: "small",
      scroll: {
        x: 1e3
      },
      columns: columns2,
      dataSource: customers2
    })
  });
});
const route17 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: customers,
  loader: loader$4
}, Symbol.toStringTag, { value: "Module" }));
const getBase64 = (file) => new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = () => resolve(reader.result);
  reader.onerror = (error) => reject(error);
});
const ImageUpload = ({
  initialValue,
  onChange,
  maxCount,
  multiple
}) => {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [fileList, setFileList] = useState([]);
  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
  };
  const handleChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);
    onChange(newFileList);
  };
  const uploadButton = /* @__PURE__ */ jsxs("button", { style: { border: 0, background: "none" }, type: "button", children: [
    /* @__PURE__ */ jsx(PlusOutlined, {}),
    /* @__PURE__ */ jsx("div", { style: { marginTop: 8 }, children: "Upload" })
  ] });
  useEffect(() => {
    if (initialValue && Array.isArray(initialValue)) {
      setFileList(
        initialValue == null ? void 0 : initialValue.map((item) => ({
          uid: item,
          name: item,
          status: "done",
          url: getImageSrc(item)
        }))
      );
    }
  }, [initialValue]);
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(
      Upload,
      {
        action: "/dashboard/upload",
        listType: "picture-card",
        fileList,
        onPreview: handlePreview,
        onChange: handleChange,
        maxCount,
        multiple,
        children: fileList.length >= 8 ? null : uploadButton
      }
    ),
    previewImage && /* @__PURE__ */ jsx(
      Image,
      {
        wrapperStyle: { display: "none" },
        preview: {
          visible: previewOpen,
          onVisibleChange: (visible) => setPreviewOpen(visible),
          afterOpenChange: (visible) => !visible && setPreviewImage("")
        },
        src: previewImage
      }
    )
  ] });
};
async function loader$3() {
  const reviews2 = await reviewService.queryReviews({});
  return {
    reviews: reviews2
  };
}
async function action$5({
  request
}) {
  const data2 = await request.json();
  if (request.method === "DELETE") {
    const review = await reviewService.findById(data2.id);
    if (review) {
      await reviewService.deleteReview(review);
      return {
        message: "Review deleted!"
      };
    }
    return {
      error: "Unable to delete review"
    };
  }
  const schema2 = z.object({
    user: z.string().min(1, "User is required"),
    image: z.string().min(1, "Image is required"),
    title: z.string().min(1, "Title is required"),
    comment: z.string().min(1, "Comment is required")
  });
  const validated = await validateSchema(schema2, data2);
  if (validated.errors) {
    return {
      errors: validated.errors
    };
  }
  await reviewService.create(validated.data);
  return {
    message: "review !created",
    created: true
  };
}
const reviews = withComponentProps(function Page13({
  loaderData: {
    reviews: reviews2
  }
}) {
  const [open, setOpen] = useState(false);
  const fetcher = useFetcher();
  const loading = fetcher.state != "idle";
  const [form] = Form.useForm();
  const columns2 = useMemo(() => [{
    title: "Image",
    dataIndex: "image",
    render: (value) => /* @__PURE__ */ jsx(Image, {
      width: 30,
      src: getImageSrc(value),
      alt: ""
    })
  }, {
    title: "Name",
    dataIndex: "user"
  }, {
    title: "Title",
    dataIndex: "title"
  }, {
    title: "Comment",
    dataIndex: "comment",
    render: (value) => value ?? "N/A"
  }, {
    title: "Action",
    id: "action",
    render: (_, value) => /* @__PURE__ */ jsx("div", {
      className: "space-x-2",
      children: /* @__PURE__ */ jsx(Button, {
        onClick: () => deleteReview(value),
        size: "small",
        danger: true,
        children: "Delete"
      })
    })
  }], []);
  function deleteReview(review) {
    Modal.confirm({
      title: "Delete Review",
      content: "Are you sure you want to delete review",
      okButtonProps: {
        loading
      },
      onOk: async () => fetcher.submit({
        id: review.id
      }, {
        method: "DELETE",
        encType: "application/json"
      })
    });
  }
  useEffect(() => {
    var _a, _b, _c, _d;
    if ((_a = fetcher.data) == null ? void 0 : _a.message) {
      setOpen(false);
      message.success(fetcher.data.message);
    }
    if ((_b = fetcher.data) == null ? void 0 : _b.error) {
      message.error(fetcher.data.error);
    }
    if ((_c = fetcher.data) == null ? void 0 : _c.errors) {
      setFieldErrors(form, (_d = fetcher.data) == null ? void 0 : _d.errors);
    }
  }, [fetcher.data]);
  return /* @__PURE__ */ jsxs(Fragment, {
    children: [/* @__PURE__ */ jsx(Modal, {
      title: "Add Review",
      open,
      onClose: () => setOpen(false),
      onCancel: () => {
        form.resetFields();
        setOpen(false);
      },
      okText: "Submit",
      onOk: form.submit,
      okButtonProps: {
        loading
      },
      children: /* @__PURE__ */ jsxs(Form, {
        form,
        labelCol: {
          sm: 5
        },
        onFinish: (v) => fetcher.submit(v, {
          method: "POST",
          encType: "application/json"
        }),
        children: [/* @__PURE__ */ jsx(Form.Item, {
          label: "User",
          name: "user",
          rules: [{
            required: true
          }],
          children: /* @__PURE__ */ jsx(Input, {
            placeholder: "Full Name"
          })
        }), /* @__PURE__ */ jsx(Form.Item, {
          label: "Image",
          name: "image",
          rules: [{
            required: true
          }],
          children: /* @__PURE__ */ jsx(ImageUpload, {
            maxCount: 1,
            onChange: (e) => form.setFieldValue("image", e[0].response ?? e[0].uid)
          })
        }), /* @__PURE__ */ jsx(Form.Item, {
          label: "title",
          name: "title",
          rules: [{
            required: true
          }],
          children: /* @__PURE__ */ jsx(Input, {
            placeholder: "Title"
          })
        }), /* @__PURE__ */ jsx(Form.Item, {
          label: "Comment",
          name: "comment",
          rules: [{
            required: true
          }],
          children: /* @__PURE__ */ jsx(Input.TextArea, {
            placeholder: "Title"
          })
        })]
      })
    }), /* @__PURE__ */ jsx(Card, {
      title: /* @__PURE__ */ jsxs("div", {
        className: "flex items-center justify-between",
        children: [/* @__PURE__ */ jsx(Typography.Title, {
          level: 5,
          children: "Reviews"
        }), /* @__PURE__ */ jsx(Button, {
          type: "primary",
          onClick: () => setOpen(true),
          children: "Add Review"
        })]
      }),
      children: /* @__PURE__ */ jsx(Table, {
        size: "small",
        loading,
        scroll: {
          x: 1e3
        },
        columns: columns2,
        dataSource: reviews2
      })
    })]
  });
});
const route18 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  action: action$5,
  default: reviews,
  loader: loader$3
}, Symbol.toStringTag, { value: "Module" }));
const HomePageSettings = () => {
  const fetcher = useFetcher();
  const { settings: settings2 } = useLoaderData();
  const items = [
    {
      key: "hero",
      label: "Hero Section",
      children: /* @__PURE__ */ jsx(
        HeroSettings,
        {
          data: settings2,
          onSave: (v) => fetcher.submit(v, { method: "PUT", encType: "application/json" })
        }
      )
    }
  ];
  useEffect(() => {
    var _a;
    if ((_a = fetcher.data) == null ? void 0 : _a.success) {
      message.success("changes saved!");
    }
  }, [fetcher.data]);
  return /* @__PURE__ */ jsx(Spin, { spinning: fetcher.state != "idle", children: /* @__PURE__ */ jsx(Collapse, { items, defaultActiveKey: ["hero"] }) });
};
function HeroSettings({
  data: data2,
  onSave
}) {
  const [form] = Form.useForm();
  return /* @__PURE__ */ jsxs(
    Form,
    {
      layout: "vertical",
      initialValues: data2,
      form,
      onFinish: (values) => onSave({ ...data2, ...values }),
      children: [
        /* @__PURE__ */ jsx(Form.Item, { label: "Heading", name: "hero_heading", children: /* @__PURE__ */ jsx(Input, {}) }),
        /* @__PURE__ */ jsx(Form.Item, { label: "Sub Heading", name: "sub_heading", children: /* @__PURE__ */ jsx(Input.TextArea, {}) }),
        /* @__PURE__ */ jsx(Form.Item, { label: "Background Image Url", name: "bg_image", children: /* @__PURE__ */ jsx(Input, { type: "url" }) }),
        /* @__PURE__ */ jsx(Button, { type: "primary", htmlType: "submit", children: "Save Changes" })
      ]
    }
  );
}
const ReactQuill = lazy(() => import("react-quill-new"));
const Editor = ({
  initialValue,
  name,
  onChange
}) => {
  const [value, setValue] = useState(initialValue);
  const [isClient, setIsClient] = useState(false);
  const editorRef = useRef(null);
  const handleChange = (content) => {
    setValue(content);
    onChange == null ? void 0 : onChange(content);
  };
  useEffect(() => {
    setIsClient(true);
  }, []);
  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);
  if (!isClient) return null;
  return /* @__PURE__ */ jsxs(Suspense, { fallback: /* @__PURE__ */ jsx("div", { children: "Loading editor..." }), children: [
    /* @__PURE__ */ jsx(
      ReactQuill,
      {
        ref: editorRef,
        theme: "snow",
        value,
        onChange: handleChange
      }
    ),
    /* @__PURE__ */ jsx("textarea", { name, defaultValue: value, hidden: true })
  ] });
};
function PageSettings() {
  const { settings: settings2 } = useLoaderData();
  const fetcher = useFetcher();
  const [form] = Form.useForm();
  useEffect(() => {
  }, [settings2]);
  useEffect(() => {
    var _a;
    if ((_a = fetcher.data) == null ? void 0 : _a.success) {
      message.success("changes saved!");
    }
  }, [fetcher.data]);
  return /* @__PURE__ */ jsx(Spin, { spinning: fetcher.state != "idle", children: /* @__PURE__ */ jsxs(
    Form,
    {
      layout: "vertical",
      onFinish: (v) => fetcher.submit(v, { method: "PUT", encType: "application/json" }),
      form,
      children: [
        /* @__PURE__ */ jsx(Form.Item, { label: "Heading", name: "title", children: /* @__PURE__ */ jsx(Input, {}) }),
        /* @__PURE__ */ jsx(Form.Item, { label: "Content", name: "content", children: /* @__PURE__ */ jsx(Editor, { initialValue: settings2.content }) }),
        /* @__PURE__ */ jsx(
          Button,
          {
            type: "primary",
            htmlType: "submit",
            loading: fetcher.state != "idle",
            children: "Save Changes"
          }
        )
      ]
    }
  ) });
}
function PaymentSettings() {
  const { settings: settings2 } = useLoaderData();
  const fetcher = useFetcher();
  const [form] = Form.useForm();
  useEffect(() => {
    form.setFieldValue("secret_key", settings2.secret_key);
    form.setFieldValue("currency", settings2.currency);
    form.setFieldValue("redirect_url", settings2.redirect_url);
  }, [settings2]);
  useEffect(() => {
    var _a;
    if ((_a = fetcher.data) == null ? void 0 : _a.success) {
      message.success("changes saved!");
    }
  }, [fetcher.data]);
  return /* @__PURE__ */ jsx(Spin, { spinning: fetcher.state != "idle", children: /* @__PURE__ */ jsxs(
    Form,
    {
      initialValues: settings2,
      layout: "vertical",
      onFinish: (v) => fetcher.submit(v, { method: "PUT", encType: "application/json" }),
      form,
      className: "grid md:grid-cols-2 gap-x-5",
      children: [
        /* @__PURE__ */ jsx(
          Form.Item,
          {
            label: "Flutterwave Secret Key",
            name: "secret_key",
            rules: [{ required: true }],
            children: /* @__PURE__ */ jsx(Input.Password, {})
          }
        ),
        /* @__PURE__ */ jsx(
          Form.Item,
          {
            label: "Currency",
            name: "currency",
            rules: [{ required: true }],
            children: /* @__PURE__ */ jsx(
              Select,
              {
                options: [
                  { label: "Naira", value: "NGN" },
                  { label: "Dollar", value: "USD" },
                  { label: "Euro", value: "EUR" }
                ]
              }
            )
          }
        ),
        /* @__PURE__ */ jsx(
          Form.Item,
          {
            label: "Redirect Url",
            name: "redirect_url",
            tooltip: "Url to redirect to after payment is processed",
            rules: [{ required: true }],
            children: /* @__PURE__ */ jsx(Input, { type: "url" })
          }
        ),
        /* @__PURE__ */ jsx(Form.Item, { className: "md:col-span-2", children: /* @__PURE__ */ jsx(
          Button,
          {
            type: "primary",
            htmlType: "submit",
            loading: fetcher.state != "idle",
            children: "Save Changes"
          }
        ) })
      ]
    }
  ) });
}
async function loader$2({
  params
}) {
  const record = await settingsService.get(params.page);
  if (record) {
    return {
      settings: record.value
    };
  }
  return {
    settings: {}
  };
}
async function action$4({
  params,
  request
}) {
  const body = await request.json();
  await settingsService.set(params.page, body);
  return {
    success: true
  };
}
const settings = withComponentProps(function Page14({
  params,
  loaderData
}) {
  const navigate = useNavigate();
  const pages = [{
    key: "home_page",
    label: "Home Page",
    children: /* @__PURE__ */ jsx(HomePageSettings, {})
  }, {
    key: "shipping_policy",
    label: "Shipping Policy",
    children: /* @__PURE__ */ jsx(PageSettings, {})
  }, {
    key: "terms_of_service",
    label: "Terms of Service",
    children: /* @__PURE__ */ jsx(PageSettings, {})
  }, {
    key: "refund_policy",
    label: "Refund Policy",
    children: /* @__PURE__ */ jsx(PageSettings, {})
  }, {
    key: "payment",
    label: "Payment Settings",
    children: /* @__PURE__ */ jsx(PaymentSettings, {})
  }];
  const [currentPage, setCurrentPage] = useState(pages[0]);
  useEffect(() => {
    const page = pages.find((p) => p.key === params.page);
    setCurrentPage(page);
  }, [params.page]);
  if (!currentPage) {
    return /* @__PURE__ */ jsx(ErrorPage, {
      status: 404,
      message: "Page Not Found",
      details: "The page you are looking for does not exist"
    });
  }
  return /* @__PURE__ */ jsxs(Fragment, {
    children: [/* @__PURE__ */ jsx(Segmented, {
      options: pages.map((page) => ({
        value: page.key,
        label: page.label
      })),
      style: {
        marginBottom: 10,
        width: "100%",
        overflowX: "auto",
        paddingBlockEnd: 10
      },
      defaultValue: params.page,
      onChange: (v) => navigate(`/dashboard/settings/${v}`)
    }), /* @__PURE__ */ jsx(Card, {
      title: currentPage == null ? void 0 : currentPage.label,
      children: currentPage == null ? void 0 : currentPage.children
    })]
  });
});
const route19 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  action: action$4,
  default: settings,
  loader: loader$2
}, Symbol.toStringTag, { value: "Module" }));
async function loader$1({}) {
  const products2 = await productService.queryProducts({});
  return {
    products: products2
  };
}
async function action$3({
  request
}) {
  const formData = await request.formData();
  if (request.method === "DELETE") {
    try {
      const productId = formData.get("productId");
      if (productId) {
        const product = await productService.findById(productId);
        if (product) {
          await productService.delete(product);
          return {
            message: "Product deleted successfully!"
          };
        }
      }
      throw new Error("unable to delete product");
    } catch (error) {
      return {
        error: "unable to delete product!"
      };
    }
  }
  console.log(request.method);
}
const products = withComponentProps(function Page15({
  loaderData: {
    products: products2
  }
}) {
  const [messageApi, messageContext] = message.useMessage();
  const fetcher = useFetcher();
  const columns2 = useMemo(() => [{
    title: "Image",
    dataIndex: "images",
    width: 60,
    render: (src) => {
      return /* @__PURE__ */ jsx(Image, {
        src: getImageSrc(src[0]),
        alt: "",
        width: 20
      });
    }
  }, {
    title: "Name",
    dataIndex: "name",
    width: 300
  }, {
    title: "Price",
    dataIndex: "price",
    width: 100,
    render: (text2) => `$${text2}`
  }, {
    title: "Stock",
    dataIndex: "stock",
    width: 100,
    render: (stock) => {
      return stock > 0 ? stock : /* @__PURE__ */ jsx(Tag, {
        color: "red",
        children: "out of stock"
      });
    }
  }, {
    title: "Discount",
    dataIndex: "discount",
    width: 100,
    render: (text2) => /* @__PURE__ */ jsxs("span", {
      children: [text2, "%"]
    })
  }, {
    title: "Action",
    width: 150,
    // fixed: "right",
    render: (_, row) => /* @__PURE__ */ jsxs(Space, {
      children: [/* @__PURE__ */ jsx(ButtonLink, {
        to: `/dashboard/products/${row.id}/edit`,
        size: "small",
        type: "primary",
        children: "Edit"
      }), /* @__PURE__ */ jsx(Popconfirm, {
        title: "Delete Product",
        description: "Are you sure you want to permanently delete this product?",
        icon: /* @__PURE__ */ jsx(QuestionCircleOutlined, {
          style: {
            color: "red"
          }
        }),
        onConfirm: async () => fetcher.submit({
          productId: row.id
        }, {
          method: "DELETE"
        }),
        children: /* @__PURE__ */ jsx(Button, {
          size: "small",
          danger: true,
          children: "Delete"
        })
      })]
    })
  }], []);
  useEffect(() => {
    var _a, _b;
    if ((_a = fetcher.data) == null ? void 0 : _a.message) messageApi.success(fetcher.data.message);
    if ((_b = fetcher.data) == null ? void 0 : _b.error) messageApi.error(fetcher.data.error);
  }, [fetcher.data]);
  return /* @__PURE__ */ jsxs(Fragment, {
    children: [messageContext, /* @__PURE__ */ jsx(Card, {
      title: /* @__PURE__ */ jsxs("div", {
        className: "flex items-center justify-between",
        children: [/* @__PURE__ */ jsx(Typography.Title, {
          level: 4,
          className: "m-0!",
          children: "Products"
        }), /* @__PURE__ */ jsx(ButtonLink, {
          to: "/dashboard/products/create",
          icon: /* @__PURE__ */ jsx(PlusOutlined, {}),
          type: "primary",
          children: "Add Product"
        })]
      }),
      children: /* @__PURE__ */ jsx(Table, {
        loading: fetcher.state != "idle",
        size: "small",
        scroll: {
          x: 1e3
        },
        id: "id",
        dataSource: products2 ?? [],
        columns: columns2
      })
    })]
  });
});
const route20 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  action: action$3,
  default: products,
  loader: loader$1
}, Symbol.toStringTag, { value: "Module" }));
const createProductSchema = z.object({
  name: z.string().min(5, { message: "Name must be at least 5 characters" }).max(255, { message: "Name must be at most 255 characters" }).nonempty({ message: "Name is required" }).refine(async (name) => {
    const record = await productService.queryProducts({ name });
    return record.length === 0;
  }, "Name already exists"),
  description: z.string().nonempty({ message: "Description is required" }),
  details: z.string().nonempty({ message: "Details are required" }),
  price: z.number({ invalid_type_error: "Price must be a number" }).int({ message: "Price must be an integer" }).positive({ message: "Price must be a positive number" }),
  stock: z.number({ invalid_type_error: "Stock must be a number" }).positive({ message: "Stock must be a positive number" }).optional(),
  discount: z.number({ invalid_type_error: "Discount must be a number" }).positive({ message: "Discount must be a positive number" }).optional(),
  images: z.array(z.string().nonempty({ message: "Image URL cannot be empty" })).nonempty({ message: "At least one image is required" }),
  tag: z.string().max(50, { message: "Tag must be at most 50 characters" }).optional()
});
const updateProductSchema = z.object({
  id: z.string({ required_error: "ID is required" }).nonempty({ message: "ID must not be empty" }),
  name: z.string().min(5, { message: "Name must be at least 5 characters" }).max(255, { message: "Name must be at most 255 characters" }).nonempty({ message: "Name is required" }),
  // Uniqueness to be handled in logic layer
  description: z.string().nonempty({ message: "Description is required" }),
  details: z.string().nonempty({ message: "Details are required" }),
  price: z.number({ invalid_type_error: "Price must be a number" }).int({ message: "Price must be an integer" }).positive({ message: "Price must be a positive number" }),
  stock: z.number({ invalid_type_error: "Stock must be a number" }).positive({ message: "Stock must be a positive number" }).optional(),
  discount: z.number({ invalid_type_error: "Discount must be a number" }).min(0, { message: "Discount must be zero or a positive number" }).optional(),
  images: z.array(z.string().nonempty({ message: "Image URL cannot be empty" })).nonempty({ message: "At least one image is required" }),
  tag: z.string().max(50, { message: "Tag must be at most 50 characters" }).optional()
}).refine(
  async (data2) => {
    const records = await db.query.productsTable.findMany({
      where: (table, fn) => fn.and(fn.eq(table.name, data2.name), fn.ne(table.id, data2.id))
    });
    return records.length === 0;
  },
  { message: "Name already exists", path: ["name"] }
);
async function action$2({
  request
}) {
  const data2 = await request.json();
  const validated = await validateSchema(createProductSchema, data2);
  if (validated.errors) {
    return {
      errors: validated.errors
    };
  }
  await productService.create(validated.data);
  return redirect("/dashboard/products");
}
const createProduct = withComponentProps(function Page16() {
  var _a;
  const fetcher = useFetcher();
  const [form] = Form.useForm();
  function handleSubmit(values) {
    fetcher.submit(values, {
      method: "POST",
      encType: "application/json"
    });
  }
  setFieldErrors(form, (_a = fetcher.data) == null ? void 0 : _a.errors);
  return /* @__PURE__ */ jsx(Card, {
    title: "Create Product",
    children: /* @__PURE__ */ jsxs(Form, {
      form,
      onFinish: handleSubmit,
      layout: "vertical",
      children: [/* @__PURE__ */ jsx(Form.Item, {
        label: "Product Name",
        name: "name",
        rules: [{
          required: true
        }],
        children: /* @__PURE__ */ jsx(Input, {})
      }), /* @__PURE__ */ jsx(Form.Item, {
        label: "Product Images",
        name: "images",
        rules: [{
          required: true
        }],
        children: /* @__PURE__ */ jsx(ImageUpload, {
          onChange: (v) => form.setFieldValue("images", v.map((el) => el.response))
        })
      }), /* @__PURE__ */ jsxs(Row, {
        gutter: 24,
        children: [/* @__PURE__ */ jsx(Col, {
          span: 24,
          md: 12,
          children: /* @__PURE__ */ jsx(Form.Item, {
            label: "Product Price",
            name: "price",
            rules: [{
              required: true
            }],
            children: /* @__PURE__ */ jsx(InputNumber, {
              min: 0,
              style: {
                width: "100%"
              }
            })
          })
        }), /* @__PURE__ */ jsx(Col, {
          span: 24,
          md: 12,
          children: /* @__PURE__ */ jsx(Form.Item, {
            label: "Product In Stock",
            name: "stock",
            rules: [{
              required: true
            }],
            children: /* @__PURE__ */ jsx(InputNumber, {
              min: 0,
              style: {
                width: "100%"
              }
            })
          })
        }), /* @__PURE__ */ jsx(Col, {
          span: 24,
          md: 12,
          children: /* @__PURE__ */ jsx(Form.Item, {
            label: "Product Discount(%)",
            name: "discount",
            children: /* @__PURE__ */ jsx(InputNumber, {
              min: 0,
              style: {
                width: "100%"
              }
            })
          })
        }), /* @__PURE__ */ jsx(Col, {
          span: 24,
          md: 12,
          children: /* @__PURE__ */ jsx(Form.Item, {
            label: "Product Tag",
            name: "tag",
            children: /* @__PURE__ */ jsx(Input, {
              style: {
                width: "100%"
              }
            })
          })
        })]
      }), /* @__PURE__ */ jsx(Form.Item, {
        label: "Product Description",
        name: "description",
        rules: [{
          required: true
        }],
        children: /* @__PURE__ */ jsx(Editor, {})
      }), /* @__PURE__ */ jsx(Form.Item, {
        label: "Product Details",
        name: "details",
        children: /* @__PURE__ */ jsx(Editor, {})
      }), /* @__PURE__ */ jsx(Button, {
        type: "primary",
        htmlType: "submit",
        loading: fetcher.state != "idle",
        children: "Create Product"
      })]
    })
  });
});
const route21 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  action: action$2,
  default: createProduct
}, Symbol.toStringTag, { value: "Module" }));
async function loader({
  params
}) {
  const product = await productService.findById(params.id);
  if (!product) throw data({
    message: "Page Not Found"
  }, 404);
  return {
    product
  };
}
async function action$1({
  request,
  params
}) {
  const data2 = await request.json();
  const validated = await validateSchema(updateProductSchema, {
    ...data2,
    id: params.id
  });
  if (validated.errors) {
    return {
      errors: validated.errors
    };
  }
  const product = await productService.findById(params.id);
  if (product) {
    await productService.update(product, validated.data);
    return redirect("/dashboard/products");
  }
  return {
    error: "Unable to update product"
  };
}
const editProduct = withComponentProps(function Page17({
  loaderData: {
    product
  }
}) {
  var _a;
  const fetcher = useFetcher();
  const [form] = Form.useForm();
  function handleSubmit(values) {
    fetcher.submit(values, {
      method: "POST",
      encType: "application/json"
    });
  }
  setFieldErrors(form, (_a = fetcher.data) == null ? void 0 : _a.errors);
  return /* @__PURE__ */ jsx(Card, {
    title: "Edit Product",
    children: /* @__PURE__ */ jsxs(Form, {
      form,
      onFinish: handleSubmit,
      layout: "vertical",
      initialValues: product,
      children: [/* @__PURE__ */ jsx(Form.Item, {
        label: "Product Name",
        name: "name",
        rules: [{
          required: true
        }],
        children: /* @__PURE__ */ jsx(Input, {})
      }), /* @__PURE__ */ jsx(Form.Item, {
        label: "Product Images",
        name: "images",
        rules: [{
          required: true
        }],
        children: /* @__PURE__ */ jsx(ImageUpload, {
          initialValue: product.images,
          onChange: (v) => form.setFieldValue("images", v.map((el) => el.response ?? el.uid))
        })
      }), /* @__PURE__ */ jsxs(Row, {
        gutter: 24,
        children: [/* @__PURE__ */ jsx(Col, {
          span: 24,
          md: 12,
          children: /* @__PURE__ */ jsx(Form.Item, {
            label: "Product Price",
            name: "price",
            rules: [{
              required: true
            }],
            children: /* @__PURE__ */ jsx(InputNumber, {
              min: 0,
              style: {
                width: "100%"
              }
            })
          })
        }), /* @__PURE__ */ jsx(Col, {
          span: 24,
          md: 12,
          children: /* @__PURE__ */ jsx(Form.Item, {
            label: "Product In Stock",
            name: "stock",
            rules: [{
              required: true
            }],
            children: /* @__PURE__ */ jsx(InputNumber, {
              min: 0,
              style: {
                width: "100%"
              }
            })
          })
        }), /* @__PURE__ */ jsx(Col, {
          span: 24,
          md: 12,
          children: /* @__PURE__ */ jsx(Form.Item, {
            label: "Product Discount(%)",
            name: "discount",
            children: /* @__PURE__ */ jsx(InputNumber, {
              min: 0,
              style: {
                width: "100%"
              }
            })
          })
        }), /* @__PURE__ */ jsx(Col, {
          span: 24,
          md: 12,
          children: /* @__PURE__ */ jsx(Form.Item, {
            label: "Product Tag",
            name: "tag",
            children: /* @__PURE__ */ jsx(Input, {
              style: {
                width: "100%"
              }
            })
          })
        })]
      }), /* @__PURE__ */ jsx(Form.Item, {
        label: "Product Description",
        name: "description",
        rules: [{
          required: true
        }],
        children: /* @__PURE__ */ jsx(Editor, {
          initialValue: product.description
        })
      }), /* @__PURE__ */ jsx(Form.Item, {
        label: "Product Details",
        name: "details",
        children: /* @__PURE__ */ jsx(Editor, {
          initialValue: product.details
        })
      }), /* @__PURE__ */ jsx(Button, {
        type: "primary",
        htmlType: "submit",
        loading: fetcher.state != "idle",
        children: "Update Product"
      })]
    })
  });
});
const route22 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  action: action$1,
  default: editProduct,
  loader
}, Symbol.toStringTag, { value: "Module" }));
async function action({
  request
}) {
  const formData = await request.formData();
  const file = formData.get("file");
  return await uploadService.saveTemp(file);
}
const route23 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  action
}, Symbol.toStringTag, { value: "Module" }));
const serverManifest = { "entry": { "module": "/assets/entry.client-C6W7DiDA.js", "imports": ["/assets/chunk-D4RADZKF-DAz_vGcL.js", "/assets/client-B24MR5H9.js", "/assets/index-D4ZOqxWl.js"], "css": [] }, "routes": { "root": { "id": "root", "parentId": void 0, "path": "", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": true, "hasClientMiddleware": false, "hasErrorBoundary": true, "module": "/assets/root-DBMybYVo.js", "imports": ["/assets/chunk-D4RADZKF-DAz_vGcL.js", "/assets/client-B24MR5H9.js", "/assets/index-D4ZOqxWl.js", "/assets/with-props-zgZ4Swg7.js", "/assets/button-BHijcmC7.js", "/assets/cart-provider-D8lMZpvq.js", "/assets/index-DXFem7WI.js", "/assets/index-DURpipQz.js", "/assets/ContextIsolator-oaooBrlp.js", "/assets/ExclamationCircleFilled-W6vk6RFQ.js", "/assets/CloseCircleFilled-BB15cPNT.js", "/assets/CloseOutlined-Dy2HrFbl.js", "/assets/InfoCircleFilled-Bmgfd1T2.js", "/assets/config-Y8BI0tot.js", "/assets/error-page-C3sODFbS.js", "/assets/index-BMw-dO_3.js", "/assets/pickAttrs-BDmP-lu7.js", "/assets/ActionButton-Lb2x-VjR.js", "/assets/index-B_W-bSKP.js", "/assets/index-blh_t3tb.js", "/assets/fade-D5ET0lYX.js", "/assets/useClosable-BIv2YQC7.js", "/assets/extendsObject-C6pccdOq.js", "/assets/Skeleton-c8QWDCRi.js", "/assets/context-C02MQkNA.js", "/assets/link-D7g_RGP4.js", "/assets/index-Bvx8ko_I.js", "/assets/index-CItnkCRU.js"], "css": ["/assets/root-BLegYvrl.css"], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "pages/public/layout": { "id": "pages/public/layout", "parentId": "root", "path": void 0, "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/layout-Br4N3VsL.js", "imports": ["/assets/with-props-zgZ4Swg7.js", "/assets/chunk-D4RADZKF-DAz_vGcL.js", "/assets/user-menu-DWCKemOV.js", "/assets/utils-CNuFmlBv.js", "/assets/product-SobSSWw-.js", "/assets/price-format-4KxdFil5.js", "/assets/cart-provider-D8lMZpvq.js", "/assets/button-BHijcmC7.js", "/assets/index-BAed6j4S.js", "/assets/ContextIsolator-oaooBrlp.js", "/assets/pickAttrs-BDmP-lu7.js", "/assets/context-C02MQkNA.js", "/assets/useClosable-BIv2YQC7.js", "/assets/Skeleton-c8QWDCRi.js", "/assets/index-BtkKALop.js", "/assets/index-DjaHCjle.js", "/assets/index-CItnkCRU.js", "/assets/index-C9jnjFYw.js", "/assets/AntdIcon-BqQjB-7o.js", "/assets/index-axsys1ZB.js", "/assets/PlusOutlined-DUPhCR4c.js", "/assets/DeleteOutlined-DFutYCzo.js", "/assets/index-CPSPtwXn.js", "/assets/config-Y8BI0tot.js", "/assets/index-DB0Ln5WD.js", "/assets/index-Bb8mSo06.js", "/assets/row-lNwB0GMQ.js", "/assets/index-DXFem7WI.js", "/assets/scrollTo-D2JECFlI.js", "/assets/convertToTooltipProps-FkdqikIB.js", "/assets/fade-D5ET0lYX.js", "/assets/CloseOutlined-Dy2HrFbl.js", "/assets/index-DBVo6aQJ.js", "/assets/enums-C5TeptIY.js", "/assets/index-BMw-dO_3.js", "/assets/index-BQOtWco4.js", "/assets/useBreakpoint-B7m96Ekk.js", "/assets/index-D9CIBdyn.js", "/assets/index-D4ZOqxWl.js", "/assets/react-number-format.es-Bf5wJkGf.js", "/assets/index-Bcho9uyj.js", "/assets/extendsObject-C6pccdOq.js", "/assets/index-lDD27JVI.js", "/assets/Overflow-CSGCzpcK.js", "/assets/PurePanel-DQWTWKaP.js", "/assets/getAllowClear-RJcteg7o.js", "/assets/CloseCircleFilled-BB15cPNT.js", "/assets/move-B7plCz5U.js", "/assets/DownOutlined-DatLSNvX.js", "/assets/SearchOutlined-d4YbfynM.js", "/assets/Pagination-sp4ziX3s.js", "/assets/LeftOutlined-XQszqjzV.js", "/assets/RightOutlined-ChWhwkp3.js", "/assets/styleChecker-BoZ39Bhw.js", "/assets/TextArea-DuDk0je7.js", "/assets/EllipsisOutlined-CieEX8qC.js", "/assets/collapse-BbEVqHco.js", "/assets/Input-DsPYekik.js", "/assets/EyeOutlined-6hR7CDcx.js", "/assets/index-blh_t3tb.js", "/assets/ExclamationCircleFilled-W6vk6RFQ.js", "/assets/InfoCircleFilled-Bmgfd1T2.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "pages/public/index": { "id": "pages/public/index", "parentId": "pages/public/layout", "path": void 0, "index": true, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/index-BnqcsRzH.js", "imports": ["/assets/with-props-zgZ4Swg7.js", "/assets/chunk-D4RADZKF-DAz_vGcL.js", "/assets/index-C9jnjFYw.js", "/assets/button-BHijcmC7.js", "/assets/ArrowRightOutlined-CEovwFY-.js", "/assets/product-card-XNANrKPp.js", "/assets/AntdIcon-BqQjB-7o.js", "/assets/RollbackOutlined-Cz1Dl1gd.js", "/assets/index-CItnkCRU.js", "/assets/index-BAed6j4S.js", "/assets/ContextIsolator-oaooBrlp.js", "/assets/index-D4ZOqxWl.js", "/assets/styleChecker-BoZ39Bhw.js", "/assets/pickAttrs-BDmP-lu7.js", "/assets/TextArea-DuDk0je7.js", "/assets/getAllowClear-RJcteg7o.js", "/assets/CloseCircleFilled-BB15cPNT.js", "/assets/product-SobSSWw-.js", "/assets/cart-provider-D8lMZpvq.js", "/assets/config-Y8BI0tot.js", "/assets/index-DXFem7WI.js", "/assets/ExclamationCircleFilled-W6vk6RFQ.js", "/assets/InfoCircleFilled-Bmgfd1T2.js", "/assets/CloseOutlined-Dy2HrFbl.js", "/assets/utils-CNuFmlBv.js", "/assets/react-number-format.es-Bf5wJkGf.js", "/assets/index-Bcho9uyj.js", "/assets/useClosable-BIv2YQC7.js", "/assets/extendsObject-C6pccdOq.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "pages/public/shop": { "id": "pages/public/shop", "parentId": "pages/public/layout", "path": "/shop", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": true, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/shop-YeqdBLnX.js", "imports": ["/assets/with-props-zgZ4Swg7.js", "/assets/chunk-D4RADZKF-DAz_vGcL.js", "/assets/index-BRBbHYnL.js", "/assets/index-BtkKALop.js", "/assets/index-D9CIBdyn.js", "/assets/button-BHijcmC7.js", "/assets/index-DThF2Jli.js", "/assets/index-CItnkCRU.js", "/assets/index-axsys1ZB.js", "/assets/index-C9jnjFYw.js", "/assets/index-lDD27JVI.js", "/assets/product-card-XNANrKPp.js", "/assets/Skeleton-c8QWDCRi.js", "/assets/ContextIsolator-oaooBrlp.js", "/assets/index-D4ZOqxWl.js", "/assets/collapse-BbEVqHco.js", "/assets/row-lNwB0GMQ.js", "/assets/index-blh_t3tb.js", "/assets/useBreakpoint-B7m96Ekk.js", "/assets/QuestionCircleOutlined-CkfPyHQh.js", "/assets/convertToTooltipProps-FkdqikIB.js", "/assets/index-BAed6j4S.js", "/assets/pickAttrs-BDmP-lu7.js", "/assets/ExclamationCircleFilled-W6vk6RFQ.js", "/assets/CloseCircleFilled-BB15cPNT.js", "/assets/DownOutlined-DatLSNvX.js", "/assets/getAllowClear-RJcteg7o.js", "/assets/styleChecker-BoZ39Bhw.js", "/assets/TextArea-DuDk0je7.js", "/assets/Overflow-CSGCzpcK.js", "/assets/PurePanel-DQWTWKaP.js", "/assets/move-B7plCz5U.js", "/assets/CloseOutlined-Dy2HrFbl.js", "/assets/SearchOutlined-d4YbfynM.js", "/assets/product-SobSSWw-.js", "/assets/cart-provider-D8lMZpvq.js", "/assets/config-Y8BI0tot.js", "/assets/index-DXFem7WI.js", "/assets/InfoCircleFilled-Bmgfd1T2.js", "/assets/utils-CNuFmlBv.js", "/assets/react-number-format.es-Bf5wJkGf.js", "/assets/index-Bcho9uyj.js", "/assets/useClosable-BIv2YQC7.js", "/assets/extendsObject-C6pccdOq.js", "/assets/AntdIcon-BqQjB-7o.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "pages/public/shop.$id": { "id": "pages/public/shop.$id", "parentId": "pages/public/layout", "path": "/shop/:id", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/shop._id-BK4eV7rB.js", "imports": ["/assets/with-props-zgZ4Swg7.js", "/assets/chunk-D4RADZKF-DAz_vGcL.js", "/assets/product-SobSSWw-.js", "/assets/utils-CNuFmlBv.js", "/assets/product-card-XNANrKPp.js", "/assets/button-BHijcmC7.js", "/assets/index-Bcho9uyj.js", "/assets/index-C9jnjFYw.js", "/assets/Collapse-cA_bn20i.js", "/assets/index-CItnkCRU.js", "/assets/RollbackOutlined-Cz1Dl1gd.js", "/assets/row-lNwB0GMQ.js", "/assets/index-BQOtWco4.js", "/assets/cart-provider-D8lMZpvq.js", "/assets/config-Y8BI0tot.js", "/assets/index-DXFem7WI.js", "/assets/ExclamationCircleFilled-W6vk6RFQ.js", "/assets/CloseCircleFilled-BB15cPNT.js", "/assets/InfoCircleFilled-Bmgfd1T2.js", "/assets/index-D4ZOqxWl.js", "/assets/ContextIsolator-oaooBrlp.js", "/assets/pickAttrs-BDmP-lu7.js", "/assets/CloseOutlined-Dy2HrFbl.js", "/assets/react-number-format.es-Bf5wJkGf.js", "/assets/AntdIcon-BqQjB-7o.js", "/assets/index-BAed6j4S.js", "/assets/useClosable-BIv2YQC7.js", "/assets/extendsObject-C6pccdOq.js", "/assets/styleChecker-BoZ39Bhw.js", "/assets/TextArea-DuDk0je7.js", "/assets/getAllowClear-RJcteg7o.js", "/assets/RightOutlined-ChWhwkp3.js", "/assets/collapse-BbEVqHco.js", "/assets/index-blh_t3tb.js", "/assets/useBreakpoint-B7m96Ekk.js", "/assets/index-D9CIBdyn.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "pages/public/show-page": { "id": "pages/public/show-page", "parentId": "pages/public/layout", "path": "/pages/:page", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/show-page-CoW6Y_2g.js", "imports": ["/assets/with-props-zgZ4Swg7.js", "/assets/chunk-D4RADZKF-DAz_vGcL.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "pages/public/contact": { "id": "pages/public/contact", "parentId": "pages/public/layout", "path": "/contact", "index": void 0, "caseSensitive": void 0, "hasAction": true, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/contact-ByK8tmWf.js", "imports": ["/assets/with-props-zgZ4Swg7.js", "/assets/chunk-D4RADZKF-DAz_vGcL.js", "/assets/config-Y8BI0tot.js", "/assets/utils-CNuFmlBv.js", "/assets/index-BRBbHYnL.js", "/assets/index-3YpVs0X4.js", "/assets/index-C9jnjFYw.js", "/assets/row-lNwB0GMQ.js", "/assets/index-DB0Ln5WD.js", "/assets/button-BHijcmC7.js", "/assets/AntdIcon-BqQjB-7o.js", "/assets/ContextIsolator-oaooBrlp.js", "/assets/index-D4ZOqxWl.js", "/assets/collapse-BbEVqHco.js", "/assets/QuestionCircleOutlined-CkfPyHQh.js", "/assets/convertToTooltipProps-FkdqikIB.js", "/assets/index-BAed6j4S.js", "/assets/pickAttrs-BDmP-lu7.js", "/assets/ExclamationCircleFilled-W6vk6RFQ.js", "/assets/CloseCircleFilled-BB15cPNT.js", "/assets/index-DURpipQz.js", "/assets/InfoCircleFilled-Bmgfd1T2.js", "/assets/ActionButton-Lb2x-VjR.js", "/assets/CloseOutlined-Dy2HrFbl.js", "/assets/index-B_W-bSKP.js", "/assets/index-blh_t3tb.js", "/assets/fade-D5ET0lYX.js", "/assets/useClosable-BIv2YQC7.js", "/assets/extendsObject-C6pccdOq.js", "/assets/Skeleton-c8QWDCRi.js", "/assets/context-C02MQkNA.js", "/assets/PurePanel-DQWTWKaP.js", "/assets/styleChecker-BoZ39Bhw.js", "/assets/TextArea-DuDk0je7.js", "/assets/getAllowClear-RJcteg7o.js", "/assets/useBreakpoint-B7m96Ekk.js", "/assets/Input-DsPYekik.js", "/assets/EyeOutlined-6hR7CDcx.js", "/assets/SearchOutlined-d4YbfynM.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "pages/public/checkout": { "id": "pages/public/checkout", "parentId": "pages/public/layout", "path": "/checkout", "index": void 0, "caseSensitive": void 0, "hasAction": true, "hasLoader": false, "hasClientAction": false, "hasClientLoader": true, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/checkout-DrTB6T7g.js", "imports": ["/assets/with-props-zgZ4Swg7.js", "/assets/chunk-D4RADZKF-DAz_vGcL.js", "/assets/config-Y8BI0tot.js", "/assets/row-lNwB0GMQ.js", "/assets/index-CItnkCRU.js", "/assets/index-DBVo6aQJ.js", "/assets/index-DjaHCjle.js", "/assets/Skeleton-c8QWDCRi.js", "/assets/price-format-4KxdFil5.js", "/assets/utils-CNuFmlBv.js", "/assets/button-BHijcmC7.js", "/assets/index-BQOtWco4.js", "/assets/index-BRBbHYnL.js", "/assets/index-DB0Ln5WD.js", "/assets/index-DXFem7WI.js", "/assets/index-blh_t3tb.js", "/assets/useBreakpoint-B7m96Ekk.js", "/assets/CloseOutlined-Dy2HrFbl.js", "/assets/EllipsisOutlined-CieEX8qC.js", "/assets/index-BAed6j4S.js", "/assets/ContextIsolator-oaooBrlp.js", "/assets/index-D4ZOqxWl.js", "/assets/Overflow-CSGCzpcK.js", "/assets/getAllowClear-RJcteg7o.js", "/assets/CloseCircleFilled-BB15cPNT.js", "/assets/extendsObject-C6pccdOq.js", "/assets/index-lDD27JVI.js", "/assets/pickAttrs-BDmP-lu7.js", "/assets/PurePanel-DQWTWKaP.js", "/assets/move-B7plCz5U.js", "/assets/DownOutlined-DatLSNvX.js", "/assets/SearchOutlined-d4YbfynM.js", "/assets/Pagination-sp4ziX3s.js", "/assets/LeftOutlined-XQszqjzV.js", "/assets/RightOutlined-ChWhwkp3.js", "/assets/index-BMw-dO_3.js", "/assets/react-number-format.es-Bf5wJkGf.js", "/assets/index-D9CIBdyn.js", "/assets/collapse-BbEVqHco.js", "/assets/QuestionCircleOutlined-CkfPyHQh.js", "/assets/convertToTooltipProps-FkdqikIB.js", "/assets/ExclamationCircleFilled-W6vk6RFQ.js", "/assets/Input-DsPYekik.js", "/assets/EyeOutlined-6hR7CDcx.js", "/assets/TextArea-DuDk0je7.js", "/assets/InfoCircleFilled-Bmgfd1T2.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "pages/public/show-order": { "id": "pages/public/show-order", "parentId": "pages/public/layout", "path": "/orders/:id", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/show-order-DfhqGYes.js", "imports": ["/assets/with-props-zgZ4Swg7.js", "/assets/chunk-D4RADZKF-DAz_vGcL.js", "/assets/utils-CNuFmlBv.js", "/assets/enums-C5TeptIY.js", "/assets/price-format-4KxdFil5.js", "/assets/row-lNwB0GMQ.js", "/assets/index-CItnkCRU.js", "/assets/index-DBVo6aQJ.js", "/assets/index-DjaHCjle.js", "/assets/index-BQOtWco4.js", "/assets/index-DB0Ln5WD.js", "/assets/index-Bcho9uyj.js", "/assets/react-number-format.es-Bf5wJkGf.js", "/assets/button-BHijcmC7.js", "/assets/index-D4ZOqxWl.js", "/assets/index-blh_t3tb.js", "/assets/useBreakpoint-B7m96Ekk.js", "/assets/Skeleton-c8QWDCRi.js", "/assets/ContextIsolator-oaooBrlp.js", "/assets/CloseOutlined-Dy2HrFbl.js", "/assets/EllipsisOutlined-CieEX8qC.js", "/assets/index-BAed6j4S.js", "/assets/Overflow-CSGCzpcK.js", "/assets/getAllowClear-RJcteg7o.js", "/assets/CloseCircleFilled-BB15cPNT.js", "/assets/extendsObject-C6pccdOq.js", "/assets/index-lDD27JVI.js", "/assets/pickAttrs-BDmP-lu7.js", "/assets/PurePanel-DQWTWKaP.js", "/assets/move-B7plCz5U.js", "/assets/DownOutlined-DatLSNvX.js", "/assets/SearchOutlined-d4YbfynM.js", "/assets/Pagination-sp4ziX3s.js", "/assets/LeftOutlined-XQszqjzV.js", "/assets/RightOutlined-ChWhwkp3.js", "/assets/index-BMw-dO_3.js", "/assets/index-D9CIBdyn.js", "/assets/Input-DsPYekik.js", "/assets/EyeOutlined-6hR7CDcx.js", "/assets/TextArea-DuDk0je7.js", "/assets/useClosable-BIv2YQC7.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "pages/public/checkout.payment_status": { "id": "pages/public/checkout.payment_status", "parentId": "pages/public/layout", "path": "/checkout/payment_status", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": true, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/checkout.payment_status-BQt3YmE5.js", "imports": ["/assets/with-props-zgZ4Swg7.js", "/assets/chunk-D4RADZKF-DAz_vGcL.js", "/assets/enums-C5TeptIY.js", "/assets/config-Y8BI0tot.js", "/assets/index-Bvx8ko_I.js", "/assets/button-BHijcmC7.js", "/assets/AntdIcon-BqQjB-7o.js", "/assets/ArrowRightOutlined-CEovwFY-.js", "/assets/ExclamationCircleFilled-W6vk6RFQ.js", "/assets/CloseCircleFilled-BB15cPNT.js", "/assets/index-D4ZOqxWl.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "pages/auth/login": { "id": "pages/auth/login", "parentId": "pages/public/layout", "path": "/login", "index": void 0, "caseSensitive": void 0, "hasAction": true, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/login-aFID_zJL.js", "imports": ["/assets/with-props-zgZ4Swg7.js", "/assets/chunk-D4RADZKF-DAz_vGcL.js", "/assets/config-Y8BI0tot.js", "/assets/index-BRBbHYnL.js", "/assets/index-C9jnjFYw.js", "/assets/index-DB0Ln5WD.js", "/assets/button-BHijcmC7.js", "/assets/index-Bb8mSo06.js", "/assets/ContextIsolator-oaooBrlp.js", "/assets/index-D4ZOqxWl.js", "/assets/collapse-BbEVqHco.js", "/assets/row-lNwB0GMQ.js", "/assets/index-blh_t3tb.js", "/assets/useBreakpoint-B7m96Ekk.js", "/assets/QuestionCircleOutlined-CkfPyHQh.js", "/assets/convertToTooltipProps-FkdqikIB.js", "/assets/index-BAed6j4S.js", "/assets/pickAttrs-BDmP-lu7.js", "/assets/ExclamationCircleFilled-W6vk6RFQ.js", "/assets/CloseCircleFilled-BB15cPNT.js", "/assets/styleChecker-BoZ39Bhw.js", "/assets/TextArea-DuDk0je7.js", "/assets/getAllowClear-RJcteg7o.js", "/assets/Input-DsPYekik.js", "/assets/EyeOutlined-6hR7CDcx.js", "/assets/SearchOutlined-d4YbfynM.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "pages/auth/register": { "id": "pages/auth/register", "parentId": "pages/public/layout", "path": "/register", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/register-Bmm37fdB.js", "imports": ["/assets/with-props-zgZ4Swg7.js", "/assets/chunk-D4RADZKF-DAz_vGcL.js", "/assets/config-Y8BI0tot.js", "/assets/index-BRBbHYnL.js", "/assets/index-C9jnjFYw.js", "/assets/index-DB0Ln5WD.js", "/assets/button-BHijcmC7.js", "/assets/index-Bb8mSo06.js", "/assets/ContextIsolator-oaooBrlp.js", "/assets/index-D4ZOqxWl.js", "/assets/collapse-BbEVqHco.js", "/assets/row-lNwB0GMQ.js", "/assets/index-blh_t3tb.js", "/assets/useBreakpoint-B7m96Ekk.js", "/assets/QuestionCircleOutlined-CkfPyHQh.js", "/assets/convertToTooltipProps-FkdqikIB.js", "/assets/index-BAed6j4S.js", "/assets/pickAttrs-BDmP-lu7.js", "/assets/ExclamationCircleFilled-W6vk6RFQ.js", "/assets/CloseCircleFilled-BB15cPNT.js", "/assets/styleChecker-BoZ39Bhw.js", "/assets/TextArea-DuDk0je7.js", "/assets/getAllowClear-RJcteg7o.js", "/assets/Input-DsPYekik.js", "/assets/EyeOutlined-6hR7CDcx.js", "/assets/SearchOutlined-d4YbfynM.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "pages/auth/logout": { "id": "pages/auth/logout", "parentId": "pages/public/layout", "path": "/logout", "index": void 0, "caseSensitive": void 0, "hasAction": true, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/logout-l0sNRNKZ.js", "imports": [], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "pages/dashboard/layout": { "id": "pages/dashboard/layout", "parentId": "root", "path": "/dashboard", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/layout-BDptU50x.js", "imports": ["/assets/with-props-zgZ4Swg7.js", "/assets/chunk-D4RADZKF-DAz_vGcL.js", "/assets/user-menu-DWCKemOV.js", "/assets/utils-CNuFmlBv.js", "/assets/index-CPSPtwXn.js", "/assets/AntdIcon-BqQjB-7o.js", "/assets/button-BHijcmC7.js", "/assets/index-BAed6j4S.js", "/assets/config-Y8BI0tot.js", "/assets/enums-C5TeptIY.js", "/assets/index-BMw-dO_3.js", "/assets/ContextIsolator-oaooBrlp.js", "/assets/index-D4ZOqxWl.js", "/assets/index-BQOtWco4.js", "/assets/useBreakpoint-B7m96Ekk.js", "/assets/index-D9CIBdyn.js", "/assets/LeftOutlined-XQszqjzV.js", "/assets/RightOutlined-ChWhwkp3.js", "/assets/EllipsisOutlined-CieEX8qC.js", "/assets/Overflow-CSGCzpcK.js", "/assets/PurePanel-DQWTWKaP.js", "/assets/collapse-BbEVqHco.js", "/assets/move-B7plCz5U.js", "/assets/index-CItnkCRU.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "pages/dashboard/index": { "id": "pages/dashboard/index", "parentId": "pages/dashboard/layout", "path": void 0, "index": true, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/index-05UFYE-p.js", "imports": ["/assets/with-props-zgZ4Swg7.js", "/assets/chunk-D4RADZKF-DAz_vGcL.js", "/assets/price-format-4KxdFil5.js", "/assets/row-lNwB0GMQ.js", "/assets/index-DBVo6aQJ.js", "/assets/button-BHijcmC7.js", "/assets/useBreakpoint-B7m96Ekk.js", "/assets/pickAttrs-BDmP-lu7.js", "/assets/Skeleton-c8QWDCRi.js", "/assets/index-tpNoK5CZ.js", "/assets/enums-C5TeptIY.js", "/assets/Table-BbDh7AMc.js", "/assets/index-Bcho9uyj.js", "/assets/index-CItnkCRU.js", "/assets/react-number-format.es-Bf5wJkGf.js", "/assets/index-blh_t3tb.js", "/assets/CloseOutlined-Dy2HrFbl.js", "/assets/EllipsisOutlined-CieEX8qC.js", "/assets/index-BAed6j4S.js", "/assets/ContextIsolator-oaooBrlp.js", "/assets/index-D4ZOqxWl.js", "/assets/Overflow-CSGCzpcK.js", "/assets/getAllowClear-RJcteg7o.js", "/assets/CloseCircleFilled-BB15cPNT.js", "/assets/styleChecker-BoZ39Bhw.js", "/assets/addEventListener-BzkQ-zOx.js", "/assets/index-lDD27JVI.js", "/assets/PurePanel-DQWTWKaP.js", "/assets/move-B7plCz5U.js", "/assets/DownOutlined-DatLSNvX.js", "/assets/SearchOutlined-d4YbfynM.js", "/assets/index-DThF2Jli.js", "/assets/index-CPSPtwXn.js", "/assets/LeftOutlined-XQszqjzV.js", "/assets/RightOutlined-ChWhwkp3.js", "/assets/collapse-BbEVqHco.js", "/assets/scrollTo-D2JECFlI.js", "/assets/Pagination-sp4ziX3s.js", "/assets/index-BMw-dO_3.js", "/assets/extendsObject-C6pccdOq.js", "/assets/Input-DsPYekik.js", "/assets/useClosable-BIv2YQC7.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "pages/dashboard/feedbacks": { "id": "pages/dashboard/feedbacks", "parentId": "pages/dashboard/layout", "path": "/dashboard/feedbacks", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/feedbacks-7bmFViAg.js", "imports": ["/assets/with-props-zgZ4Swg7.js", "/assets/chunk-D4RADZKF-DAz_vGcL.js", "/assets/button-BHijcmC7.js", "/assets/index-3YpVs0X4.js", "/assets/index-DBVo6aQJ.js", "/assets/Table-BbDh7AMc.js", "/assets/index-D4ZOqxWl.js", "/assets/index-DURpipQz.js", "/assets/ExclamationCircleFilled-W6vk6RFQ.js", "/assets/CloseCircleFilled-BB15cPNT.js", "/assets/InfoCircleFilled-Bmgfd1T2.js", "/assets/ContextIsolator-oaooBrlp.js", "/assets/ActionButton-Lb2x-VjR.js", "/assets/CloseOutlined-Dy2HrFbl.js", "/assets/index-B_W-bSKP.js", "/assets/pickAttrs-BDmP-lu7.js", "/assets/index-blh_t3tb.js", "/assets/fade-D5ET0lYX.js", "/assets/useClosable-BIv2YQC7.js", "/assets/extendsObject-C6pccdOq.js", "/assets/Skeleton-c8QWDCRi.js", "/assets/context-C02MQkNA.js", "/assets/PurePanel-DQWTWKaP.js", "/assets/index-BAed6j4S.js", "/assets/EllipsisOutlined-CieEX8qC.js", "/assets/Overflow-CSGCzpcK.js", "/assets/getAllowClear-RJcteg7o.js", "/assets/styleChecker-BoZ39Bhw.js", "/assets/addEventListener-BzkQ-zOx.js", "/assets/index-lDD27JVI.js", "/assets/move-B7plCz5U.js", "/assets/DownOutlined-DatLSNvX.js", "/assets/SearchOutlined-d4YbfynM.js", "/assets/index-DThF2Jli.js", "/assets/index-CPSPtwXn.js", "/assets/LeftOutlined-XQszqjzV.js", "/assets/RightOutlined-ChWhwkp3.js", "/assets/useBreakpoint-B7m96Ekk.js", "/assets/collapse-BbEVqHco.js", "/assets/index-CItnkCRU.js", "/assets/scrollTo-D2JECFlI.js", "/assets/Pagination-sp4ziX3s.js", "/assets/index-BMw-dO_3.js", "/assets/Input-DsPYekik.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "pages/dashboard/orders": { "id": "pages/dashboard/orders", "parentId": "pages/dashboard/layout", "path": "/dashboard/orders", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/orders-B-GgkEwb.js", "imports": ["/assets/with-props-zgZ4Swg7.js", "/assets/chunk-D4RADZKF-DAz_vGcL.js", "/assets/link-D7g_RGP4.js", "/assets/enums-C5TeptIY.js", "/assets/index-Bcho9uyj.js", "/assets/index-DBVo6aQJ.js", "/assets/Table-BbDh7AMc.js", "/assets/button-BHijcmC7.js", "/assets/index-D4ZOqxWl.js", "/assets/index-BAed6j4S.js", "/assets/ContextIsolator-oaooBrlp.js", "/assets/useClosable-BIv2YQC7.js", "/assets/CloseOutlined-Dy2HrFbl.js", "/assets/pickAttrs-BDmP-lu7.js", "/assets/extendsObject-C6pccdOq.js", "/assets/Skeleton-c8QWDCRi.js", "/assets/EllipsisOutlined-CieEX8qC.js", "/assets/Overflow-CSGCzpcK.js", "/assets/getAllowClear-RJcteg7o.js", "/assets/CloseCircleFilled-BB15cPNT.js", "/assets/styleChecker-BoZ39Bhw.js", "/assets/addEventListener-BzkQ-zOx.js", "/assets/index-lDD27JVI.js", "/assets/PurePanel-DQWTWKaP.js", "/assets/move-B7plCz5U.js", "/assets/DownOutlined-DatLSNvX.js", "/assets/SearchOutlined-d4YbfynM.js", "/assets/index-DThF2Jli.js", "/assets/index-CPSPtwXn.js", "/assets/LeftOutlined-XQszqjzV.js", "/assets/RightOutlined-ChWhwkp3.js", "/assets/useBreakpoint-B7m96Ekk.js", "/assets/collapse-BbEVqHco.js", "/assets/index-CItnkCRU.js", "/assets/scrollTo-D2JECFlI.js", "/assets/Pagination-sp4ziX3s.js", "/assets/index-BMw-dO_3.js", "/assets/Input-DsPYekik.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "pages/dashboard/customers": { "id": "pages/dashboard/customers", "parentId": "pages/dashboard/layout", "path": "/dashboard/customers", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/customers-CZok7GjW.js", "imports": ["/assets/with-props-zgZ4Swg7.js", "/assets/chunk-D4RADZKF-DAz_vGcL.js", "/assets/index-DBVo6aQJ.js", "/assets/Table-BbDh7AMc.js", "/assets/button-BHijcmC7.js", "/assets/index-D4ZOqxWl.js", "/assets/Skeleton-c8QWDCRi.js", "/assets/ContextIsolator-oaooBrlp.js", "/assets/CloseOutlined-Dy2HrFbl.js", "/assets/EllipsisOutlined-CieEX8qC.js", "/assets/index-BAed6j4S.js", "/assets/Overflow-CSGCzpcK.js", "/assets/getAllowClear-RJcteg7o.js", "/assets/CloseCircleFilled-BB15cPNT.js", "/assets/styleChecker-BoZ39Bhw.js", "/assets/pickAttrs-BDmP-lu7.js", "/assets/addEventListener-BzkQ-zOx.js", "/assets/index-lDD27JVI.js", "/assets/PurePanel-DQWTWKaP.js", "/assets/move-B7plCz5U.js", "/assets/DownOutlined-DatLSNvX.js", "/assets/SearchOutlined-d4YbfynM.js", "/assets/index-DThF2Jli.js", "/assets/index-CPSPtwXn.js", "/assets/LeftOutlined-XQszqjzV.js", "/assets/RightOutlined-ChWhwkp3.js", "/assets/useBreakpoint-B7m96Ekk.js", "/assets/collapse-BbEVqHco.js", "/assets/index-CItnkCRU.js", "/assets/scrollTo-D2JECFlI.js", "/assets/Pagination-sp4ziX3s.js", "/assets/index-BMw-dO_3.js", "/assets/extendsObject-C6pccdOq.js", "/assets/Input-DsPYekik.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "pages/dashboard/reviews": { "id": "pages/dashboard/reviews", "parentId": "pages/dashboard/layout", "path": "/dashboard/reviews", "index": void 0, "caseSensitive": void 0, "hasAction": true, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/reviews-BSnRzv9c.js", "imports": ["/assets/with-props-zgZ4Swg7.js", "/assets/chunk-D4RADZKF-DAz_vGcL.js", "/assets/image-upload-CdAo5aNq.js", "/assets/utils-CNuFmlBv.js", "/assets/index-BRBbHYnL.js", "/assets/index-B_opkYhe.js", "/assets/button-BHijcmC7.js", "/assets/index-3YpVs0X4.js", "/assets/index-DXFem7WI.js", "/assets/index-DB0Ln5WD.js", "/assets/index-DBVo6aQJ.js", "/assets/Table-BbDh7AMc.js", "/assets/index-C9jnjFYw.js", "/assets/index-D4ZOqxWl.js", "/assets/pickAttrs-BDmP-lu7.js", "/assets/index-BAed6j4S.js", "/assets/ContextIsolator-oaooBrlp.js", "/assets/collapse-BbEVqHco.js", "/assets/fade-D5ET0lYX.js", "/assets/useBreakpoint-B7m96Ekk.js", "/assets/DeleteOutlined-DFutYCzo.js", "/assets/EyeOutlined-6hR7CDcx.js", "/assets/ExclamationCircleFilled-W6vk6RFQ.js", "/assets/getAllowClear-RJcteg7o.js", "/assets/CloseCircleFilled-BB15cPNT.js", "/assets/CloseOutlined-Dy2HrFbl.js", "/assets/PlusOutlined-DUPhCR4c.js", "/assets/AntdIcon-BqQjB-7o.js", "/assets/row-lNwB0GMQ.js", "/assets/index-blh_t3tb.js", "/assets/QuestionCircleOutlined-CkfPyHQh.js", "/assets/convertToTooltipProps-FkdqikIB.js", "/assets/index-B_W-bSKP.js", "/assets/addEventListener-BzkQ-zOx.js", "/assets/LeftOutlined-XQszqjzV.js", "/assets/RightOutlined-ChWhwkp3.js", "/assets/index-DURpipQz.js", "/assets/InfoCircleFilled-Bmgfd1T2.js", "/assets/ActionButton-Lb2x-VjR.js", "/assets/useClosable-BIv2YQC7.js", "/assets/extendsObject-C6pccdOq.js", "/assets/Skeleton-c8QWDCRi.js", "/assets/context-C02MQkNA.js", "/assets/PurePanel-DQWTWKaP.js", "/assets/Input-DsPYekik.js", "/assets/SearchOutlined-d4YbfynM.js", "/assets/TextArea-DuDk0je7.js", "/assets/EllipsisOutlined-CieEX8qC.js", "/assets/Overflow-CSGCzpcK.js", "/assets/styleChecker-BoZ39Bhw.js", "/assets/index-lDD27JVI.js", "/assets/move-B7plCz5U.js", "/assets/DownOutlined-DatLSNvX.js", "/assets/index-DThF2Jli.js", "/assets/index-CPSPtwXn.js", "/assets/index-CItnkCRU.js", "/assets/scrollTo-D2JECFlI.js", "/assets/Pagination-sp4ziX3s.js", "/assets/index-BMw-dO_3.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "pages/dashboard/settings": { "id": "pages/dashboard/settings", "parentId": "pages/dashboard/layout", "path": "/dashboard/settings/:page", "index": void 0, "caseSensitive": void 0, "hasAction": true, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/settings-DZ0QI0Q0.js", "imports": ["/assets/with-props-zgZ4Swg7.js", "/assets/chunk-D4RADZKF-DAz_vGcL.js", "/assets/index-DXFem7WI.js", "/assets/index-BMw-dO_3.js", "/assets/Collapse-cA_bn20i.js", "/assets/index-BRBbHYnL.js", "/assets/index-DB0Ln5WD.js", "/assets/button-BHijcmC7.js", "/assets/editor-D7EsA1Qu.js", "/assets/index-lDD27JVI.js", "/assets/error-page-C3sODFbS.js", "/assets/index-BAed6j4S.js", "/assets/ContextIsolator-oaooBrlp.js", "/assets/index-DBVo6aQJ.js", "/assets/ExclamationCircleFilled-W6vk6RFQ.js", "/assets/CloseCircleFilled-BB15cPNT.js", "/assets/InfoCircleFilled-Bmgfd1T2.js", "/assets/index-D4ZOqxWl.js", "/assets/pickAttrs-BDmP-lu7.js", "/assets/CloseOutlined-Dy2HrFbl.js", "/assets/RightOutlined-ChWhwkp3.js", "/assets/collapse-BbEVqHco.js", "/assets/row-lNwB0GMQ.js", "/assets/index-blh_t3tb.js", "/assets/useBreakpoint-B7m96Ekk.js", "/assets/QuestionCircleOutlined-CkfPyHQh.js", "/assets/convertToTooltipProps-FkdqikIB.js", "/assets/getAllowClear-RJcteg7o.js", "/assets/Input-DsPYekik.js", "/assets/EyeOutlined-6hR7CDcx.js", "/assets/SearchOutlined-d4YbfynM.js", "/assets/TextArea-DuDk0je7.js", "/assets/Overflow-CSGCzpcK.js", "/assets/PurePanel-DQWTWKaP.js", "/assets/move-B7plCz5U.js", "/assets/DownOutlined-DatLSNvX.js", "/assets/link-D7g_RGP4.js", "/assets/index-Bvx8ko_I.js", "/assets/index-CItnkCRU.js", "/assets/Skeleton-c8QWDCRi.js", "/assets/EllipsisOutlined-CieEX8qC.js"], "css": ["/assets/editor-GgiLjRqO.css"], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "pages/dashboard/products": { "id": "pages/dashboard/products", "parentId": "pages/dashboard/layout", "path": "/dashboard/products", "index": void 0, "caseSensitive": void 0, "hasAction": true, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/products-DrgibPTE.js", "imports": ["/assets/with-props-zgZ4Swg7.js", "/assets/chunk-D4RADZKF-DAz_vGcL.js", "/assets/utils-CNuFmlBv.js", "/assets/link-D7g_RGP4.js", "/assets/index-DXFem7WI.js", "/assets/index-B_opkYhe.js", "/assets/index-Bcho9uyj.js", "/assets/index-CItnkCRU.js", "/assets/ExclamationCircleFilled-W6vk6RFQ.js", "/assets/button-BHijcmC7.js", "/assets/index-BAed6j4S.js", "/assets/index-D9CIBdyn.js", "/assets/ActionButton-Lb2x-VjR.js", "/assets/pickAttrs-BDmP-lu7.js", "/assets/QuestionCircleOutlined-CkfPyHQh.js", "/assets/AntdIcon-BqQjB-7o.js", "/assets/index-DBVo6aQJ.js", "/assets/Table-BbDh7AMc.js", "/assets/index-C9jnjFYw.js", "/assets/PlusOutlined-DUPhCR4c.js", "/assets/CloseCircleFilled-BB15cPNT.js", "/assets/InfoCircleFilled-Bmgfd1T2.js", "/assets/index-D4ZOqxWl.js", "/assets/ContextIsolator-oaooBrlp.js", "/assets/CloseOutlined-Dy2HrFbl.js", "/assets/EyeOutlined-6hR7CDcx.js", "/assets/index-B_W-bSKP.js", "/assets/index-blh_t3tb.js", "/assets/fade-D5ET0lYX.js", "/assets/addEventListener-BzkQ-zOx.js", "/assets/LeftOutlined-XQszqjzV.js", "/assets/RightOutlined-ChWhwkp3.js", "/assets/useClosable-BIv2YQC7.js", "/assets/extendsObject-C6pccdOq.js", "/assets/Skeleton-c8QWDCRi.js", "/assets/EllipsisOutlined-CieEX8qC.js", "/assets/Overflow-CSGCzpcK.js", "/assets/getAllowClear-RJcteg7o.js", "/assets/styleChecker-BoZ39Bhw.js", "/assets/index-lDD27JVI.js", "/assets/PurePanel-DQWTWKaP.js", "/assets/move-B7plCz5U.js", "/assets/DownOutlined-DatLSNvX.js", "/assets/SearchOutlined-d4YbfynM.js", "/assets/index-DThF2Jli.js", "/assets/index-CPSPtwXn.js", "/assets/useBreakpoint-B7m96Ekk.js", "/assets/collapse-BbEVqHco.js", "/assets/scrollTo-D2JECFlI.js", "/assets/Pagination-sp4ziX3s.js", "/assets/index-BMw-dO_3.js", "/assets/Input-DsPYekik.js", "/assets/TextArea-DuDk0je7.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "pages/dashboard/create-product": { "id": "pages/dashboard/create-product", "parentId": "pages/dashboard/layout", "path": "/dashboard/products/create", "index": void 0, "caseSensitive": void 0, "hasAction": true, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/create-product-DliA8j0_.js", "imports": ["/assets/with-props-zgZ4Swg7.js", "/assets/chunk-D4RADZKF-DAz_vGcL.js", "/assets/editor-D7EsA1Qu.js", "/assets/image-upload-CdAo5aNq.js", "/assets/utils-CNuFmlBv.js", "/assets/index-BRBbHYnL.js", "/assets/index-DBVo6aQJ.js", "/assets/index-DB0Ln5WD.js", "/assets/row-lNwB0GMQ.js", "/assets/index-axsys1ZB.js", "/assets/button-BHijcmC7.js", "/assets/index-D4ZOqxWl.js", "/assets/pickAttrs-BDmP-lu7.js", "/assets/index-BAed6j4S.js", "/assets/ContextIsolator-oaooBrlp.js", "/assets/collapse-BbEVqHco.js", "/assets/fade-D5ET0lYX.js", "/assets/useBreakpoint-B7m96Ekk.js", "/assets/DeleteOutlined-DFutYCzo.js", "/assets/EyeOutlined-6hR7CDcx.js", "/assets/ExclamationCircleFilled-W6vk6RFQ.js", "/assets/getAllowClear-RJcteg7o.js", "/assets/CloseCircleFilled-BB15cPNT.js", "/assets/CloseOutlined-Dy2HrFbl.js", "/assets/index-B_opkYhe.js", "/assets/index-B_W-bSKP.js", "/assets/index-blh_t3tb.js", "/assets/addEventListener-BzkQ-zOx.js", "/assets/LeftOutlined-XQszqjzV.js", "/assets/RightOutlined-ChWhwkp3.js", "/assets/PlusOutlined-DUPhCR4c.js", "/assets/AntdIcon-BqQjB-7o.js", "/assets/QuestionCircleOutlined-CkfPyHQh.js", "/assets/convertToTooltipProps-FkdqikIB.js", "/assets/Skeleton-c8QWDCRi.js", "/assets/EllipsisOutlined-CieEX8qC.js", "/assets/Overflow-CSGCzpcK.js", "/assets/Input-DsPYekik.js", "/assets/SearchOutlined-d4YbfynM.js", "/assets/TextArea-DuDk0je7.js", "/assets/DownOutlined-DatLSNvX.js"], "css": ["/assets/editor-GgiLjRqO.css"], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "pages/dashboard/edit-product": { "id": "pages/dashboard/edit-product", "parentId": "pages/dashboard/layout", "path": "/dashboard/products/:id/edit", "index": void 0, "caseSensitive": void 0, "hasAction": true, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/edit-product-CkDOIIwC.js", "imports": ["/assets/with-props-zgZ4Swg7.js", "/assets/chunk-D4RADZKF-DAz_vGcL.js", "/assets/editor-D7EsA1Qu.js", "/assets/image-upload-CdAo5aNq.js", "/assets/utils-CNuFmlBv.js", "/assets/index-BRBbHYnL.js", "/assets/index-DBVo6aQJ.js", "/assets/index-DB0Ln5WD.js", "/assets/row-lNwB0GMQ.js", "/assets/index-axsys1ZB.js", "/assets/button-BHijcmC7.js", "/assets/index-D4ZOqxWl.js", "/assets/pickAttrs-BDmP-lu7.js", "/assets/index-BAed6j4S.js", "/assets/ContextIsolator-oaooBrlp.js", "/assets/collapse-BbEVqHco.js", "/assets/fade-D5ET0lYX.js", "/assets/useBreakpoint-B7m96Ekk.js", "/assets/DeleteOutlined-DFutYCzo.js", "/assets/EyeOutlined-6hR7CDcx.js", "/assets/ExclamationCircleFilled-W6vk6RFQ.js", "/assets/getAllowClear-RJcteg7o.js", "/assets/CloseCircleFilled-BB15cPNT.js", "/assets/CloseOutlined-Dy2HrFbl.js", "/assets/index-B_opkYhe.js", "/assets/index-B_W-bSKP.js", "/assets/index-blh_t3tb.js", "/assets/addEventListener-BzkQ-zOx.js", "/assets/LeftOutlined-XQszqjzV.js", "/assets/RightOutlined-ChWhwkp3.js", "/assets/PlusOutlined-DUPhCR4c.js", "/assets/AntdIcon-BqQjB-7o.js", "/assets/QuestionCircleOutlined-CkfPyHQh.js", "/assets/convertToTooltipProps-FkdqikIB.js", "/assets/Skeleton-c8QWDCRi.js", "/assets/EllipsisOutlined-CieEX8qC.js", "/assets/Overflow-CSGCzpcK.js", "/assets/Input-DsPYekik.js", "/assets/SearchOutlined-d4YbfynM.js", "/assets/TextArea-DuDk0je7.js", "/assets/DownOutlined-DatLSNvX.js"], "css": ["/assets/editor-GgiLjRqO.css"], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "pages/dashboard/upload": { "id": "pages/dashboard/upload", "parentId": "pages/dashboard/layout", "path": "/dashboard/upload", "index": void 0, "caseSensitive": void 0, "hasAction": true, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/upload-l0sNRNKZ.js", "imports": [], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 } }, "url": "/assets/manifest-7419e98c.js", "version": "7419e98c", "sri": void 0 };
const assetsBuildDirectory = "build/client";
const basename = "/";
const future = { "unstable_middleware": false, "unstable_optimizeDeps": false, "unstable_splitRouteModules": false, "unstable_subResourceIntegrity": false, "unstable_viteEnvironmentApi": false };
const ssr = true;
const isSpaMode = false;
const prerender = [];
const routeDiscovery = { "mode": "lazy", "manifestPath": "/__manifest" };
const publicPath = "/";
const entry = { module: entryServer };
const routes = {
  "root": {
    id: "root",
    parentId: void 0,
    path: "",
    index: void 0,
    caseSensitive: void 0,
    module: route0
  },
  "pages/public/layout": {
    id: "pages/public/layout",
    parentId: "root",
    path: void 0,
    index: void 0,
    caseSensitive: void 0,
    module: route1
  },
  "pages/public/index": {
    id: "pages/public/index",
    parentId: "pages/public/layout",
    path: void 0,
    index: true,
    caseSensitive: void 0,
    module: route2
  },
  "pages/public/shop": {
    id: "pages/public/shop",
    parentId: "pages/public/layout",
    path: "/shop",
    index: void 0,
    caseSensitive: void 0,
    module: route3
  },
  "pages/public/shop.$id": {
    id: "pages/public/shop.$id",
    parentId: "pages/public/layout",
    path: "/shop/:id",
    index: void 0,
    caseSensitive: void 0,
    module: route4
  },
  "pages/public/show-page": {
    id: "pages/public/show-page",
    parentId: "pages/public/layout",
    path: "/pages/:page",
    index: void 0,
    caseSensitive: void 0,
    module: route5
  },
  "pages/public/contact": {
    id: "pages/public/contact",
    parentId: "pages/public/layout",
    path: "/contact",
    index: void 0,
    caseSensitive: void 0,
    module: route6
  },
  "pages/public/checkout": {
    id: "pages/public/checkout",
    parentId: "pages/public/layout",
    path: "/checkout",
    index: void 0,
    caseSensitive: void 0,
    module: route7
  },
  "pages/public/show-order": {
    id: "pages/public/show-order",
    parentId: "pages/public/layout",
    path: "/orders/:id",
    index: void 0,
    caseSensitive: void 0,
    module: route8
  },
  "pages/public/checkout.payment_status": {
    id: "pages/public/checkout.payment_status",
    parentId: "pages/public/layout",
    path: "/checkout/payment_status",
    index: void 0,
    caseSensitive: void 0,
    module: route9
  },
  "pages/auth/login": {
    id: "pages/auth/login",
    parentId: "pages/public/layout",
    path: "/login",
    index: void 0,
    caseSensitive: void 0,
    module: route10
  },
  "pages/auth/register": {
    id: "pages/auth/register",
    parentId: "pages/public/layout",
    path: "/register",
    index: void 0,
    caseSensitive: void 0,
    module: route11
  },
  "pages/auth/logout": {
    id: "pages/auth/logout",
    parentId: "pages/public/layout",
    path: "/logout",
    index: void 0,
    caseSensitive: void 0,
    module: route12
  },
  "pages/dashboard/layout": {
    id: "pages/dashboard/layout",
    parentId: "root",
    path: "/dashboard",
    index: void 0,
    caseSensitive: void 0,
    module: route13
  },
  "pages/dashboard/index": {
    id: "pages/dashboard/index",
    parentId: "pages/dashboard/layout",
    path: void 0,
    index: true,
    caseSensitive: void 0,
    module: route14
  },
  "pages/dashboard/feedbacks": {
    id: "pages/dashboard/feedbacks",
    parentId: "pages/dashboard/layout",
    path: "/dashboard/feedbacks",
    index: void 0,
    caseSensitive: void 0,
    module: route15
  },
  "pages/dashboard/orders": {
    id: "pages/dashboard/orders",
    parentId: "pages/dashboard/layout",
    path: "/dashboard/orders",
    index: void 0,
    caseSensitive: void 0,
    module: route16
  },
  "pages/dashboard/customers": {
    id: "pages/dashboard/customers",
    parentId: "pages/dashboard/layout",
    path: "/dashboard/customers",
    index: void 0,
    caseSensitive: void 0,
    module: route17
  },
  "pages/dashboard/reviews": {
    id: "pages/dashboard/reviews",
    parentId: "pages/dashboard/layout",
    path: "/dashboard/reviews",
    index: void 0,
    caseSensitive: void 0,
    module: route18
  },
  "pages/dashboard/settings": {
    id: "pages/dashboard/settings",
    parentId: "pages/dashboard/layout",
    path: "/dashboard/settings/:page",
    index: void 0,
    caseSensitive: void 0,
    module: route19
  },
  "pages/dashboard/products": {
    id: "pages/dashboard/products",
    parentId: "pages/dashboard/layout",
    path: "/dashboard/products",
    index: void 0,
    caseSensitive: void 0,
    module: route20
  },
  "pages/dashboard/create-product": {
    id: "pages/dashboard/create-product",
    parentId: "pages/dashboard/layout",
    path: "/dashboard/products/create",
    index: void 0,
    caseSensitive: void 0,
    module: route21
  },
  "pages/dashboard/edit-product": {
    id: "pages/dashboard/edit-product",
    parentId: "pages/dashboard/layout",
    path: "/dashboard/products/:id/edit",
    index: void 0,
    caseSensitive: void 0,
    module: route22
  },
  "pages/dashboard/upload": {
    id: "pages/dashboard/upload",
    parentId: "pages/dashboard/layout",
    path: "/dashboard/upload",
    index: void 0,
    caseSensitive: void 0,
    module: route23
  }
};
export {
  serverManifest as assets,
  assetsBuildDirectory,
  basename,
  entry,
  future,
  isSpaMode,
  prerender,
  publicPath,
  routeDiscovery,
  routes,
  ssr
};

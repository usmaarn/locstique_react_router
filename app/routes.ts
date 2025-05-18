import {
  type RouteConfig,
  index,
  layout,
  route,
} from "@react-router/dev/routes";

export default [
  layout("./pages/public/layout.tsx", [
    index("pages/public/index.tsx"),
    route("/shop", "pages/public/shop.tsx"),
    route("/shop/:id", "pages/public/shop.$id.tsx"),
    route("/pages/:page", "pages/public/show-page.tsx"),
    route("/contact", "pages/public/contact.tsx"),
    route("/checkout", "pages/public/checkout.tsx"),
    route("/orders/:id", "pages/public/show-order.tsx"),
    route(
      "/checkout/payment_status",
      "pages/public/checkout.payment_status.tsx"
    ),

    route("/login", "pages/auth/login.tsx"),
    route("/register", "pages/auth/register.tsx"),
    route("/logout", "pages/auth/logout.tsx"),
  ]),

  route("/dashboard", "./pages/dashboard/layout.tsx", [
    index("pages/dashboard/index.tsx"),

    route("/dashboard/feedbacks", "pages/dashboard/feedbacks.tsx"),
    route("/dashboard/orders", "pages/dashboard/orders.tsx"),
    route("/dashboard/customers", "pages/dashboard/customers.tsx"),
    route("/dashboard/reviews", "pages/dashboard/reviews.tsx"),
    route("/dashboard/settings/:page", "pages/dashboard/settings.tsx"),

    route("/dashboard/products", "pages/dashboard/products.tsx"),
    route("/dashboard/products/create", "pages/dashboard/create-product.tsx"),
    route("/dashboard/products/:id/edit", "pages/dashboard/edit-product.tsx"),

    route("/dashboard/upload", "pages/dashboard/upload.tsx"),
  ]),
] satisfies RouteConfig;

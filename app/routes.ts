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
    route("/pages/:page", "pages/public/pages.$page.tsx"),
    route("/contact", "pages/public/contact.tsx"),
    route("/checkout", "pages/public/checkout.tsx"),
    route("/orders/:id", "pages/public/orders.$id.tsx"),
    route(
      "/checkout/payment_status",
      "pages/public/checkout.payment_status.tsx"
    ),
  ]),
] satisfies RouteConfig;

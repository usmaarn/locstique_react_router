import { settingsService } from "~/services/settings-service.server";

async function initialize() {
  await settingsService.set("home_page", {
    hero_heading: "Find Your Glow.",
    sub_heading: "Buy from us and get free and cheap offers.",
  });
  await settingsService.set("terms_of_service", { title: "Terms of Service" });
  await settingsService.set("shipping_policy", { title: "Shipping Policy" });
  await settingsService.set("refund_policy", { title: "Refund Policy" });
}

await initialize();
console.log("Database Inilialized");
process.exit(0);

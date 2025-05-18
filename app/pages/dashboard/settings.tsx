import { Card, Segmented } from "antd";
import HomePageSettings from "~/components/dashboard/home-settings";
import { PageSettings } from "~/components/dashboard/page-settings";
import type { Route } from "./+types/settings";
import { useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { settingsService } from "~/services/settings-service.server";
import { error } from "console";

export async function loader({ params }: Route.LoaderArgs) {
  const record = await settingsService.get(params.page);
  if (record) {
    return { settings: record.value };
  }
  throw error("Page not found", 404);
}

export async function action({ params, request }: Route.LoaderArgs) {
  const body = await request.json();
  await settingsService.set(params.page, body);
  return { success: true };
}

export default function Page({ params }: Route.ComponentProps) {
  const navigate = useNavigate();
  const pages = [
    {
      key: "home_page",
      label: "Home Page",
      children: <HomePageSettings />,
    },
    {
      key: "shipping_policy",
      label: "Shipping Policy",
      children: <PageSettings />,
    },
    {
      key: "terms_of_service",
      label: "Terms of Service",
      children: <PageSettings />,
    },
    {
      key: "refund_policy",
      label: "Refund Policy",
      children: <PageSettings />,
    },
  ];

  const [currentPage, setCurrentPage] = useState(pages[0]);

  useEffect(() => {
    const page = pages.find((p) => p.key === params.page);
    if (page) {
      setCurrentPage(page);
    }
  }, [params.page]);

  return (
    <>
      <Segmented
        options={pages.map((page) => ({ value: page.key, label: page.label }))}
        style={{
          marginBottom: 10,
          width: "100%",
          overflowX: "auto",
          paddingBlockEnd: 10,
        }}
        defaultValue={params.page}
        onChange={(v) => navigate(`/dashboard/settings/${v}`)}
      />
      <Card title={currentPage?.label}>{currentPage?.children}</Card>
    </>
  );
}

import { MenuUnfoldOutlined } from "@ant-design/icons";
import { Affix, Button, Layout } from "antd";
import { useEffect, useState } from "react";
import { Outlet, redirect, useNavigation } from "react-router";
import AppLogo from "~/components/app-logo";
import Sidebar from "~/components/sidebar";
import UserMenu from "~/components/user-menu";
import { cn } from "~/lib/utils";
import type { Route } from "./+types";
import { getSession } from "~/session.server";
import { sessionService } from "~/services/session-service.server";
import { UserType } from "~/lib/enums";

export async function loader({ request }: Route.LoaderArgs) {
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

export default function DashboardLayout() {
  const [open, setOpen] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    setOpen(false);
  }, [navigation.location]);

  return (
    <Layout className="h-screen! flex! max-w-screen! overflow-x-hidden!">
      <Sidebar open={open} />
      <Layout className="h-full! max-w-full! overflow-x-hidden! overflow-y-auto!">
        <Affix>
          <Layout.Header
            className={cn(
              "shadow sticky top-0 z-10 bg-white! px-5! flex items-center justify-between"
            )}
          >
            <div className="flex items-center">
              <AppLogo className="text-xl! md:hidden" />
            </div>
            <div className="flex items-center gap-2">
              {/* <NotificationMenu /> */}
              <UserMenu />
              <Button
                onClick={() => setOpen(!open)}
                icon={<MenuUnfoldOutlined />}
              />
            </div>
          </Layout.Header>
        </Affix>
        <Layout.Content className={cn("p-3 max-w-full!")}>
          <Outlet />
        </Layout.Content>
        <Layout.Footer></Layout.Footer>
      </Layout>
    </Layout>
  );
}

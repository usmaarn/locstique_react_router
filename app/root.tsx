import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useNavigation,
} from "react-router";

import type { Route } from "./+types/root";
import "./styles/app.css";
import AppProvider from "./providers/app-provider";
import "@ant-design/v5-patch-for-react-19";
import { Spin } from "antd";
import { config } from "./lib/config";
import { getSession } from "./session.server";
import { sessionService } from "./services/session-service.server";
import ErrorPage from "./components/error-page";

export const links: Route.LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
];

export function meta({}: Route.MetaArgs) {
  return [
    { title: `${config.appName}` },
    { name: "description", content: "Welcome to Locstique!" },
  ];
}

export async function loader({ request }: Route.LoaderArgs) {
  const session = await getSession(request.headers.get("Cookie"));
  const sessionId = session.get("userId");

  if (sessionId) {
    const result = await sessionService.validateSessionToken(sessionId);
    if (result.user) {
      const { password, ...user } = result.user;
      return { user };
    }
    return result;
  }
}

export async function clientLoader({ serverLoader }: Route.ClientLoaderArgs) {
  const appVersion = localStorage.getItem(config.storage.appVersion);
  if (!appVersion || appVersion != config.appVersion) {
    localStorage.removeItem(config.storage.cartName);
    localStorage.removeItem(config.storage.authName);
    localStorage.removeItem(config.storage.tokenName);
    localStorage.setItem(config.storage.appVersion, config.appVersion);
  }

  const response = await serverLoader();
  localStorage.setItem(
    config.storage.authName,
    JSON.stringify(response?.user ?? "")
  );
}

export function Layout({ children }: { children: React.ReactNode }) {
  const navigation = useNavigation();
  const isNavigating = Boolean(navigation.location);

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <AppProvider>
          <Spin spinning={isNavigating} fullscreen />
          {children}
        </AppProvider>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}

export function ErrorBoundary({
  error,
}: Route.ErrorBoundaryProps & { error: any }) {
  return (
    <ErrorPage
      status={error?.status === 404 ? 404 : 500}
      message={error.status === 404 ? "Page Not Found" : undefined}
      details={
        error.status === 404
          ? "The page you are looking for does not exist"
          : undefined
      }
    />
  );
}

import {
  isRouteErrorResponse,
  Link,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useNavigate,
  useNavigation,
} from "react-router";

import type { Route } from "./+types/root";
import "./styles/app.css";
import AppProvider from "./providers/app-provider";
import "@ant-design/v5-patch-for-react-19";
import { Button, Result, Space, Spin } from "antd";
import { config } from "./lib/config";
import { getSession } from "./session.server";
import { sessionService } from "./services/session-service.server";

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

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  const navigate = useNavigate();
  let details = "An unexpected error occurred.";
  let message = "Interna Server Error";
  let status = 500;
  // console.log(error);

  if (isRouteErrorResponse(error)) {
    if (error.status === 404) {
      message = "Page Not Found";
      status = 404;
      details = "The page you are looking for does not exist";
    }
  }

  return (
    <main className="pt-16 p-4 container mx-auto">
      <Result
        status={status as 500}
        title={message}
        subTitle={details}
        extra={
          <Space>
            <Link to="/">
              <Button type="primary">Back to Home</Button>
            </Link>
            {status !== 404 && (
              <Button onClick={() => navigate(0)} color="blue" variant="solid">
                Reload Page
              </Button>
            )}
          </Space>
        }
      />
    </main>
  );
}

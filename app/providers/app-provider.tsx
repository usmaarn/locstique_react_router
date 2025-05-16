import { StyleProvider } from "@ant-design/cssinjs";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { App, ConfigProvider } from "antd";
import { type ReactNode } from "react";
import { CartProvider } from "./cart-provider";

const queryClient = new QueryClient();

export default function AppProvider({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <StyleProvider hashPriority="high" layer={false}>
        <ConfigProvider
          theme={{
            token: {
              colorPrimary: "#1e2939",
              colorLink: "#1e2939",
              // borderRadius: 0,
              // fontFamily: '"Noto Sans", sans-serif',
            },
            components: {
              Typography: {
                titleMarginBottom: 0,
                titleMarginTop: 0,
                margin: 0,
              },
            },
          }}
        >
          <CartProvider>
            <App>{children}</App>
          </CartProvider>
        </ConfigProvider>
      </StyleProvider>
    </QueryClientProvider>
  );
}

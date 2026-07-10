"use client";

import { ThemeProvider } from "next-themes";
import ReduxProvider from "./redux-provider";
import QueryProvider from "./query-provider";
import { AuthInitializer } from "@/features/auth";
import { Toaster } from "@/components/ui/sonner";
import SocketProvider from "@/components/providers/socket-provider";

export default function Providers({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ReduxProvider>
      <QueryProvider>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <AuthInitializer>
            <SocketProvider>
              {children}
              <Toaster position="top-right" richColors />
            </SocketProvider>
          </AuthInitializer>
        </ThemeProvider>
      </QueryProvider>
    </ReduxProvider>
  );
}
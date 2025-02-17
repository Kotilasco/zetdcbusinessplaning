import "flatpickr/dist/flatpickr.min.css";
import "jsvectormap/dist/css/jsvectormap.css";
import "@/css/satoshi.css";
import "@/css/style.css";
import React, { useEffect, useState } from "react";
import Loader from "@/components/common/Loader";
import { Toaster } from "@/components/ui/toaster";
import { Inter } from "next/font/google";
import { auth } from "@/auth";
import { SessionProvider } from "next-auth/react";
import StoreProvider from "./StoreProvider";
import { CodeStoreProvider } from "@/providers/Code-Provider";
import ErrorBoundary from "@/components/ErrorBoundary";

const inter = Inter({ subsets: ["latin"] });

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  /*   const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState<boolean>(true); */

  // const pathname = usePathname();

  return (
    <SessionProvider session={session}>
      <html lang="en">
        <body
          suppressHydrationWarning={true}
          className={`${inter.className} antialiased`}
        >
          <CodeStoreProvider>
            <StoreProvider>
              <ErrorBoundary>
                <Toaster />
                {children}
              </ErrorBoundary>
            </StoreProvider>
          </CodeStoreProvider>
        </body>
      </html>
    </SessionProvider>
  );
}

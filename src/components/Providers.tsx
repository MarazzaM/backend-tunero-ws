"use client";

import { ReactNode } from "react";
import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "@/components/ui/modular/theme-provider";

interface Props {
  children: ReactNode;
}

const Providers = ({ children }: Props) => {
  return (
    <html lang="es" suppressHydrationWarning>
      <body>

    <SessionProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        {children}
      </ThemeProvider>
    </SessionProvider>
    </body>
    </html>

  );
};

export default Providers;

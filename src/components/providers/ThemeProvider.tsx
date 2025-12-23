"use client"
import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"
// Basic props since types from dist are sometimes missing in v0.4
interface ThemeProviderProps {
    children: React.ReactNode;
    attribute?: string;
    defaultTheme?: string;
    enableSystem?: boolean;
    storageKey?: string;
}

// Bypass complex type issues with v0.4
export function ThemeProvider({ children, ...props }: any) {
    return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}

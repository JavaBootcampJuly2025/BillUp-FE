// src/app/ClientProviders.tsx
"use client";

import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "@/providers/AuthProvider";

export function ClientProviders({ children }: { children: React.ReactNode }) {
    return (
        <BrowserRouter>
            <AuthProvider>
                {children}
            </AuthProvider>
        </BrowserRouter>
    );
}

// src/components/PageContent.tsx
"use client";

import { ReactNode, useContext } from "react";
import { AuthContext } from "@/context/AuthContext";       // same import path
import Navbar from "./Navbar/Navbar";

export default function PageContent({ children }: { children: ReactNode }) {
    const auth = useContext(AuthContext);
    if (!auth || !auth.hasHydrated) return null;

    return (
        <>
            {auth.isLoggedIn() && <Navbar />}
            {children}
        </>
    );
}

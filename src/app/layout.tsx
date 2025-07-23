// src/app/layout.tsx
import "./globals.css";
import { ClientProviders } from "./ClientProviders";
import { Box } from "@mui/material";
import Navbar from "@/components/Navbar/Navbar";

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
        <body>
        <ClientProviders>
            <Box>
                {/* always show the navbar */}
                <Navbar />

                {/* page content goes here */}
                <Box
                    sx={{
                        height: "calc(100vh - 64px)",
                        overflowY: "auto",
                        backgroundColor: "white",
                        color: "black",
                    }}
                >
                    {children}
                </Box>
            </Box>
        </ClientProviders>
        </body>
        </html>
    );
}

// components/GradientLayout.tsx
import { ReactNode } from "react";

interface GradientLayoutProps {
    children: ReactNode;
}

export default function GradientLayout({ children }: GradientLayoutProps) {
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-300 to-purple-400 flex items-center justify-center">
            {children}
        </div>
    );
}

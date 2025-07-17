// Example nav (add to your layout or _app.tsx)
import Link from "next/link";

export default function Nav() {
    return (
        <nav className="flex gap-4 p-4 bg-gray-200">
            <Link href="/register">Register</Link>
            <Link href="/login">Login</Link>
        </nav>
    );
}
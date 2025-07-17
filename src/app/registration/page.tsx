"use client";
import { useState } from "react";
import { registerUser } from "@/utils/api";
import { useRouter } from "next/navigation";

export default function RegistrationPage() {
    const [form, setForm] = useState({
        name: "",
        surname: "",
        email: "",
        password: "",
        phoneNumber: "",
    });
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const router = useRouter();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setSuccess("");
        try {
            await registerUser(form);
            setSuccess("Registration successful! Redirecting...");
            setTimeout(() => router.push("/login"), 1200);
        } catch (err: any) {
            setError(err.message || "Registration failed");
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50">
            <form
                onSubmit={handleSubmit}
                className="bg-white p-8 rounded-xl shadow-xl w-full max-w-md space-y-4"
            >
                <h2 className="text-2xl font-bold mb-2">Register</h2>
                {error && <div className="text-red-500">{error}</div>}
                {success && <div className="text-green-600">{success}</div>}
                <input
                    name="name"
                    placeholder="Name"
                    onChange={handleChange}
                    value={form.name}
                    className="w-full border p-2 rounded"
                    required
                />
                <input
                    name="surname"
                    placeholder="Surname"
                    onChange={handleChange}
                    value={form.surname}
                    className="w-full border p-2 rounded"
                    required
                />
                <input
                    name="email"
                    type="email"
                    placeholder="Email"
                    onChange={handleChange}
                    value={form.email}
                    className="w-full border p-2 rounded"
                    required
                />
                <input
                    name="password"
                    type="password"
                    placeholder="Password"
                    onChange={handleChange}
                    value={form.password}
                    className="w-full border p-2 rounded"
                    required
                    minLength={8}
                />
                <input
                    name="phoneNumber"
                    placeholder="Phone Number"
                    onChange={handleChange}
                    value={form.phoneNumber}
                    className="w-full border p-2 rounded"
                    required
                />
                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
                >
                    Register
                </button>
            </form>
        </div>
    );
}

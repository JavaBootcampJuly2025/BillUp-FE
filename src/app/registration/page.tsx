"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthentication } from "@/hooks/useAuthentication";
import { RegistrationForm, ResidenceRequest } from "@/app/registration/types";

const mockAddresses = [
    {
        full: "Gedimino pr. 9",
        city: "Vilnius",
        postalCode: "LT-01103",
        country: "Lithuania",
    },
    {
        full: "Antakalnio g. 12",
        city: "Vilnius",
        postalCode: "LT-10232",
        country: "Lithuania",
    },
    {
        full: "10 Downing Street, London",
        city: "London",
        postalCode: "SW1A 2AA",
        country: "UK",
    },
    {
        full: "Brīvības iela 21",
        city: "Riga",
        postalCode: "LV-1010",
        country: "Latvia",
    },
    {
        full: "Khreshchatyk St, 22",
        city: "Kyiv",
        postalCode: "01001",
        country: "Ukraine",
    },
    {
        full: "Deribasivska St, 5",
        city: "Odesa",
        postalCode: "65000",
        country: "Ukraine",
    },
    {
        full: "Pärnu mnt 10",
        city: "Tallinn",
        postalCode: "10148",
        country: "Estonia",
    },
    {
        full: "Riia 2",
        city: "Tartu",
        postalCode: "51004",
        country: "Estonia",
    },
];

export default function RegistrationPage() {
    const [form, setForm] = useState<RegistrationForm>({
        name: "",
        surname: "",
        email: "",
        password: "",
        phoneNumber: "",
        role: "CLIENT",
        residenceRequest: {
            streetAddress: "",
            flatNumber: "",
            city: "",
            postalCode: "",
            country: "",
            residenceType: "HOUSE",
            isPrimary: true,
        },
    });

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const router = useRouter();
    const { registerUser } = useAuthentication();

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;

        if (name.startsWith("residence_")) {
            const key = name.replace("residence_", "") as keyof ResidenceRequest;

            if (key === "streetAddress") {
                const match = mockAddresses.find((addr) => addr.full === value);

                setForm((prev) => {
                    const prevResidence = prev.residenceRequest!;

                    if (match) {
                        return {
                            ...prev,
                            residenceRequest: {
                                ...prevResidence,
                                streetAddress: value,
                                city: match.city,
                                postalCode: match.postalCode,
                                country: match.country,
                            },
                        };
                    }

                    return {
                        ...prev,
                        residenceRequest: {
                            ...prevResidence,
                            streetAddress: value,
                        },
                    };
                });

                return;
            } else {
                setForm((prev) => ({
                    ...prev,
                    residenceRequest: {
                        ...prev.residenceRequest!,
                        [key]: value,
                    },
                }));
                return;
            }

        } else {
            const isRoleChangeToCompany = name === "role" && value === "COMPANY";
            const isRoleChangeToClient = name === "role" && value === "CLIENT";

            setForm((prev) => ({
                ...prev,
                [name]: value,
                ...(isRoleChangeToCompany
                    ? { surname: "", residenceRequest: undefined }
                    : isRoleChangeToClient && !prev.residenceRequest
                        ? {
                            residenceRequest: {
                                streetAddress: "",
                                flatNumber: "",
                                city: "",
                                postalCode: "",
                                country: "",
                                residenceType: "HOUSE",
                                isPrimary: true,
                            },
                        }
                        : {}),
            }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        try {
            await registerUser(form);
            setSuccess("Registration successful! Redirecting...");
            setTimeout(() => router.push("/login"), 1500);
        } catch (err: any) {
            setError(err?.message || "Registration failed");
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-r from-green-200 to-cyan-200 flex items-center justify-center pt-10">
            <form
                onSubmit={handleSubmit}
                className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md space-y-4"
            >
                <h2 className="text-3xl font-bold text-center mb-4">Register</h2>
                {error && <div className="text-[#E95B5E]">{error}</div>}
                {success && <div className="text-[#10b981]">{success}</div>}

                <select
                    name="role"
                    onChange={handleChange}
                    value={form.role}
                    className="w-full border border-gray-300 p-2 rounded"
                >
                    <option value="CLIENT">Client</option>
                    <option value="COMPANY">Company</option>
                </select>

                <input
                    name="name"
                    placeholder="Name"
                    onChange={handleChange}
                    value={form.name}
                    className="w-full border border-gray-300 p-2 rounded"
                    required
                />

                {form.role === "CLIENT" && (
                    <input
                        name="surname"
                        placeholder="Surname"
                        onChange={handleChange}
                        value={form.surname}
                        className="w-full border border-gray-300 p-2 rounded"
                        required
                    />
                )}

                <input
                    name="email"
                    type="email"
                    placeholder="Email"
                    onChange={handleChange}
                    value={form.email}
                    className="w-full border border-gray-300 p-2 rounded"
                    required
                />
                <input
                    name="password"
                    type="password"
                    placeholder="Password"
                    onChange={handleChange}
                    value={form.password}
                    className="w-full border border-gray-300 p-2 rounded"
                    required
                    minLength={6}
                />
                <input
                    name="phoneNumber"
                    placeholder="Phone Number"
                    onChange={handleChange}
                    value={form.phoneNumber}
                    className="w-full border border-gray-300 p-2 rounded"
                    required
                />

                {form.role === "CLIENT" && form.residenceRequest && (
                    <>
                        <hr />
                        <h3 className="text-lg text-gray-700 font-semibold">Residence Info</h3>

                        <input
                            list="address-list"
                            name="residence_streetAddress"
                            placeholder="Street Address"
                            onChange={handleChange}
                            value={form.residenceRequest.streetAddress}
                            className="w-full border border-gray-300 p-2 rounded"
                            required
                        />
                        <datalist id="address-list">
                            {mockAddresses.map((addr) => (
                                <option key={addr.full} value={addr.full} />
                            ))}
                        </datalist>

                        <input
                            name="residence_flatNumber"
                            placeholder="Flat Number (optional)"
                            onChange={handleChange}
                            value={form.residenceRequest.flatNumber}
                            className="w-full border border-gray-300 p-2 rounded"
                        />
                        <input
                            name="residence_city"
                            placeholder="City"
                            onChange={handleChange}
                            value={form.residenceRequest.city}
                            className="w-full border border-gray-300 p-2 rounded"
                            required
                        />
                        <input
                            name="residence_postalCode"
                            placeholder="Postal Code"
                            onChange={handleChange}
                            value={form.residenceRequest.postalCode}
                            className="w-full border border-gray-300 p-2 rounded"
                            required
                        />
                        <input
                            name="residence_country"
                            placeholder="Country"
                            onChange={handleChange}
                            value={form.residenceRequest.country}
                            className="w-full border border-gray-300 p-2 rounded"
                            required
                        />
                        <select
                            name="residence_residenceType"
                            value={form.residenceRequest.residenceType}
                            onChange={handleChange}
                            className="w-full border border-gray-300 p-2 rounded"
                        >
                            <option value="HOUSE">House</option>
                            <option value="FLAT">Flat</option>
                        </select>
                    </>
                )}

                <button
                    type="submit"
                    className="w-full bg-[#10b981] text-white font-semibold py-2 rounded hover:bg-[#059669] transition shadow-lg"
                >
                    Register
                </button>
            </form>
        </div>
    );
}

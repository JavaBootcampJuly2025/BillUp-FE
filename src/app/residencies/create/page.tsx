"use client";

import { useState, useEffect } from "react";
import {
    Box,
    TextField,
    MenuItem,
    FormControlLabel,
    Checkbox,
    Button,
    Typography,
    Autocomplete,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { useResidences } from "@/hooks/useResidencies";
import type { CreateResidenceRequest } from "@/hooks/useResidencies";

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

export default function CreateResidencePage() {
    const router = useRouter();
    const { createResidence } = useResidences();

    const [values, setValues] = useState({
        streetAddress: "",
        flatNumber: "",
        city: "",
        postalCode: "",
        country: "",
        residenceType: "FLAT" as "FLAT" | "HOUSE",
        isPrimary: false,
    });
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handle = <K extends keyof typeof values>(
        key: K,
        val: typeof values[K]
    ) => setValues((v) => ({ ...v, [key]: val }));

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        setError(null);

        const payload: CreateResidenceRequest = {
            streetAddress: values.streetAddress,
            flatNumber: values.flatNumber || undefined,
            city: values.city,
            postalCode: values.postalCode,
            country: values.country,
            residenceType: values.residenceType,
            primary: values.isPrimary,
        };

        try {
            await createResidence(payload);
            router.push("/residencies");
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "Unknown error");
            setSubmitting(false);
        }
    };

    return (
        <Box
            sx={{
                minHeight: "100vh",
                background: "linear-gradient(to bottom right, #bfdbfe, #bbf7d0)",
                py: 6,
                px: 2,
            }}
        >
            <Box
                component="form"
                onSubmit={onSubmit}
                sx={{
                    maxWidth: 600,
                    mx: "auto",
                    backgroundColor: "#ffffff",
                    borderRadius: 2,
                    boxShadow: 3,
                    p: 4,
                    display: "flex",
                    flexDirection: "column",
                    gap: 2,
                }}
            >
                <Typography variant="h5">Add a New Residence</Typography>

                <Autocomplete
                    freeSolo
                    options={
                        values.streetAddress.length >= 2
                            ? mockAddresses.map((addr) => addr.full)
                            : []
                    }
                    value={values.streetAddress}
                    onInputChange={(e, val) => {
                        handle("streetAddress", val);
                        const match = mockAddresses.find((addr) => addr.full === val);
                        if (match) {
                            handle("city", match.city);
                            handle("postalCode", match.postalCode);
                            handle("country", match.country);
                        }
                    }}
                    renderInput={(params) => (
                        <TextField {...params} label="Street Address" required />
                    )}
                />

                <TextField
                    label="Flat Number"
                    placeholder="e.g. Apt 5B"
                    value={values.flatNumber}
                    onChange={(e) => handle("flatNumber", e.target.value)}
                />
                <TextField
                    required
                    label="City"
                    placeholder="e.g. Vilnius"
                    value={values.city}
                    onChange={(e) => handle("city", e.target.value)}
                />
                <TextField
                    required
                    label="Postal Code"
                    placeholder="e.g. LT-01103"
                    value={values.postalCode}
                    onChange={(e) => handle("postalCode", e.target.value)}
                />
                <TextField
                    required
                    label="Country"
                    placeholder="e.g. Lithuania"
                    value={values.country}
                    onChange={(e) => handle("country", e.target.value)}
                />

                <TextField
                    select
                    label="Type"
                    value={values.residenceType}
                    onChange={(e) =>
                        handle("residenceType", e.target.value as "FLAT" | "HOUSE")
                    }
                >
                    <MenuItem value="FLAT">Flat</MenuItem>
                    <MenuItem value="HOUSE">House</MenuItem>
                </TextField>

                <FormControlLabel
                    control={
                        <Checkbox
                            checked={values.isPrimary}
                            onChange={(e) => handle("isPrimary", e.target.checked)}
                        />
                    }
                    label="Make this my primary residence"
                />

                {error && (
                    <Typography color="error" variant="body2">
                        {error}
                    </Typography>
                )}


                <Box sx={{display: "flex", gap: 2}}>
                    <Button
                        type="submit"
                        variant="contained"
                        disabled={submitting}
                        sx={{
                            backgroundColor: "#10b981",
                            "&:hover": {backgroundColor: "#059669"},
                        }}
                    >
                        {submitting ? "Creating…" : "Create"}
                    </Button>
                    <Button
                        variant="outlined"
                        onClick={() => router.back()}
                        disabled={submitting}
                        sx={{
                            color: "#ef4444",
                            borderColor: "#ef4444",
                            "&:hover": {
                                backgroundColor: "#fee2e2",
                                borderColor: "#dc2626",
                            },
                        }}
                    >
                        Cancel
                    </Button>
                </Box>
            </Box>
        </Box>
    );
}
// app/residences/new/page.tsx
"use client";

import { useState } from "react";
import {
    Box,
    TextField,
    MenuItem,
    FormControlLabel,
    Checkbox,
    Button,
    Typography,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { useResidences } from "@/hooks/useResidencies";
import type { CreateResidenceRequest } from "@/hooks/useResidencies";

export default function CreateResidencePage() {
    const router = useRouter();
    const { createResidence } = useResidences();

    // keep isPrimary in state for clarity
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

        // 🔑 Rename `isPrimary` → `primary`, drop any `active`
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
            component="form"
            onSubmit={onSubmit}
            sx={{
                maxWidth: 600,
                mx: "auto",
                my: 4,
                display: "flex",
                flexDirection: "column",
                gap: 2,
            }}
        >
            <Typography variant="h5">Add a New Residence</Typography>

            <TextField
                required
                label="Street Address"
                value={values.streetAddress}
                onChange={(e) => handle("streetAddress", e.target.value)}
            />
            <TextField
                label="Flat Number"
                value={values.flatNumber}
                onChange={(e) => handle("flatNumber", e.target.value)}
            />
            <TextField
                required
                label="City"
                value={values.city}
                onChange={(e) => handle("city", e.target.value)}
            />
            <TextField
                required
                label="Postal Code"
                value={values.postalCode}
                onChange={(e) => handle("postalCode", e.target.value)}
            />
            <TextField
                required
                label="Country"
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

            <Box sx={{ display: "flex", gap: 2 }}>
                <Button type="submit" variant="contained" disabled={submitting}>
                    {submitting ? "Creating…" : "Create"}
                </Button>
                <Button
                    variant="outlined"
                    onClick={() => router.back()}
                    disabled={submitting}
                >
                    Cancel
                </Button>
            </Box>
        </Box>
    );
}
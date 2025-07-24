// app/residences/page.tsx
"use client";

import { useEffect, useState } from "react";
import {
    Box, Grid, Card, CardHeader, CardContent,
    CardActions, Typography, Chip, TextField,
    IconButton, Fab, Button
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import HomeIcon from "@mui/icons-material/Home";
import ApartmentIcon from "@mui/icons-material/Apartment";
import AddIcon from "@mui/icons-material/Add";
import { useResidences, Residency } from "@/hooks/useResidencies";

export default function ResidencesPage() {
    const {
        getResidences,
        searchResidences,
        setPrimary,
        deactivate,
        cloneResidence,
    } = useResidences();

    const [homes, setHomes] = useState<Residency[]>([]);
    const [query, setQuery] = useState("");

    useEffect(() => {
        const loader = query.trim()
            ? () => searchResidences(query)
            : () => getResidences();

        loader()
            .then(setHomes)
            .catch(console.error);
    }, [query, getResidences, searchResidences]);

    const onMakePrimary = async (id: number) => {
        await setPrimary(id);
        setHomes(h => h.map(r => ({ ...r, primary: r.id === id })));
    };

    const onDeactivate = async (id: number) => {
        await deactivate(id);
        setHomes(h => h.map(r => r.id === id ? { ...r, active: false } : r));
    };

    const onUseAddress = async (id: number) => {
        const newRes = await cloneResidence(id);
        // prepend the newly cloned residence to the list
        setHomes(h => [newRes, ...h]);
    };

    const isSearching = query.trim().length > 0;

    return (
        <Box sx={{ p: 4, bgcolor: "background.default", minHeight: "100vh" }}>
            {/* Search Bar */}
            <Box sx={{ mb: 4, display: "flex", gap: 1 }}>
                <TextField
                    fullWidth
                    placeholder="Search residences..."
                    value={query}
                    onChange={e => setQuery(e.target.value)}
                />
                <IconButton onClick={() => {/* optional manual trigger */}}>
                    <SearchIcon />
                </IconButton>
            </Box>

            {/* Results Grid */}
            <Grid container spacing={4}>
                {homes.map(r => (
                    // eslint-disable-next-line react/jsx-key
                    <Grid container spacing={4}>
                        <Card variant="outlined">
                            <CardHeader
                                avatar={
                                    r.residencyType === "FLAT"
                                        ? <ApartmentIcon color="action" />
                                        : <HomeIcon color="action" />
                                }
                                action={
                                    <Chip
                                        label={r.primary ? "Primary" : "Secondary"}
                                        color={r.primary ? "success" : "warning"}
                                        size="small"
                                    />
                                }
                                title={<Typography variant="h6">{r.fullAddress}</Typography>}
                                subheader={`${r.city}, ${r.postalCode}`}
                            />
                            <CardContent>
                                {!r.active && (
                                    <Typography variant="body2" color="text.secondary">
                                        (deactivated)
                                    </Typography>
                                )}
                            </CardContent>

                            <CardActions>
                                {isSearching
                                    ? (
                                        // In search mode: let the user “take” this address
                                        <Button
                                            variant="contained"
                                            size="small"
                                            onClick={() => onUseAddress(r.id)}
                                        >
                                            Use this address
                                        </Button>
                                    )
                                    : (
                                        // In normal mode: show primary/deactivate controls
                                        <>
                                            {!r.primary && (
                                                <Typography
                                                    variant="button"
                                                    onClick={() => onMakePrimary(r.id)}
                                                    sx={{ cursor: "pointer", mr: 2 }}
                                                >
                                                    Make Primary
                                                </Typography>
                                            )}
                                            <Typography
                                                variant="button"
                                                onClick={() => onDeactivate(r.id)}
                                                sx={{ cursor: "pointer" }}
                                            >
                                                Deactivate
                                            </Typography>
                                        </>
                                    )
                                }
                            </CardActions>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            {/* Add‑new button */}
            <Fab
                color="primary"
                aria-label="add"
                sx={{ position: "fixed", bottom: 24, right: 24 }}
            >
                <AddIcon />
            </Fab>
        </Box>
    );
}

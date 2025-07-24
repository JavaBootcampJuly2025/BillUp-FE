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
import Link from "next/link"
import { useResidences, Residency } from "@/hooks/useResidencies";

export default function ResidencesPage() {
    const {
        getResidences,
        searchResidences,
        setPrimary,
        deactivate,
        activate,
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

    const onActivate = async (id: number) => {
        await activate(id);
        setHomes(h => h.map(r => r.id === id ? { ...r, active: true } : r));
    }

    const onUseAddress = async (id: number) => {
        const newRes = await cloneResidence(id);
        // prepend the newly cloned residence to the list
        setHomes(h => [newRes, ...h]);
    };

    const isSearching = query.trim().length > 0;

    return (
        <Box
            sx={{
                minHeight: "100vh",
                background: "linear-gradient(to bottom right, #bfdbfe, #bbf7d0)",
                p: 4,
                position: "relative",
            }}
        >

            <Box
                sx={{
                    maxWidth: "1200px",
                    mx: "auto",
                    bgcolor: "rgba(255, 255, 255, 0.3)",
                    borderRadius: 4,
                    boxShadow: 4,
                    p: 4,
                    backdropFilter: "blur(6px)",
                    WebkitBackdropFilter: "blur(6px)",
                    transition: "all 0.3s ease-in-out",
                }}
            >
                {/* Search Bar */}
                <Box sx={{ mb: 4, display: "flex", gap: 2 }}>
                    <TextField
                        fullWidth
                        placeholder="Search residences..."
                        value={query}
                        onChange={e => setQuery(e.target.value)}
                        variant="outlined"
                    />
                    <IconButton>
                        <SearchIcon />
                    </IconButton>
                </Box>

                {/* Results Grid */}
                <Grid container spacing={4} justifyContent="center"
                      sx={{
                          display: "flex",
                          flexWrap: "wrap",
                      }}
                >
                    {homes.map(r => (
                        <Grid item xs={12} sm={6} md={4} key={r.id} sx={{display: "flex", justifyContent: "center"}}
                            >
                            <Card
                                variant="outlined"
                                sx={{
                                    height: "100%",
                                    display: "flex",
                                    flexDirection: "column",
                                    borderRadius: 4,
                                    boxShadow: 2,
                                }}
                            >
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
                                <CardContent sx={{ flexGrow: 1 }}>
                                    {!r.active && (
                                        <Typography variant="body2" color="text.secondary">
                                            (deactivated)
                                        </Typography>
                                    )}
                                </CardContent>
                                <CardActions>
                                    {!r.primary && !isSearching && (
                                        <Button
                                            size="small"
                                            onClick={() => onMakePrimary(r.id)}
                                        >
                                            Make Primary
                                        </Button>
                                    )}
                                    {r.active ? (
                                        <Button
                                            size="small"
                                            onClick={() => onDeactivate(r.id)}
                                            color="warning"
                                        >
                                            Deactivate
                                        </Button>
                                    ) : (
                                        <Button
                                            size="small"
                                            onClick={() => onActivate(r.id)}
                                            color="success"
                                        >
                                            Activate
                                        </Button>
                                    )}
                                </CardActions>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Box>


            <Fab
                component={Link}
                href="/residencies/create"
                aria-label="add"
                sx={{
                    position: "fixed",
                    top: 120,
                    right: 200,
                    backgroundColor: "rgba(255, 255, 255, 0.6)",
                    color: "#6b7280",
                    backdropFilter: "blur(4px)",
                    WebkitBackdropFilter: "blur(4px)",
                    boxShadow: 3,
                    "&:hover": {
                        backgroundColor: "rgba(255, 255, 255, 0.8)",
                    },
                }}
            >
                <AddIcon />
            </Fab>
        </Box>
    );
}



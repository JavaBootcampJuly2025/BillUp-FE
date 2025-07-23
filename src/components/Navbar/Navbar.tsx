// src/components/Navbar.tsx
"use client";

import {useContext, useEffect} from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";

import {
    HOME_PATH,
    LOGIN_PATH,
    PROFILE_PAGE,
    PAYMENT_PAGE, BILLS_PAGE, RESIDENCIES_PAGE, HISTORY_PAGE,
} from "@/utils/routes";

import { CompanyNameStyles, LinkStyles } from "./styles";
import { AuthContext } from "@/context/AuthContext";
import { AuthContextType } from "@/context/types";
import { ROLE_ADMIN, ROLE_CLIENT, ROLE_COMPANY } from "@/utils/roleConstants";
import { useAuthentication } from "@/hooks/useAuthentication";

export default function Navbar() {
    const { isLoggedIn, userRoles } = useContext(
        AuthContext
    ) as AuthContextType;
    const { logout } = useAuthentication();
    const router = useRouter();

    const handleSignOut = async () => {
        const ok = await logout();
        if (ok) router.replace(LOGIN_PATH);
    };

    useEffect(() => {
        console.log("Decoded roles:", userRoles);
    }, [userRoles]);


    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static" sx={{ backgroundColor: "#000" }}>
                <Toolbar>
                    <IconButton
                        size="large"
                        edge="start"
                        color="inherit"
                        aria-label="menu"
                        sx={{ mr: 2 }}
                    >
                        <MenuIcon />
                    </IconButton>

                    {/* Company logo/name */}
                    <Typography
                        variant="h6"
                        component={Link}
                        href={HOME_PATH}
                        sx={CompanyNameStyles}
                    >
                        BillUp
                    </Typography>

                    {/* Employer links */}
                    {isLoggedIn() && userRoles?.includes(ROLE_CLIENT) && (
                        <>
                            <Button
                                component={Link}
                                href={BILLS_PAGE}
                                sx={LinkStyles}
                            >
                                Bills
                            </Button>
                            <Button component={Link} href={RESIDENCIES_PAGE} sx={LinkStyles}>
                                Residencies
                            </Button>
                            <Button component={Link} href={HISTORY_PAGE} sx={LinkStyles}>
                                History
                            </Button>
                        </>
                    )}

                    {/* Auth buttons */}
                    {!isLoggedIn() ? (
                        <Button component={Link} href={LOGIN_PATH} sx={LinkStyles}>
                            Login
                        </Button>
                    ) : (
                        <>
                            <Button component={Link} href={PROFILE_PAGE} sx={LinkStyles}>
                                Profile
                            </Button>
                            <Button onClick={handleSignOut} sx={LinkStyles}>
                                Logout
                            </Button>
                        </>
                    )}
                    <Box sx={{ flexGrow: 1 }} />
                </Toolbar>
            </AppBar>
        </Box>
    );
}

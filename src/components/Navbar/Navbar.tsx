"use client";

import { useContext, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import Image from "next/image";

import {
    HOME_PATH,
    LOGIN_PATH,
    PROFILE_PAGE,
    PAYMENT_PAGE,
    BILLS_PAGE,
    RESIDENCIES_PAGE,
    HISTORY_PAGE,
} from "@/utils/routes";

import { LinkStyles } from "./styles";
import { AuthContext } from "@/context/AuthContext";
import { AuthContextType } from "@/context/types";
import { ROLE_CLIENT } from "@/utils/roleConstants";
import { ROLE_COMPANY } from "@/utils/roleConstants";

import { useAuthentication } from "@/hooks/useAuthentication";

export default function Navbar() {
    const { isLoggedIn, userRoles } = useContext(AuthContext) as AuthContextType;
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
        <Box sx={{ flexGrow: 1}}>
            <AppBar
                position="static"
                sx={{
                    backgroundColor: "#fff",
                    boxShadow: "none",
                    height: "80px",
                    justifyContent: "center",
                    zIndex: 1300,
                }}
            >
                <Toolbar sx={{ minHeight: "64px", display: "flex", alignItems: "center" }}>
                    <Box sx={{ display: "flex", alignItems: "center", mr: 2}}>
                        <Link href={HOME_PATH}>
                            <Image
                                src="/billuplogo.png"
                                alt="BillUp Logo"
                                width={120}
                                height={40}
                                className="h-40 w-auto translate-y-3"
                                style={{ cursor: "pointer" }}
                            />
                        </Link>
                    </Box>

                    <Box sx={{ display: "flex", alignItems: "center", flexGrow: 1 }}>
                        {isLoggedIn() && userRoles?.includes(ROLE_CLIENT) && (
                            <>
                                <Button disabled={isLoggedIn() && userRoles?.includes(ROLE_COMPANY)} component={Link} href={BILLS_PAGE} sx={LinkStyles}>
                                    Bills
                                </Button>
                                <Button disabled={isLoggedIn() && userRoles?.includes(ROLE_COMPANY)} component={Link} href={RESIDENCIES_PAGE} sx={LinkStyles}>
                                    Residencies
                                </Button>
                            </>
                        )}
                        {!isLoggedIn() && (
                            <Button component={Link} href={LOGIN_PATH} sx={LinkStyles}>
                                Log in
                            </Button>
                        )}
                        {isLoggedIn() && (
                            <>
                                <Button disabled={isLoggedIn() && userRoles?.includes(ROLE_COMPANY)} component={Link} href={PROFILE_PAGE} sx={LinkStyles}>
                                    Profile
                                </Button>
                            </>
                        )}
                    </Box>


                    {isLoggedIn() && (
                        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "flex-end"}}>
                            <Button onClick={handleSignOut} sx={LinkStyles}>
                                Log out
                            </Button>
                        </Box>
                    )}
                </Toolbar>
            </AppBar>
        </Box>
    );
}
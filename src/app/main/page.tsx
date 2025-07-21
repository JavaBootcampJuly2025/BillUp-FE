"use client";

import { Box, Button, Typography } from "@mui/material";
import {
    HomePageContainerStyles,
    LoginPageButtonStyles,
    MainTextStyles,
    SubTextStyles,
} from "./styles";
import {LOGIN_PATH, MAIN_PAGE} from "@/utils/routes";
import {useContext, useEffect} from "react";
import { AuthContext } from "@/context/AuthContext";
import { AuthContextType } from "@/context/types";
import {useRouter} from "next/navigation";

export default function HomePage() {
    const { isLoggedIn } = useContext(AuthContext) as AuthContextType;
    const router = useRouter();

    // If already logged in, send them to their dashboard:
    useEffect(() => {
        if (isLoggedIn()) {
            router.push(MAIN_PAGE);    // or wherever your user page lives
        }
    }, [isLoggedIn, router]);

    // Otherwise show the public landing:
    return (
        <Box sx={HomePageContainerStyles}>
            <Typography variant="h3" sx={MainTextStyles}>
                BillUp - a central bill paying application!
            </Typography>
            {!isLoggedIn() && (
                <Button
                    variant="contained"
                    href={LOGIN_PATH}
                    sx={LoginPageButtonStyles}
                >
                    Login
                </Button>
            )}
        </Box>
    );
}
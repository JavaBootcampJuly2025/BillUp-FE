"use client";

import { Box, Button, Typography } from "@mui/material";
import {
    HomePageContainerStyles,
    LoginPageButtonStyles,
    MainTextStyles,
    SubTextStyles,
} from "./styles";
import { LOGIN_PATH } from "@/utils/routes";
import { useContext, useEffect } from "react";
import { AuthContext } from "@/context/AuthContext";
import { AuthContextType } from "@/context/types";
import { useRouter } from "next/navigation";

export default function MainPage() {
    const { isLoggedIn } = useContext(AuthContext) as AuthContextType;
    const router = useRouter();

    useEffect(() => {
        if (!isLoggedIn()) {
            router.replace(LOGIN_PATH);
        }
    }, [isLoggedIn, router]);

    if (!isLoggedIn()) return null;

    return (
        <Box
            sx={{
                minHeight: "100vh",
                backgroundImage: "linear-gradient(to right, #fef08a, #f9a8d4)", // yellow to pink
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                textAlign: "center",
                padding: 2,
            }}
        >
            <Typography sx={{ fontSize: "120px", fontWeight: "bold", color: "black", mb: 2 }}>
                Hello!
            </Typography>
            <Typography sx={{ fontSize: "64px", color: "black" }}>
                Start managing your bills!
            </Typography>


            {!isLoggedIn() && (
                <Button variant="contained" href={LOGIN_PATH} sx={LoginPageButtonStyles}>
                    Login
                </Button>
            )}
        </Box>
    );
}
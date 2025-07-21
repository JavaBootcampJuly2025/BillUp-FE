"use client";
import React, { useState } from "react";
import {
    Container,
    CssBaseline,
    Box,
    Typography,
    TextField,
    Button,
} from "@mui/material";
import { Link, NavigateFunction, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { LoginFormInputs } from "./types";
import { validationSchema } from "./validation";
import {
    MainBoxStyles,
    ButtonStyles,
    ErrorFieldStyles,
    ContainerStyles,
} from "./styles";
import { useAuthentication } from "../../shared/hooks/useAuthentication";
import LoadingProgress from "../../components/LoadingProgress/LoadingProgress";
import { HOME_PATH } from "../../shared/constants/routes";
import { useErrorHandler } from "../../shared/hooks/useErrorHandler";
import { BackgroundBox } from "../../components/BackgroundBox/BackgroundBox";
import { REGISTER_PATH } from "../../shared/constants/routes";

export const LoginPage: React.FC = () => {
    const [loading, setLoading] = useState<boolean>(false);

    const navigate: NavigateFunction = useNavigate();

    const { error, handleError, clearError } = useErrorHandler();

    const { login } = useAuthentication();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(validationSchema),
    });

    const handleLogin = async (data: LoginFormInputs) => {
        setLoading(true);
        try {
            const success: boolean = await login(data);
            if (success) navigate(HOME_PATH);
        } catch (error: unknown) {
            handleError(error);
            setTimeout(() => {
                clearError();
            }, 4000);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Container maxWidth="md" sx={ContainerStyles}>
                <CssBaseline />
                <Box sx={MainBoxStyles}>
                    <Typography variant="h4" textAlign="center" fontSize={"40px"}>
                        Welcome to BillUp
                    </Typography>
                    <Typography component="p">
                        {" "}
                        Sign in with your email address
                    </Typography>
                    <Box
                        sx={{ mt: 1 }}
                        component="form"
                        onSubmit={handleSubmit(handleLogin)}
                    >
                        <TextField
                            margin="normal"
                            fullWidth
                            id="email"
                            label="Email Address"
                            placeholder="e.g., name@marsterpiece.com"
                            autoFocus
                            {...register("email")}
                            error={Boolean(errors.email)}
                            helperText={errors.email?.message}
                        />

                        <TextField
                            margin="normal"
                            fullWidth
                            id="password"
                            label="Password"
                            type="password"
                            {...register("password")}
                            error={Boolean(errors.password)}
                            helperText={errors.password?.message}
                        />
                        {error && <Typography sx={ErrorFieldStyles}>{error}</Typography>}
                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                gap: 1,
                            }}
                        >
                            <Link to={REGISTER_PATH} style={{ color: "gray" }}>
                                Don&apos;t have an account?
                            </Link>
                        </Box>
                        <Button
                            type="submit"
                            disabled={loading}
                            fullWidth
                            variant="contained"
                            sx={ButtonStyles}
                        >
                            {loading ? (
                                <LoadingProgress
                                    text="Signing In..."
                                    spinnerColor="#A8A8A8"
                                    size="20px"
                                    fontSize="14px"
                                />
                            ) : (
                                "Sign In"
                            )}
                        </Button>
                    </Box>
                </Box>
                <BackgroundBox />
            </Container>
        </>
    );
};

"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
    Container,
    CssBaseline,
    Box,
    Typography,
    TextField,
    Button,
    Select,
    MenuItem,
    InputLabel,
    FormControl,
} from "@mui/material";
import { useForm, SubmitHandler, Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { useAuthentication } from "@/hooks/useAuthentication";
import LoadingProgress from "@/components/LoadingProgress/LoadingProgress";
import { BackgroundBox } from "@/components/BackgroundBox/BackgroundBox";

import { RegistrationSchema, RegisterFormData } from "@/app/registration/validation";
import {
    MainBox,
    RegistrationForm,
    SuggestionBox,
    FormBottomSection,
    ButtonStyle,
} from "./styles";
import { LOGIN_PATH } from "@/utils/routes";

const RegisterPage: React.FC = () => {
    const router = useRouter();
    const { registerUser } = useAuthentication();
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<RegisterFormData>({
        // cast so TS knows this resolver returns RegisterFormData
        resolver: zodResolver(RegistrationSchema) as Resolver<RegisterFormData>,
        mode: "onChange",
    });

    const onSubmit: SubmitHandler<RegisterFormData> = async (data) => {
        setIsLoading(true);
        setError("");
        try {
            const ok = await registerUser(data);
            if (ok) {
                setSuccess("Successfully registered! Redirecting to login…");
                setTimeout(() => router.push(LOGIN_PATH), 2000);
            }
        } catch (e) {
            setError(e.message);
            setIsLoading(false);
        }
    };

    return (
        <Container maxWidth="xs">
            <CssBaseline />
            <Box sx={MainBox}>
                <Typography variant="h4" sx={{ textAlign: "center", mb: 1 }}>
                    Welcome to BillUp!
                </Typography>
                <Typography component="p" sx={{ textAlign: "center", mb: 3 }}>
                    Create an account
                </Typography>

                <Box
                    component="form"
                    onSubmit={handleSubmit(onSubmit)}
                    sx={RegistrationForm}
                >
                    <TextField
                        fullWidth
                        label="Name"
                        placeholder="e.g., Mike"
                        margin="normal"
                        {...register("name")}
                        error={!!errors.name}
                        helperText={errors.name?.message}
                    />

                    <TextField
                        fullWidth
                        label="Surname"
                        placeholder="e.g., Johnson"
                        margin="normal"
                        {...register("surname")}
                        error={!!errors.surname}
                        helperText={errors.surname?.message}
                    />

                    <TextField
                        fullWidth
                        label="Email Address"
                        placeholder="e.g., name@mars.com"
                        margin="normal"
                        {...register("email")}
                        error={!!errors.email}
                        helperText={errors.email?.message}
                    />

                    <TextField
                        fullWidth
                        label="Phone Number"
                        placeholder="e.g., +37061234567"
                        margin="normal"
                        {...register("phoneNumber")}
                        error={!!errors.phoneNumber}
                        helperText={errors.phoneNumber?.message}
                    />

                    <TextField
                        fullWidth
                        label="Residency"
                        placeholder="e.g., Lincoln Street 65"
                        margin="normal"
                        {...register("residency")}
                        error={!!errors.residency}
                        helperText={errors.residency?.message}
                    />

                    <FormControl fullWidth margin="normal" error={!!errors.role}>
                        <InputLabel id="role-label">Role</InputLabel>
                        <Select
                            labelId="role-label"
                            label="Role"
                            defaultValue=""
                            {...register("role")}
                        >
                            <MenuItem value="MARTIAN">CLIENT</MenuItem>
                            <MenuItem value="EMPLOYER">COMPANY</MenuItem>
                        </Select>
                        <Typography variant="caption" color="error">
                            {errors.role?.message}
                        </Typography>
                    </FormControl>

                    <TextField
                        fullWidth
                        label="Password"
                        type="password"
                        margin="normal"
                        {...register("password")}
                        error={!!errors.password}
                        helperText={errors.password?.message}
                    />

                    <TextField
                        fullWidth
                        label="Confirm Password"
                        type="password"
                        margin="normal"
                        {...register("repeatedPassword")}
                        error={!!errors.repeatedPassword}
                        helperText={errors.repeatedPassword?.message}
                    />

                    <Box sx={SuggestionBox}>
                        <Typography>Already have an account?</Typography>
                        <Link href={LOGIN_PATH}>Sign in</Link>
                    </Box>

                    <Box sx={FormBottomSection}>
                        {isLoading ? (
                            <LoadingProgress />
                        ) : (
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                sx={ButtonStyle}
                            >
                                Register
                            </Button>
                        )}
                        <Typography
                            variant="body2"
                            sx={{ mt: 2, color: error ? "red" : success ? "green" : "inherit" }}
                        >
                            {error || success}
                        </Typography>
                    </Box>
                </Box>
            </Box>
            <BackgroundBox />
        </Container>
    );
};

export default RegisterPage;

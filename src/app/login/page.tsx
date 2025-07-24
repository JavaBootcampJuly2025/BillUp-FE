'use client';

import React, { useState } from 'react';
import {
    Container,
    CssBaseline,
    Box,
    Typography,
    TextField,
    Button,
    Paper,
} from '@mui/material';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { LoginFormInputs } from './types';
import { validationSchema } from './validation';
import { useAuthentication } from '@/hooks/useAuthentication';

const LoginPage: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const { login } = useAuthentication();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormInputs>({
        resolver: yupResolver(validationSchema),
    });

    const handleLogin = async (data: LoginFormInputs) => {
        setLoading(true);
        try {
            const success = await login(data);
            if (success) router.push('/main');
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box
            sx={{
                minHeight: '100vh',
                backgroundImage: 'linear-gradient(to top right, #bbf7d0, #67e8f9, #fef08a)',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
            }}
        >
            <CssBaseline />
            <Paper
                elevation={6}
                sx={{
                    padding: 4,
                    borderRadius: 3,
                    backgroundColor: '#fff',
                    width: '100%',
                    maxWidth: 400,
                }}
            >
                <Typography variant="h5" fontWeight="bold" textAlign="center" mb={3}>
                    Sign In
                </Typography>

                <Box component="form" onSubmit={handleSubmit(handleLogin)} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <TextField
                        label="Email"
                        fullWidth
                        {...register('email')}
                        error={!!errors.email}
                        helperText={errors.email?.message}
                    />
                    <TextField
                        label="Password"
                        type="password"
                        fullWidth
                        {...register('password')}
                        error={!!errors.password}
                        helperText={errors.password?.message}
                    />
                    <Button
                        type="submit"
                        variant="contained"
                        fullWidth
                        sx={{
                            backgroundColor: '#10b981', // green
                            textTransform: 'none',
                            fontWeight: 'bold',
                            '&:hover': {
                                backgroundColor: '#059669',
                            },
                        }}
                    >
                        {loading ? 'Signing In...' : 'Sign In'}
                    </Button>
                </Box>
            </Paper>
        </Box>
    );
};

export default LoginPage;
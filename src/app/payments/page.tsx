'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { TextField, Button, Paper, Typography, Box } from '@mui/material';
import { loginAndStoreToken } from '@/utils/AuthUtils';
import { billApi } from '@/services/billApi';
import { PAYMENT_ENDPOINT } from '@/utils/apiConstants';
import { Bill } from '@/types/bill';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

export default function PaymentPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const billId = searchParams.get('billId');

    const [bill, setBill] = useState<Bill | null>(null);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [methodToken, setMethodToken] = useState('');
    const [provider, setProvider] = useState('PAYPAL');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchBill = async () => {
            try {
                const userId = localStorage.getItem('userId');
                if (!userId || !billId) return;

                const bills = await billApi.getBillsByUserId(parseInt(userId));
                const targetBill = bills.find((b) => b.id === parseInt(billId as string));
                if (targetBill) setBill(targetBill);
            } catch (err) {
                console.error('Failed to fetch bill:', err);
            }
        };

        fetchBill();
    }, [billId]);

    const handlePay = async () => {
        setLoading(true);
        try {
            const token = await loginAndStoreToken(email, password);
            const decoded = jwtDecode<{ userId: number }>(token);
            const userId = decoded.userId;

            if (!userId) {
                alert("Invalid token: userId missing.");
                return;
            }

            await axios.post(PAYMENT_ENDPOINT, {
                billId: bill?.id,
                userId: userId,
                amount: bill?.amount,
                provider,
                methodToken,
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                },
            });

            alert('Payment successful!');
            router.push('/bills');
        } catch (err: any) {
            alert('Payment failed: ' + (err.response?.data?.message || err.message));
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box
            sx={{
                minHeight: '100vh',
                background: 'linear-gradient(to bottom right, #fde68a, #c084fc)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                p: 4,
            }}
        >
        <Paper
                elevation={4}
                sx={{
                    width: '100%',
                    maxWidth: 480,
                    p: 4,
                    borderRadius: 3,
                    backgroundColor: 'rgba(255, 255, 255, 0.85)',
                    backdropFilter: 'blur(6px)',
                    WebkitBackdropFilter: 'blur(6px)',
                }}
            >
                <Typography variant="h5" sx={{ mb: 3, textAlign: 'center' }}>
                    Confirm Payment
                </Typography>

                {bill ? (
                    <Typography variant="h6" sx={{ mb: 4, textAlign: 'center' }}>
                        You need to pay: <strong>${bill.amount.toFixed(2)}</strong>
                    </Typography>
                ) : (
                    <Typography sx={{ mb: 4, textAlign: 'center', color: 'gray' }}>
                        Loading bill details...
                    </Typography>
                )}

                <TextField
                    label="Email"
                    fullWidth
                    sx={{ mb: 3 }}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <TextField
                    label="Password"
                    type="password"
                    fullWidth
                    sx={{ mb: 3 }}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <TextField
                    label="Payment Token"
                    fullWidth
                    sx={{ mb: 3 }}
                    value={methodToken}
                    onChange={(e) => setMethodToken(e.target.value)}
                />
                <TextField
                    label="Provider"
                    fullWidth
                    sx={{ mb: 4 }}
                    value={provider}
                    onChange={(e) => setProvider(e.target.value)}
                />

            <Button
                fullWidth
                onClick={handlePay}
                disabled={loading}
                sx={{
                    py: 1.5,
                    fontWeight: 500,
                    fontSize: '1rem',
                    color: '#fff',
                    backgroundColor: '#10b981',
                    '&:hover': {
                        backgroundColor: '#059669',
                    },
                    '&:disabled': {
                        backgroundColor: '#a7f3d0',
                        color: '#4b5563',
                    },
                }}
            >
                {loading ? 'Processing...' : 'Pay Now'}
            </Button>
        </Paper>
        </Box>
    );
}
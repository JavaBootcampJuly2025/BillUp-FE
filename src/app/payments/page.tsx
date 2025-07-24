// pages/payment/page.tsx
'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import GradientLayout from '../../components/GradientLayout';
import { TextField, Button, Paper, Typography } from '@mui/material';
import { loginAndStoreToken } from '@/utils/AuthUtils';
import { billApi } from '@/services/billApi';
import { PAYMENT_ENDPOINT } from '@/utils/apiConstants';
import { Bill } from '@/types/bill';
import axios from 'axios';
import {jwtDecode} from "jwt-decode";

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
        <GradientLayout>
            <Paper elevation={3} className="p-8 w-full max-w-md">
                <Typography variant="h5" className="mb-4 text-center">Confirm Payment</Typography>
                {bill ? (
                    <Typography variant="h6" className="mb-6 text-center">
                        You need to pay: <strong>${bill.amount.toFixed(2)}</strong>
                    </Typography>
                ) : (
                    <Typography className="mb-6 text-center text-gray-500">Loading bill details...</Typography>
                )}
                <TextField
                    label="Email"
                    fullWidth
                    className="mb-4"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <TextField
                    label="Password"
                    type="password"
                    fullWidth
                    className="mb-4"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <TextField
                    label="Payment Token"
                    fullWidth
                    className="mb-4"
                    value={methodToken}
                    onChange={(e) => setMethodToken(e.target.value)}
                />
                <TextField
                    label="Provider"
                    fullWidth
                    className="mb-6"
                    value={provider}
                    onChange={(e) => setProvider(e.target.value)}
                />
                <Button variant="contained" fullWidth onClick={handlePay} disabled={loading}>
                    {loading ? 'Processing...' : 'Pay Now'}
                </Button>
            </Paper>
        </GradientLayout>
    );
}
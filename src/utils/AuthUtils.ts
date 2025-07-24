import { ParsedJWTType } from "@/app/login/types";
import { jwtDecode } from "jwt-decode";
import dayjs from "dayjs";
import axios from "axios";
import {LOGIN_API_URL } from "@/utils/apiConstants";


export const validateToken = (token: string): boolean => {
    try {
        const decoded: ParsedJWTType = jwtDecode<ParsedJWTType>(token);
        if (!decoded || typeof decoded.exp !== "number") return false;

        return dayjs.unix(decoded.exp).isAfter(dayjs());
    } catch (e) {
        console.error("Token validation error:", e);
        return false;
    }
};


export const clearLocalStorage = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("userId");
    localStorage.removeItem("roles");
};


export const matchPath = (path: string, patterns: string[]): boolean => {
    return patterns.some((pattern) => {
        const regex: RegExp = new RegExp(`^${pattern.replace("*", ".*")}$`);
        return regex.test(path);
    });
};

/**
 * Logs in the user and stores the JWT token and user ID in localStorage.
 */
export const loginAndStoreToken = async (
    email: string,
    password: string
): Promise<string> => {
    try {
        const response = await axios.post(LOGIN_API_URL , { email, password });

        const token = response.data.access_token;
        const refreshToken = response.data.refresh_token;

        if (!token) throw new Error("Missing access token");

        // Decode token to extract userId
        const decoded = jwtDecode<ParsedJWTType>(token);
        const userId = decoded.userId;

        if (!userId) throw new Error("Missing user ID in token");

        localStorage.setItem("accessToken", token);
        localStorage.setItem("refreshToken", refreshToken);
        localStorage.setItem("userId", userId.toString());


        return token;
    } catch (error: any) {
        console.error("Login failed:", error);
        throw new Error(error.response?.data?.message || "Login error");
    }
};
"use client";

import {
    matchPath,
    NavigateFunction,
    useLocation,
    useNavigate,
} from "react-router-dom";
import { AuthProviderProps } from "@/context/types";
import { useCallback, useEffect, useState } from "react";
import { clearLocalStorage, validateToken } from "@/utils/AuthUtils";
import { ParsedJWTType } from "@/app/login/types";
import { jwtDecode } from "jwt-decode";
import { LOGIN_PATH, PUBLIC_PATHS } from "@/utils/routes";
import { AuthContext } from "@/context/AuthContext";

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const navigate: NavigateFunction = useNavigate();
    const location = useLocation();

    const [accessToken, setAccessToken] = useState<string | null>(() => {
        return localStorage.getItem("accessToken");
    });

    const [userID, setUserID] = useState<number | null>(() => {
        const userIDString = localStorage.getItem("userId");
        return userIDString ? parseInt(userIDString, 10) : null;
    });

    const [userRoles, setUserRoles] = useState<string[] | null>(() => {
        const rolesString = localStorage.getItem("roles");
        return rolesString ? JSON.parse(rolesString) : null;
    });

    const isLoggedIn = useCallback((): boolean => {
        return !!accessToken && validateToken(accessToken);
    }, [accessToken]);

    const setAuthData = (token: string) => {
        if (validateToken(token)) {
            const userInfo: ParsedJWTType = jwtDecode<ParsedJWTType>(token);
            if (userInfo && userInfo.userId && userInfo.roles) {
                setAccessToken(token);
                setUserID(userInfo.userId);
                setUserRoles(userInfo.roles);

                localStorage.setItem("accessToken", token);
                localStorage.setItem("userId", userInfo.userId.toString());
                localStorage.setItem("roles", JSON.stringify(userInfo.roles));
            } else {
                console.error("Failed to decode token.");
                navigate(LOGIN_PATH);
            }
        } else {
            console.error("Invalid or expired token");
            setAccessToken(null);
            navigate(LOGIN_PATH);
        }
    };

    const validateJwtToken = async (): Promise<boolean> => {
        return accessToken ? validateToken(accessToken) : false;
    };

    useEffect(() => {
        if (!isLoggedIn()) {
            clearLocalStorage();
            setAccessToken(null);

            const isPublicPath = PUBLIC_PATHS.some((path) =>
                matchPath(path, location.pathname)
            );

            if (!isPublicPath) {
                navigate(LOGIN_PATH);
            }
        }
    }, [accessToken, isLoggedIn, location.pathname, navigate]);

    return (
        <AuthContext.Provider
            value={{
        isLoggedIn,
            accessToken,
            setAccessToken,
            setAuthData,
            userID,
            userRoles,
            validateJwtToken,
    }}
>
    {children}
    </AuthContext.Provider>
);
};

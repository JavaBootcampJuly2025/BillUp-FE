import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import {
    LoginFormInputs,
    LoginSuccessResponseType,
} from "../../pages/LoginPage/types";
import { ErrorResponse } from "../types/types";
import { RegisterFormData } from "../../pages/Register/types";
import {
    BEARER_TOKEN_PREFIX,
    LOGIN_API_URL,
    LOGOUT_API_URL,
    REGISTER_API_URL,
} from "../constants/apiConstants";
import { AuthContextType } from "../context/types";

export const useAuthentication = () => {
    const { accessToken, isLoggedIn, setAccessToken, setAuthData, userID } =
        useContext(AuthContext) as AuthContextType;

    const login = async (data: LoginFormInputs): Promise<boolean> => {
        const response: Response = await fetch(LOGIN_API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            const errorResponse: ErrorResponse = await response.json();
            throw new Error(JSON.stringify(errorResponse));
        }

        const loginResponse: LoginSuccessResponseType = await response.json();

        setAuthData(loginResponse.access_token);

        return true;
    };

    const logout = async (): Promise<boolean> => {
        try {
            const response: Response = await fetch(LOGOUT_API_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `${BEARER_TOKEN_PREFIX}${accessToken}`,
                },
            });

            if (!response.ok) {
                throw new Error(`Logout failed with status ${response.status}`);
            }

            setAccessToken(null);

            return true;
        } catch (error) {
            console.error("Error during logout:", error);
            return false;
        }
    };

    const registerUser = async (data: RegisterFormData): Promise<boolean> => {
        try {
            const response: Response = await fetch(REGISTER_API_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                const errorResponse: ErrorResponse = await response.json();
                throw new Error(`Registration failed. ${errorResponse.detail}`);
            }

            return true;
        } catch (error) {
            throw new Error(error instanceof Error ? error.message : "Unknown error");
        }
    };

    return {
        login,
        logout,
        registerUser,
        isLoggedIn,
        accessToken,
        userID,
    };
};

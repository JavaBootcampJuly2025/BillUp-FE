import { useContext } from "react";
import { AuthContext } from "@/context/AuthContext";
import {
    LoginFormInputs,
    LoginSuccessResponseType,
} from "@/app/login/types";
import { ErrorResponse } from "@/types/types";
import { RegistrationForm } from "@/app/registration/types";
import {
    LOGIN_API_URL,
    LOGOUT_API_URL,
    REGISTER_API_URL,
} from "@/utils/apiConstants";
import { AuthContextType } from "../context/types";

export const useAuthentication = () => {
    const context = useContext(AuthContext);

    if (!context) {
        return {
            login: async (data: LoginFormInputs) => {
                console.log("Mock login called with", data);
                return true; // просто успешный ответ
            },
            logout: async () => {
                console.log("Mock logout called");
                return true;
            },
            registerUser: async (data: RegistrationForm) => {
                console.log("Mock registerUser called with", data);
                return true;
            },
            isLoggedIn: false,
            accessToken: null,
            userID: null,
        };
    }

    const { accessToken, isLoggedIn, setAccessToken, setAuthData, userID } = context as AuthContextType;

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
                    Authorization: `Bearer ${accessToken}`,
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

    const registerUser = async (data: RegistrationForm): Promise<boolean> => {
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

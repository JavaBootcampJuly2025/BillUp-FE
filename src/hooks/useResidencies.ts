// src/hooks/useResidences.ts
import { useContext, useCallback } from "react";
import { AuthContext } from "@/context/AuthContext";
import {API_URL, BEARER_TOKEN_PREFIX, RESIDENCIES_API_URL} from "@/utils/apiConstants";

export interface Residency {
    id: number;
    streetAddress: string;
    flatNumber?: string;
    city: string;
    postalCode: string;
    country: string;
    residencyType: "FLAT" | "HOUSE";
    fullAddress: string;
    active: boolean;
    primary: boolean;
    isSecondary: boolean;
}

export interface CreateResidenceRequest {
    streetAddress: string;
    flatNumber?: string;
    city: string;
    postalCode: string;
    country: string;
    residenceType: "FLAT" | "HOUSE";
    primary: boolean;
    //active: boolean;
}

export function useResidences() {
    const ctx = useContext(AuthContext);

    if (!ctx) {
        throw new Error(
            "AuthContext is missing — make sure your tree is wrapped in <AuthContext.Provider>"
        );
    }
    const { accessToken } = ctx;

    const getResidences = useCallback(async (): Promise<Residency[]> => {
        const res = await fetch(RESIDENCIES_API_URL, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `${BEARER_TOKEN_PREFIX}${accessToken}`,
            },
        });
        if (!res.ok) {
            throw new Error("Failed to load residences");
        }
        return res.json();
    }, [accessToken]);

    const searchResidences = useCallback(
        async (query: string): Promise<Residency[]> => {
            const url = new URL(`${RESIDENCIES_API_URL}/autocomplete`, window.location.origin);
            url.searchParams.set("query", query);
            const res = await fetch(url.toString(), {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `${BEARER_TOKEN_PREFIX}${accessToken}`,
                },
            });
            if (!res.ok) throw new Error("Search failed");
            return res.json();
        },
        [accessToken]
    );

    const setPrimary = useCallback(
        async (id: number) => {
            await fetch(`${RESIDENCIES_API_URL}/${id}/set-primary`, { method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `${BEARER_TOKEN_PREFIX}${accessToken}`,
                },});
        },
        []
    );
    const createResidence = useCallback(
        async (payload: CreateResidenceRequest) => {
            const res = await fetch(RESIDENCIES_API_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `${BEARER_TOKEN_PREFIX}${accessToken}`,
                },
                body: JSON.stringify(payload)
            });
            if (!res.ok) throw new Error("Failed to create residence");
            return res.json();   // returns the created ResidenceResponse
        },
        [accessToken]
    );

    /*const setSecondary = useCallback(
        async (id: number) => {
            await fetch(`${RESIDENCIES_API_URL}/${id}/set-secondary`, {method: "PUT"});
        },
        []
    );*/

    const activate = useCallback(
        async (id: number) => {
            await fetch(`${RESIDENCIES_API_URL}/${id}/activate`, { method: "PUT", headers: {
                    "Content-Type": "application/json",
                    Authorization: `${BEARER_TOKEN_PREFIX}${accessToken}`,
                },
            });
        },
        []
    );


    const deactivate = useCallback(
        async (id: number) => {
            await fetch(`${RESIDENCIES_API_URL}/${id}/deactivate`, { method: "PUT", headers: {
                    "Content-Type": "application/json",
                    Authorization: `${BEARER_TOKEN_PREFIX}${accessToken}`,
                },
            });
        },
        []
    );

    const cloneResidence = useCallback(
        async (id: number): Promise<Residency> => {
            const res = await fetch(
                `${RESIDENCIES_API_URL}/${id}/clone`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `${BEARER_TOKEN_PREFIX}${accessToken}`,
                    },
                }
            );
            if (!res.ok) throw new Error("Clone failed");
            return res.json();  // returns the new Residency payload
        },
        [accessToken]
    );

    return { getResidences, setPrimary, deactivate, activate, searchResidences, cloneResidence, createResidence };
}

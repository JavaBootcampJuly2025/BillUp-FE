"use client";

import React, { createContext } from "react";
import { AuthContextType } from "./types";

export const AuthContext: React.Context<AuthContextType | null> =
    createContext<AuthContextType | null>(null);

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import api from './api';
import axios from 'axios';

interface User {
    email: string;
    role: string;
    customerId: string;
}

interface AuthContextType {
    user: User | null;
    token: string | null;
    login: (email: string, password: string) => Promise<void>;
    register: (email: string, password: string, firstName: string, lastName: string) => Promise<void>;
    logout: () => void;
    isFleetManager: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);

    useEffect(() => {
        const savedToken = localStorage.getItem('driveflow_token');
        const savedUser = localStorage.getItem('driveflow_user');
        if (savedToken && savedUser) {
            setToken(savedToken);
            setUser(JSON.parse(savedUser));
        }
    }, []);

    const login = async (email: string, password: string) => {
        try {
            const res = await api.post('/auth/login', { email, password });
            const data = res.data;

            localStorage.setItem('driveflow_token', data.token);
            localStorage.setItem('driveflow_user', JSON.stringify(data.user));
            setToken(data.token);
            setUser(data.user);
        } catch (error: any) {
            if (axios.isAxiosError(error) && error.response) {
                throw new Error(error.response.data.error || 'Login failed');
            }
            throw new Error('Backend not reachable — run: npx ts-node src/server.ts');
        }
    };

    const register = async (email: string, password: string, firstName: string, lastName: string) => {
        try {
            await api.post('/auth/register', { email, password, firstName, lastName });
        } catch (error: any) {
            if (axios.isAxiosError(error) && error.response) {
                throw new Error(error.response.data.error || 'Registration failed');
            }
            throw new Error('Backend not reachable — run: npx ts-node src/server.ts');
        }
    };

    const logout = () => {
        localStorage.removeItem('driveflow_token');
        localStorage.removeItem('driveflow_user');
        setToken(null);
        setUser(null);
    };

    const isFleetManager = user?.role === 'FLEET_MANAGER';

    return (
        <AuthContext.Provider value={{ user, token, login, register, logout, isFleetManager }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
    return ctx;
}

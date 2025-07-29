"use client";
import React, { createContext, useState, useEffect, ReactNode, useContext } from "react";

type UserPlan = {
  name: "Ativ";
  totalGb: number;
  usedGb: number;
  remainingGb: number;
  status: string;
  threads: number;
  expiresAt: string;
  credentials: {
    host: string;
    port: string;
    username: string;
    password: string;
  };
};

type User = {
  email: string;
  name: string;
  plan: UserPlan;
};

type UserContextType = {
  user: User | null;
  loading: boolean;
  refreshUser: () => Promise<void>;
};

const UserContext = createContext<UserContextType>({
  user: null,
  loading: true,
  refreshUser: async () => {},
});

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    setLoading(true);
    try {
      const [userRes, proxyRes] = await Promise.all([
        fetch("/api/user/me", { credentials: "include" }),
        fetch("/api/user/getUserProxy", { credentials: "include" }),
      ]);

      if (!userRes.ok) throw new Error("Erro ao buscar dados do usuário");
      const userData = await userRes.json();

      if (!proxyRes.ok) {
        console.warn("Não foi possível buscar dados do proxy, usando padrão.");
        userData.plan.threads = 0;
      } else {
        const proxyData = await proxyRes.json();
        userData.plan.threads = proxyData.threads ?? 0;
      }

      setUser(userData);
    } catch (error) {
      console.error("Erro ao buscar usuário:", error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <UserContext.Provider value={{ user, loading, refreshUser: fetchUser }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}

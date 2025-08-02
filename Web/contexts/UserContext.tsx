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
  refreshUser: async () => { },
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

      // Se o userRes deu 401, nem tenta o resto
      if (userRes.status === 401) {
        setUser(null);
        return;
      }

      if (!userRes.ok) throw new Error("Erro ao buscar dados do usuário");

      const userData = await userRes.json();

      // Se o proxyRes deu erro, não quebra o fluxo, apenas ignora
      if (proxyRes.ok) {
        const proxyData = await proxyRes.json();
        userData.plan.threads = proxyData;
      } else {
        console.warn("Não foi possível buscar dados do proxy, usando padrão.");
        userData.plan.threads = 0;
      }

      setUser(userData);
    } catch (error) {
      // Se quiser, pode tirar esse console completamente pra não mostrar nada:
      // console.error("Erro ao buscar usuário:", error);
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

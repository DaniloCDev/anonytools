"use client"
import React, { createContext, useState, useEffect, ReactNode, useContext } from "react";

type UserPlan = {
  name: "Ativ";
  totalGb: 10;
  usedGb: number;
  remainingGb: number;
  status: string;
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
      const res = await fetch("/user/me", { credentials: "include" });
      if (!res.ok) {
        setUser(null);
        return;
      }
      const data = await res.json();
      setUser(data);
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

// Hook para usar o contexto de forma simples
export function useUser() {
  return useContext(UserContext);
}

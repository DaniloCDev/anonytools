// contexts/PurchaseContext.tsx
"use client";

import { createContext, useContext, useEffect, useState } from "react";

type Purchase = {
  id: number;
  createdAt: string;
  gbAmount: number;
  totalPrice: number;
  status: "PENDING" | "PAID" | "FAILED";
  mpPaymentId: number;
};

interface PurchaseContextProps {
  purchases: Purchase[];
  isLoading: boolean;
}

const PurchaseContext = createContext<PurchaseContextProps>({ purchases: [], isLoading: true });

export const PurchaseProvider = ({ children }: { children: React.ReactNode }) => {
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [isLoading, setIsLoading] = useState(true);

useEffect(() => {
  const fetchPurchases = async () => {
    try {
      const res = await fetch("/api/user/purchases", { credentials: "include" });

      if (!res.ok) {
        // se quiser, trate 401 silenciosamente aqui
        if (res.status === 401) {
          // usuário não autenticado, talvez redirecionar ou ignorar
          return;
        }
        throw new Error(`Erro ao buscar compras: ${res.status}`);
      }

      const data = await res.json();
      setPurchases(data);
    } catch (err) {
    } finally {
      setIsLoading(false);
    }
  };

  fetchPurchases();
}, []);


  return (
    <PurchaseContext.Provider value={{ purchases, isLoading }}>
      {children}
    </PurchaseContext.Provider>
  );
};

export const usePurchaseContext = () => useContext(PurchaseContext);

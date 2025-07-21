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
    fetch("/api/user/purchases", { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        setPurchases(data);
      })
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <PurchaseContext.Provider value={{ purchases, isLoading }}>
      {children}
    </PurchaseContext.Provider>
  );
};

export const usePurchaseContext = () => useContext(PurchaseContext);

"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { DEFAULT_BRAND, type BrandKit } from "@video-lib/template-sdk";

const STORAGE_KEY = "hookforge-brand";

interface BrandContextValue {
  brand: BrandKit;
  updateBrand: (updates: Partial<BrandKit>) => void;
  resetBrand: () => void;
}

const BrandContext = createContext<BrandContextValue | null>(null);

export function BrandProvider({ children }: { children: ReactNode }) {
  const [brand, setBrand] = useState<BrandKit>(DEFAULT_BRAND);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setBrand(JSON.parse(stored));
    } catch {
      /* ignore */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(brand));
  }, [brand, hydrated]);

  const updateBrand = useCallback((updates: Partial<BrandKit>) => {
    setBrand((prev) => ({ ...prev, ...updates }));
  }, []);

  const resetBrand = useCallback(() => {
    setBrand(DEFAULT_BRAND);
  }, []);

  const value = useMemo(
    () => ({ brand, updateBrand, resetBrand }),
    [brand, updateBrand, resetBrand]
  );

  return <BrandContext.Provider value={value}>{children}</BrandContext.Provider>;
}

export function useBrand() {
  const ctx = useContext(BrandContext);
  if (!ctx) throw new Error("useBrand must be used within BrandProvider");
  return ctx;
}

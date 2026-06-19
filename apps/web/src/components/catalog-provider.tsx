"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import type { HookTemplate } from "@video-lib/template-sdk";
import { TEMPLATE_CATALOG } from "@video-lib/template-sdk";

interface UserProfile {
  id: string;
  email: string;
  name: string | null;
  credits: number;
  plan: "free" | "creator" | "pro";
  role: "user" | "admin";
}

interface CatalogContextValue {
  templates: HookTemplate[];
  loading: boolean;
  user: UserProfile | null;
  refreshUser: () => Promise<void>;
  refreshCatalog: () => Promise<void>;
}

const CatalogContext = createContext<CatalogContextValue>({
  templates: TEMPLATE_CATALOG,
  loading: false,
  user: null,
  refreshUser: async () => {},
  refreshCatalog: async () => {},
});

export function CatalogProvider({ children }: { children: React.ReactNode }) {
  const [templates, setTemplates] = useState<HookTemplate[]>(TEMPLATE_CATALOG);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<UserProfile | null>(null);

  const refreshCatalog = useCallback(async () => {
    try {
      const res = await fetch("/api/catalog");
      if (res.ok) {
        const data = (await res.json()) as { templates: HookTemplate[] };
        setTemplates(data.templates);
      }
    } catch {
      setTemplates(TEMPLATE_CATALOG);
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshUser = useCallback(async () => {
    try {
      const res = await fetch("/api/user/me");
      if (res.ok) {
        const data = (await res.json()) as UserProfile;
        setUser(data);
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    }
  }, []);

  useEffect(() => {
    void refreshCatalog();
    void refreshUser();
  }, [refreshCatalog, refreshUser]);

  return (
    <CatalogContext.Provider
      value={{ templates, loading, user, refreshUser, refreshCatalog }}
    >
      {children}
    </CatalogContext.Provider>
  );
}

export function useCatalog() {
  return useContext(CatalogContext);
}

export function useTemplateBySlug(slug: string): HookTemplate | undefined {
  const { templates } = useCatalog();
  return templates.find((t) => t.slug === slug);
}

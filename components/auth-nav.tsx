"use client"

import Link from "next/link";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export function AuthNav() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const supabase = createClient();

    const loadSession = async () => {
      const { data } = await supabase.auth.getSession();
      setUser(data?.session?.user ?? null);
    };

    loadSession();

    const { data: listener } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      listener?.subscription?.unsubscribe?.();
    };
  }, []);

  return (
    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
      {user ? (
        <>
          <Link href="/perfil" style={{ color: 'white', textDecoration: 'none', fontSize: '14px', padding: '8px 16px', borderRadius: '20px', backgroundColor: '#10b981' }}>
            Mi perfil
          </Link>
          <Link href="/listings/nuevo" style={{ color: 'white', textDecoration: 'none', fontSize: '14px', padding: '8px 16px', borderRadius: '20px', backgroundColor: '#3b82f6' }}>
            Mis anuncios
          </Link>
        </>
      ) : (
        <Link href="/auth/sign-in" style={{ backgroundColor: '#F5A623', color: '#1A1A2E', padding: '8px 18px', borderRadius: '20px', fontWeight: 'bold', fontSize: '14px', textDecoration: 'none' }}>
          Entrar
        </Link>
      )}
    </div>
  );
}

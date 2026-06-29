import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function FavoritosPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/auth/sign-in')

  return (
    <main style={{ minHeight: '100vh', backgroundColor: '#F8F9FA' }}>
      <nav style={{ backgroundColor: '#006B3C', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
        <Link href="/" style={{ color: 'white', textDecoration: 'none', fontSize: '18px', fontWeight: 'bold' }}>
          ← Volver
        </Link>
        <span style={{ color: 'white', fontSize: '18px', fontWeight: 'bold' }}>Favoritos</span>
      </nav>

      <div style={{ maxWidth: '700px', margin: '0 auto', padding: '24px 16px' }}>
        <div style={{ backgroundColor: 'white', borderRadius: '20px', padding: '28px', boxShadow: '0 1px 10px rgba(0,0,0,0.08)', textAlign: 'center' }}>
          <p style={{ fontSize: '32px', margin: '0 0 12px' }}>⭐</p>
          <h1 style={{ fontSize: '22px', margin: '0 0 12px', fontWeight: '700', color: '#1A1A2E' }}>Tus favoritos</h1>
          <p style={{ color: '#4B5563', lineHeight: '1.7', marginBottom: '20px' }}>
            Aquí aparecerán los anuncios que marques como favoritos. Por ahora no has guardado ninguno.
          </p>
          <Link href="/" style={{ display: 'inline-block', backgroundColor: '#006B3C', color: 'white', padding: '12px 24px', borderRadius: '16px', textDecoration: 'none', fontWeight: '600' }}>
            Explorar anuncios
          </Link>
        </div>
      </div>
    </main>
  )
}

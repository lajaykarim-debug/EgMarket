import { Suspense } from 'react'
import SearchBar from '@/components/SearchBar'
import ListingCard from '@/components/ListingCard'
import Link from 'next/link'

const categories = ['Electrónica', 'Ropa', 'Hogar', 'Vehículos', 'Inmuebles', 'Otros']

async function ListingsGrid({
  q, category, city
}: {
  q?: string; category?: string; city?: string
}) {
  const { createClient } = await import('@/lib/supabase/server')
  const supabase = await createClient()

  let query = supabase
    .from('listings')
    .select('id, title, price, city, condition, photos')
    .eq('status', 'activo')
    .order('created_at', { ascending: false })
    .limit(20)

  if (q) query = query.ilike('title', `%${q}%`)
  if (category) query = query.eq('category', category)
  if (city) query = query.eq('city', city)

  const { data: listings } = await query

  if (!listings || listings.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 0', color: '#9ca3af' }}>
        <p style={{ fontSize: '48px' }}>📦</p>
        <p style={{ fontSize: '18px', fontWeight: '500' }}>No hay anuncios todavía</p>
        <p style={{ fontSize: '14px', marginTop: '4px' }}>¡Sé el primero en publicar!</p>
      </div>
    )
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
      {listings.map((listing) => (
        <ListingCard key={listing.id} listing={listing} />
      ))}
    </div>
  )
}

function Skeleton() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
      {[...Array(6)].map((_, i) => (
        <div key={i} style={{ backgroundColor: '#e5e7eb', borderRadius: '16px', height: '200px' }} />
      ))}
    </div>
  )
}

export default function Home({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; category?: string; city?: string }>
}) {
  return (
    <main style={{ minHeight: '100vh', backgroundColor: '#F8F9FA' }}>

      {/* NAVBAR */}
      <nav style={{ backgroundColor: '#006B3C', padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ color: 'white', fontSize: '22px', fontWeight: 'bold' }}>
          🛒 EGMarket
        </span>
        <Link href="/sign-in" style={{ backgroundColor: '#F5A623', color: '#1A1A2E', padding: '8px 18px', borderRadius: '20px', fontWeight: 'bold', fontSize: '14px', textDecoration: 'none' }}>
          Entrar
        </Link>
      </nav>

      {/* HERO + BUSCADOR */}
      <div style={{ backgroundColor: '#006B3C', padding: '8px 16px 24px' }}>
        <p style={{ color: '#a7f3d0', textAlign: 'center', fontSize: '13px', margin: '0 0 8px' }}>
          Compra y vende en Guinea Ecuatorial 🇬🇶
        </p>
        <SearchBar />
      </div>

      {/* CATEGORÍAS */}
      <div style={{ padding: '16px', overflowX: 'auto' }}>
        <div style={{ display: 'flex', gap: '8px', width: 'max-content' }}>
          {categories.map((cat) => (
            <Link key={cat} href={`/?category=${cat}`}
              style={{ padding: '6px 16px', borderRadius: '20px', border: '1px solid #d1d5db', backgroundColor: 'white', color: '#1A1A2E', fontSize: '13px', fontWeight: '500', textDecoration: 'none', whiteSpace: 'nowrap' }}>
              {cat}
            </Link>
          ))}
        </div>
      </div>

      {/* ANUNCIOS */}
      <div style={{ padding: '0 16px 32px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#1A1A2E', marginBottom: '16px' }}>
          Anuncios recientes
        </h2>
        <Suspense fallback={<Skeleton />}>
          <ListingsWithParams searchParams={searchParams} />
        </Suspense>
      </div>

      {/* BOTÓN FLOTANTE */}
      <Link href="/listings/nuevo" style={{
        position: 'fixed', bottom: '24px', right: '24px',
        backgroundColor: '#006B3C', color: 'white',
        padding: '16px 24px', borderRadius: '50px',
        fontWeight: 'bold', fontSize: '15px',
        textDecoration: 'none',
        boxShadow: '0 4px 20px rgba(0,107,60,0.4)',
        zIndex: 100
      }}>
        + Publicar
      </Link>

    </main>
  )
}

async function ListingsWithParams({
  searchParams
}: {
  searchParams: Promise<{ q?: string; category?: string; city?: string }>
}) {
  const { q, category, city } = await searchParams
  return <ListingsGrid q={q} category={category} city={city} />
}
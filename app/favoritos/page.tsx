import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import ListingCard from '@/components/ListingCard'

export default async function FavoritosPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/sign-in')

  const { data: favorites } = await supabase
    .from('favorites')
    .select('listing_id, listings(id, title, price, city, condition, photos, status)')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  const listings = favorites
    ?.map((f: any) => f.listings)
    .filter((l: any) => l && l.status === 'activo') || []

  return (
    <main style={{ minHeight: '100vh', backgroundColor: '#F8F9FA' }}>

      <nav style={{ backgroundColor: '#006B3C', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
        <Link href="/" style={{ color: 'white', textDecoration: 'none', fontSize: '22px' }}>←</Link>
        <span style={{ color: 'white', fontSize: '18px', fontWeight: 'bold' }}>Mis favoritos ❤️</span>
      </nav>

      <div style={{ padding: '24px 16px' }}>
        {listings.length > 0 ? (
          <>
            <p style={{ color: '#6B7280', fontSize: '14px', marginBottom: '16px' }}>
              {listings.length} anuncio{listings.length !== 1 ? 's' : ''} guardado{listings.length !== 1 ? 's' : ''}
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
              {listings.map((listing: any) => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
            </div>
          </>
        ) : (
          <div style={{ textAlign: 'center', padding: '60px 0', color: '#9ca3af' }}>
            <p style={{ fontSize: '48px' }}>🤍</p>
            <p style={{ fontSize: '18px', fontWeight: '500' }}>No tienes favoritos todavía</p>
            <p style={{ fontSize: '14px', marginTop: '4px' }}>Pulsa el corazón en cualquier anuncio para guardarlo</p>
            <Link href="/" style={{ display: 'inline-block', marginTop: '16px', backgroundColor: '#006B3C', color: 'white', padding: '10px 24px', borderRadius: '20px', textDecoration: 'none', fontWeight: '600', fontSize: '14px' }}>
              Ver anuncios
            </Link>
          </div>
        )}
      </div>

    </main>
  )
}
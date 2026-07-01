import { Suspense } from 'react'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import FavoriteButton from '@/components/FavoriteButton'
import PhotoGallery from '@/components/PhotoGallery'

type Seller = {
  full_name?: string | null
  avatar_url?: string | null
  city?: string | null
  rating?: number | null
}

type ListingWithSeller = {
  id: string
  title: string
  price: number
  city: string
  condition: string
  photos?: string[] | null
  description?: string | null
  views?: number | null
  category?: string | null
  status?: string | null
  seller_id?: string | null
  profiles?: Seller | null
}

const conditionLabel: Record<string, string> = {
  nuevo: '🆕 Nuevo',
  como_nuevo: '✨ Como nuevo',
  buen_estado: '👍 Buen estado',
  aceptable: '👌 Aceptable',
}

function formatPrice(price: number) {
  return new Intl.NumberFormat('es-ES').format(price) + ' XAF'
}

function badgeStyle(bg: string, color: string): React.CSSProperties {
  return { backgroundColor: bg, color, padding: '4px 12px', borderRadius: '20px', fontSize: '13px', fontWeight: '500' }
}

async function ListingDetail({ id }: { id: string }) {
  const supabase = await createClient()

  const { data: listing, error } = await supabase
    .from('listings')
    .select('*, profiles(full_name, avatar_url, city, rating)')
    .eq('id', id)
    .single() as { data: ListingWithSeller | null; error: unknown }

  if (error || !listing) notFound()

  const { data: { user } } = await supabase.auth.getUser()
  const isOwner = user?.id === listing.seller_id

  const seller: Seller = listing.profiles ?? {}

  await supabase
    .from('listings')
    .update({ views: (listing.views || 0) + 1 })
    .eq('id', id)

  const photos: string[] = listing.photos || []

  return (
    <div>
      {/* GALERÍA DE FOTOS */}
      <PhotoGallery photos={photos} title={listing.title} />

      {/* CONTENIDO */}
      <div style={{ padding: '20px 16px', maxWidth: '600px', margin: '0 auto' }}>

        {/* Título, precio y favorito */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
          <div style={{ flex: 1, marginRight: '12px' }}>
            <h1 style={{ fontSize: '22px', fontWeight: 'bold', color: '#1A1A2E', margin: '0 0 8px' }}>
              {listing.title}
            </h1>
            <p style={{ fontSize: '28px', fontWeight: 'bold', color: '#006B3C', margin: 0 }}>
              {formatPrice(listing.price)}
            </p>
          </div>
          {!isOwner && <FavoriteButton listingId={listing.id} />}
        </div>

        {/* Badges */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', margin: '16px 0 20px' }}>
          <span style={badgeStyle('#E8F5EE', '#006B3C')}>{conditionLabel[listing.condition] || listing.condition}</span>
          <span style={badgeStyle('#EEF2FF', '#4338CA')}>📂 {listing.category}</span>
          <span style={badgeStyle('#FFF7ED', '#C2410C')}>📍 {listing.city}</span>
          <span style={badgeStyle('#F3F4F6', '#6B7280')}>👁️ {listing.views} visitas</span>
        </div>

        {/* Descripción */}
        {listing.description && (
          <div style={{ backgroundColor: 'white', borderRadius: '16px', padding: '16px', marginBottom: '20px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
            <h2 style={{ fontSize: '16px', fontWeight: '600', color: '#1A1A2E', margin: '0 0 8px' }}>Descripción</h2>
            <p style={{ fontSize: '14px', color: '#4B5563', lineHeight: '1.6', margin: 0, whiteSpace: 'pre-wrap' }}>{listing.description}</p>
          </div>
        )}

        {/* Vendedor */}
        <div style={{ backgroundColor: 'white', borderRadius: '16px', padding: '16px', marginBottom: '20px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
          <h2 style={{ fontSize: '16px', fontWeight: '600', color: '#1A1A2E', margin: '0 0 12px' }}>Vendedor</h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: '#006B3C', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '20px', fontWeight: 'bold' }}>
              {seller?.full_name?.[0]?.toUpperCase() || '?'}
            </div>
            <div>
              <p style={{ margin: 0, fontWeight: '600', color: '#1A1A2E' }}>{seller?.full_name || 'Usuario'}</p>
              <p style={{ margin: '2px 0 0', fontSize: '13px', color: '#9CA3AF' }}>📍 {seller?.city || listing.city}</p>
            </div>
          </div>
        </div>

        {/* Aviso seguridad */}
        <div style={{ backgroundColor: '#FFFBEB', border: '1px solid #F5A623', borderRadius: '12px', padding: '14px', marginBottom: '24px' }}>
          <p style={{ margin: 0, fontSize: '13px', color: '#92400E' }}>
            ⚠️ <strong>Consejo de seguridad:</strong> Queda siempre en un lugar público. Nunca envíes dinero por adelantado.
          </p>
        </div>

        {/* Botón editar — solo para el vendedor */}
        {isOwner && (
          <Link
            href={`/listings/${listing.id}/editar`}
            style={{ display: 'block', width: '100%', backgroundColor: '#F5A623', color: '#1A1A2E', padding: '14px', borderRadius: '14px', fontSize: '15px', fontWeight: 'bold', textAlign: 'center', textDecoration: 'none', boxSizing: 'border-box', marginBottom: '12px' }}
          >
            ✏️ Editar anuncio
          </Link>
        )}

        {/* Botón WhatsApp — solo para otros */}
        {!isOwner && (
          <a
            href={`https://wa.me/?text=Hola, me interesa tu anuncio en EGMarket: ${listing.title} - ${formatPrice(listing.price)}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{ display: 'block', width: '100%', backgroundColor: '#25D366', color: 'white', padding: '16px', borderRadius: '14px', border: 'none', fontSize: '16px', fontWeight: 'bold', textAlign: 'center', textDecoration: 'none', boxSizing: 'border-box', marginBottom: '12px' }}
          >
            💬 Contactar por WhatsApp
          </a>
        )}

        <Link href="/"
          style={{ display: 'block', width: '100%', backgroundColor: 'white', color: '#006B3C', padding: '14px', borderRadius: '14px', border: '2px solid #006B3C', fontSize: '15px', fontWeight: '600', textAlign: 'center', textDecoration: 'none', boxSizing: 'border-box' }}
        >
          ← Ver más anuncios
        </Link>
      </div>
    </div>
  )
}

export default async function ListingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  return (
    <main style={{ minHeight: '100vh', backgroundColor: '#F8F9FA' }}>
      <nav style={{ backgroundColor: '#006B3C', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '12px', position: 'sticky', top: 0, zIndex: 50 }}>
        <Link href="/" style={{ color: 'white', textDecoration: 'none', fontSize: '22px' }}>←</Link>
        <span style={{ color: 'white', fontSize: '16px', fontWeight: '600' }}>Detalle del anuncio</span>
      </nav>
      <Suspense fallback={
        <div style={{ textAlign: 'center', padding: '60px', color: '#9ca3af' }}>
          <p style={{ fontSize: '32px' }}>⏳</p>
          <p>Cargando anuncio...</p>
        </div>
      }>
        <ListingDetail id={id} />
      </Suspense>
    </main>
  )
}
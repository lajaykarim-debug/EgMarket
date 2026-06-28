// app/listings/[id]/page.tsx
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { notFound } from 'next/navigation'

const conditionLabel: Record<string, string> = {
  nuevo: '🆕 Nuevo',
  como_nuevo: '✨ Como nuevo',
  buen_estado: '👍 Buen estado',
  aceptable: '👌 Aceptable',
}

function formatPrice(price: number) {
  return new Intl.NumberFormat('es-ES').format(price) + ' XAF'
}

export default async function ListingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  // Obtener el anuncio
  const { data: listing, error } = await supabase
    .from('listings')
    .select('*, profiles(full_name, avatar_url, city, rating, created_at)')
    .eq('id', id)
    .single()

  if (error || !listing) notFound()

  // Incrementar visitas
  await supabase
    .from('listings')
    .update({ views: (listing.views || 0) + 1 })
    .eq('id', id)

  const seller = listing.profiles as any
  const photos: string[] = listing.photos || []

  return (
    <main style={{ minHeight: '100vh', backgroundColor: '#F8F9FA' }}>

      {/* NAVBAR */}
      <nav style={{ backgroundColor: '#006B3C', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '12px', position: 'sticky', top: 0, zIndex: 50 }}>
        <Link href="/" style={{ color: 'white', textDecoration: 'none', fontSize: '22px', lineHeight: 1 }}>←</Link>
        <span style={{ color: 'white', fontSize: '16px', fontWeight: '600', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {listing.title}
        </span>
      </nav>

      {/* FOTOS */}
      <div style={{ backgroundColor: '#1A1A2E', width: '100%', aspectRatio: '1', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
        {photos.length > 0 ? (
          <img
            src={photos[0]}
            alt={listing.title}
            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
          />
        ) : (
          <span style={{ fontSize: '80px' }}>📦</span>
        )}
      </div>

      {/* Miniaturas si hay más de 1 foto */}
      {photos.length > 1 && (
        <div style={{ display: 'flex', gap: '8px', padding: '12px 16px', overflowX: 'auto', backgroundColor: '#1A1A2E' }}>
          {photos.map((photo, i) => (
            <img
              key={i}
              src={photo}
              alt={`Foto ${i + 1}`}
              style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '8px', border: i === 0 ? '2px solid #F5A623' : '2px solid transparent', flexShrink: 0 }}
            />
          ))}
        </div>
      )}

      {/* CONTENIDO */}
      <div style={{ padding: '20px 16px', maxWidth: '600px', margin: '0 auto' }}>

        {/* Título y precio */}
        <div style={{ marginBottom: '16px' }}>
          <h1 style={{ fontSize: '22px', fontWeight: 'bold', color: '#1A1A2E', margin: '0 0 8px' }}>
            {listing.title}
          </h1>
          <p style={{ fontSize: '28px', fontWeight: 'bold', color: '#006B3C', margin: 0 }}>
            {formatPrice(listing.price)}
          </p>
        </div>

        {/* Badges */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '20px' }}>
          <span style={badgeStyle('#E8F5EE', '#006B3C')}>
            {conditionLabel[listing.condition] || listing.condition}
          </span>
          <span style={badgeStyle('#EEF2FF', '#4338CA')}>
            📂 {listing.category}
          </span>
          <span style={badgeStyle('#FFF7ED', '#C2410C')}>
            📍 {listing.city}
          </span>
          <span style={badgeStyle('#F3F4F6', '#6B7280')}>
            👁️ {listing.views} visitas
          </span>
        </div>

        {/* Descripción */}
        {listing.description && (
          <div style={{ backgroundColor: 'white', borderRadius: '16px', padding: '16px', marginBottom: '20px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
            <h2 style={{ fontSize: '16px', fontWeight: '600', color: '#1A1A2E', margin: '0 0 8px' }}>
              Descripción
            </h2>
            <p style={{ fontSize: '14px', color: '#4B5563', lineHeight: '1.6', margin: 0, whiteSpace: 'pre-wrap' }}>
              {listing.description}
            </p>
          </div>
        )}

        {/* Info del vendedor */}
        <div style={{ backgroundColor: 'white', borderRadius: '16px', padding: '16px', marginBottom: '20px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
          <h2 style={{ fontSize: '16px', fontWeight: '600', color: '#1A1A2E', margin: '0 0 12px' }}>
            Vendedor
          </h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: '#006B3C', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '20px', fontWeight: 'bold', flexShrink: 0 }}>
              {seller?.full_name?.[0]?.toUpperCase() || '?'}
            </div>
            <div>
              <p style={{ margin: 0, fontWeight: '600', color: '#1A1A2E', fontSize: '15px' }}>
                {seller?.full_name || 'Usuario'}
              </p>
              <p style={{ margin: '2px 0 0', fontSize: '13px', color: '#9CA3AF' }}>
                📍 {seller?.city || listing.city}
              </p>
              {seller?.rating > 0 && (
                <p style={{ margin: '2px 0 0', fontSize: '13px', color: '#F5A623' }}>
                  ⭐ {seller.rating} valoración
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Aviso seguridad */}
        <div style={{ backgroundColor: '#FFFBEB', border: '1px solid #F5A623', borderRadius: '12px', padding: '14px', marginBottom: '24px' }}>
          <p style={{ margin: 0, fontSize: '13px', color: '#92400E' }}>
            ⚠️ <strong>Consejo de seguridad:</strong> Queda siempre en un lugar público para realizar el intercambio. Nunca envíes dinero por adelantado.
          </p>
        </div>

        {/* BOTÓN CONTACTAR */}
        <a
          href={`https://wa.me/?text=Hola, me interesa tu anuncio en EGMarket: ${listing.title} - ${formatPrice(listing.price)}`}
          target="_blank"
          rel="noopener noreferrer"
          style={{ display: 'block', width: '100%', backgroundColor: '#25D366', color: 'white', padding: '16px', borderRadius: '14px', border: 'none', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', textAlign: 'center', textDecoration: 'none', boxSizing: 'border-box', marginBottom: '12px' }}
        >
          💬 Contactar por WhatsApp
        </a>

        <Link
          href="/"
          style={{ display: 'block', width: '100%', backgroundColor: 'white', color: '#006B3C', padding: '14px', borderRadius: '14px', border: '2px solid #006B3C', fontSize: '15px', fontWeight: '600', cursor: 'pointer', textAlign: 'center', textDecoration: 'none', boxSizing: 'border-box' }}
        >
          ← Ver más anuncios
        </Link>

      </div>
    </main>
  )
}

function badgeStyle(bg: string, color: string): React.CSSProperties {
  return {
    backgroundColor: bg,
    color: color,
    padding: '4px 12px',
    borderRadius: '20px',
    fontSize: '13px',
    fontWeight: '500',
  }
}
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { updateProfile, signOut } from './actions'
import Link from 'next/link'

const CITIES = ['Malabo', 'Bata', 'Mongomo', 'Ebebiyín', 'Oyala', 'Otra']

const field: React.CSSProperties = {
  width: '100%',
  padding: '12px 16px',
  borderRadius: '12px',
  border: '1.5px solid #e5e7eb',
  fontSize: '14px',
  outline: 'none',
  backgroundColor: 'white',
  boxSizing: 'border-box',
  color: '#1A1A2E',
}

const label: React.CSSProperties = {
  display: 'block',
  fontSize: '14px',
  fontWeight: '600',
  color: '#374151',
  marginBottom: '6px',
}

export default async function PerfilPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/sign-in')

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  const { data: listings } = await supabase
    .from('listings')
    .select('id, title, price, status, photos, created_at')
    .eq('seller_id', user.id)
    .order('created_at', { ascending: false })

  const { count: favoritesCount } = await supabase
    .from('favorites')
    .select('id', { count: 'exact' })
    .eq('user_id', user.id)

  return (
    <main style={{ minHeight: '100vh', backgroundColor: '#F8F9FA' }}>

      {/* NAVBAR */}
      <nav style={{ backgroundColor: '#006B3C', padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Link href="/" style={{ color: 'white', textDecoration: 'none', fontSize: '22px' }}>←</Link>
          <span style={{ color: 'white', fontSize: '18px', fontWeight: 'bold' }}>Mi perfil</span>
        </div>
        <form action={signOut}>
          <button type="submit" style={{ backgroundColor: 'transparent', color: '#fca5a5', border: '1px solid #fca5a5', padding: '6px 14px', borderRadius: '20px', fontSize: '13px', cursor: 'pointer' }}>
            Cerrar sesión
          </button>
        </form>
      </nav>

      <div style={{ maxWidth: '600px', margin: '0 auto', padding: '24px 16px' }}>

        {/* AVATAR Y EMAIL */}
        <div style={{ backgroundColor: 'white', borderRadius: '20px', padding: '24px', marginBottom: '24px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', textAlign: 'center' }}>
          <div style={{ width: '80px', height: '80px', borderRadius: '50%', backgroundColor: '#006B3C', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px', overflow: 'hidden' }}>
            {profile?.avatar_url ? (
              <img src={profile.avatar_url} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <span style={{ color: 'white', fontSize: '32px', fontWeight: 'bold' }}>
                {profile?.full_name?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase() || '?'}
              </span>
            )}
          </div>
          <p style={{ margin: 0, fontWeight: '600', color: '#1A1A2E', fontSize: '16px' }}>
            {profile?.full_name || 'Sin nombre'}
          </p>
          <p style={{ margin: '4px 0 0', color: '#9CA3AF', fontSize: '13px' }}>
            {user.email}
          </p>
          {profile?.city && (
            <p style={{ margin: '4px 0 0', color: '#006B3C', fontSize: '13px' }}>
              📍 {profile.city}
            </p>
          )}

          {/* Stats */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '24px', marginTop: '16px', paddingTop: '16px', borderTop: '1px solid #f3f4f6' }}>
            <div style={{ textAlign: 'center' }}>
              <p style={{ margin: 0, fontWeight: '700', fontSize: '20px', color: '#1A1A2E' }}>{listings?.length || 0}</p>
              <p style={{ margin: '2px 0 0', fontSize: '12px', color: '#9CA3AF' }}>Anuncios</p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <p style={{ margin: 0, fontWeight: '700', fontSize: '20px', color: '#1A1A2E' }}>{favoritesCount || 0}</p>
              <p style={{ margin: '2px 0 0', fontSize: '12px', color: '#9CA3AF' }}>Favoritos</p>
            </div>
          </div>
        </div>

        {/* ACCESOS RÁPIDOS */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '24px' }}>
          <Link href="/listings/nuevo" style={{ backgroundColor: '#006B3C', color: 'white', padding: '16px', borderRadius: '16px', textDecoration: 'none', textAlign: 'center', fontWeight: '600', fontSize: '14px' }}>
            ➕ Publicar anuncio
          </Link>
          <Link href="/favoritos" style={{ backgroundColor: '#FEE2E2', color: '#EF4444', padding: '16px', borderRadius: '16px', textDecoration: 'none', textAlign: 'center', fontWeight: '600', fontSize: '14px' }}>
            ❤️ Mis favoritos
          </Link>
        </div>

        {/* FORMULARIO EDITAR PERFIL */}
        <div style={{ backgroundColor: 'white', borderRadius: '20px', padding: '24px', marginBottom: '24px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
          <h2 style={{ fontSize: '16px', fontWeight: '700', color: '#1A1A2E', margin: '0 0 20px' }}>
            ✏️ Editar perfil
          </h2>

          <form action={updateProfile}>
            <input type="hidden" name="current_avatar" value={profile?.avatar_url || ''} />

            <div style={{ marginBottom: '16px' }}>
              <label style={label}>Nombre completo</label>
              <input name="full_name" defaultValue={profile?.full_name || ''} placeholder="Tu nombre completo" style={field} />
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={label}>Teléfono</label>
              <input name="phone" defaultValue={profile?.phone || ''} placeholder="+240 222 000 000" style={field} />
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={label}>Ciudad</label>
              <select name="city" style={field} defaultValue={profile?.city || ''}>
                <option value="">Seleccionar ciudad...</option>
                {CITIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label style={label}>Foto de perfil</label>
              <input name="avatar" type="file" accept="image/*" style={{ fontSize: '14px', color: '#374151' }} />
            </div>

            <button type="submit" style={{ width: '100%', backgroundColor: '#006B3C', color: 'white', padding: '14px', borderRadius: '12px', border: 'none', fontSize: '15px', fontWeight: 'bold', cursor: 'pointer' }}>
              Guardar cambios
            </button>
          </form>
        </div>

        {/* MIS ANUNCIOS */}
        <div style={{ backgroundColor: 'white', borderRadius: '20px', padding: '24px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h2 style={{ fontSize: '16px', fontWeight: '700', color: '#1A1A2E', margin: 0 }}>
              📦 Mis anuncios ({listings?.length || 0})
            </h2>
            <Link href="/listings/nuevo" style={{ backgroundColor: '#006B3C', color: 'white', padding: '6px 14px', borderRadius: '20px', fontSize: '13px', fontWeight: '600', textDecoration: 'none' }}>
              + Nuevo
            </Link>
          </div>

          {listings && listings.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {listings.map((listing) => (
                <Link key={listing.id} href={`/listings/${listing.id}`} style={{ textDecoration: 'none' }}>
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'center', padding: '12px', borderRadius: '12px', border: '1px solid #f3f4f6', backgroundColor: '#FAFAFA' }}>
                    <div style={{ width: '56px', height: '56px', borderRadius: '10px', backgroundColor: '#e5e7eb', overflow: 'hidden', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px' }}>
                      {listing.photos?.[0]
                        ? <img src={listing.photos[0]} alt={listing.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        : '📦'
                      }
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ margin: 0, fontWeight: '600', color: '#1A1A2E', fontSize: '14px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {listing.title}
                      </p>
                      <p style={{ margin: '2px 0 0', color: '#006B3C', fontWeight: '700', fontSize: '14px' }}>
                        {new Intl.NumberFormat('es-ES').format(listing.price)} XAF
                      </p>
                    </div>
                    <span style={{
                      padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '600', flexShrink: 0,
                      backgroundColor: listing.status === 'activo' ? '#E8F5EE' : '#F3F4F6',
                      color: listing.status === 'activo' ? '#006B3C' : '#6B7280'
                    }}>
                      {listing.status === 'activo' ? '✅ Activo' : listing.status === 'vendido' ? '🏷️ Vendido' : '⏸️ Pausado'}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '32px 0', color: '#9ca3af' }}>
              <p style={{ fontSize: '32px' }}>📭</p>
              <p style={{ fontSize: '14px' }}>No tienes anuncios publicados todavía</p>
              <Link href="/listings/nuevo" style={{ display: 'inline-block', marginTop: '12px', backgroundColor: '#006B3C', color: 'white', padding: '10px 20px', borderRadius: '20px', fontSize: '14px', fontWeight: '600', textDecoration: 'none' }}>
                Publicar primer anuncio
              </Link>
            </div>
          )}
        </div>

      </div>
    </main>
  )
}
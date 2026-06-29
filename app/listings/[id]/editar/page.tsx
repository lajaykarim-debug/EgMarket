import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import { updateListing, deleteListing, markAsSold } from '../actions'
import Link from 'next/link'

const CATEGORIES = ['Electrónica', 'Ropa', 'Hogar', 'Vehículos', 'Inmuebles', 'Otros']
const CONDITIONS = [
  { value: 'nuevo', label: '🆕 Nuevo' },
  { value: 'como_nuevo', label: '✨ Como nuevo' },
  { value: 'buen_estado', label: '👍 Buen estado' },
  { value: 'aceptable', label: '👌 Aceptable' },
]
const CITIES = ['Malabo', 'Bata', 'Mongomo', 'Ebebiyín', 'Oyala', 'Otra']

const field: React.CSSProperties = {
  width: '100%', padding: '12px 16px', borderRadius: '12px',
  border: '1.5px solid #e5e7eb', fontSize: '14px', outline: 'none',
  backgroundColor: 'white', boxSizing: 'border-box', color: '#1A1A2E',
}

const label: React.CSSProperties = {
  display: 'block', fontSize: '14px', fontWeight: '600',
  color: '#374151', marginBottom: '6px',
}

export default async function EditarAnuncioPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/sign-in')

  const { data: listing, error } = await supabase
    .from('listings')
    .select('*')
    .eq('id', id)
    .eq('seller_id', user.id)
    .single()

  if (error || !listing) notFound()

  return (
    <main style={{ minHeight: '100vh', backgroundColor: '#F8F9FA' }}>

      {/* NAVBAR */}
      <nav style={{ backgroundColor: '#006B3C', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
        <Link href={`/listings/${id}`} style={{ color: 'white', textDecoration: 'none', fontSize: '22px' }}>←</Link>
        <span style={{ color: 'white', fontSize: '18px', fontWeight: 'bold' }}>Editar anuncio</span>
      </nav>

      <div style={{ maxWidth: '600px', margin: '0 auto', padding: '24px 16px' }}>

        {/* FORMULARIO EDITAR */}
        <form action={updateListing} style={{ backgroundColor: 'white', borderRadius: '20px', padding: '24px', marginBottom: '16px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
          <input type="hidden" name="id" value={listing.id} />

          <div style={{ marginBottom: '16px' }}>
            <label style={label}>Título *</label>
            <input name="title" required defaultValue={listing.title} style={field} />
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={label}>Descripción</label>
            <textarea name="description" rows={4} defaultValue={listing.description || ''} style={{ ...field, resize: 'vertical' }} />
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={label}>Precio (XAF) *</label>
            <div style={{ position: 'relative' }}>
              <input name="price" type="number" required min="0" defaultValue={listing.price} style={{ ...field, paddingRight: '60px' }} />
              <span style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', color: '#006B3C', fontWeight: 'bold', fontSize: '14px' }}>XAF</span>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
            <div>
              <label style={label}>Categoría *</label>
              <select name="category" required style={field} defaultValue={listing.category}>
                {CATEGORIES.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>
            <div>
              <label style={label}>Estado *</label>
              <select name="condition" required style={field} defaultValue={listing.condition}>
                {CONDITIONS.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
              </select>
            </div>
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={label}>Ciudad *</label>
            <select name="city" required style={field} defaultValue={listing.city}>
              {CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <button type="submit" style={{ width: '100%', backgroundColor: '#006B3C', color: 'white', padding: '14px', borderRadius: '12px', border: 'none', fontSize: '15px', fontWeight: 'bold', cursor: 'pointer' }}>
            Guardar cambios
          </button>
        </form>

        {/* ACCIONES PELIGROSAS */}
        <div style={{ backgroundColor: 'white', borderRadius: '20px', padding: '24px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
          <h2 style={{ fontSize: '16px', fontWeight: '700', color: '#1A1A2E', margin: '0 0 16px' }}>
            Otras acciones
          </h2>

          {/* Marcar como vendido */}
          <form action={markAsSold} style={{ marginBottom: '12px' }}>
            <input type="hidden" name="id" value={listing.id} />
            <button type="submit" style={{ width: '100%', backgroundColor: '#F5A623', color: '#1A1A2E', padding: '14px', borderRadius: '12px', border: 'none', fontSize: '15px', fontWeight: 'bold', cursor: 'pointer' }}>
              🏷️ Marcar como vendido
            </button>
          </form>

          {/* Eliminar */}
          <form action={deleteListing}>
            <input type="hidden" name="id" value={listing.id} />
            <button type="submit" style={{ width: '100%', backgroundColor: '#FEE2E2', color: '#DC2626', padding: '14px', borderRadius: '12px', border: 'none', fontSize: '15px', fontWeight: 'bold', cursor: 'pointer' }}>
              🗑️ Eliminar anuncio
            </button>
          </form>
        </div>

      </div>
    </main>
  )
}
import { createListing } from './actions'
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

export default function NuevoAnuncioPage() {
  return (
    <main style={{ minHeight: '100vh', backgroundColor: '#F8F9FA' }}>

      {/* NAVBAR */}
      <nav style={{ backgroundColor: '#006B3C', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
        <Link href="/" style={{ color: 'white', textDecoration: 'none', fontSize: '20px' }}>←</Link>
        <span style={{ color: 'white', fontSize: '18px', fontWeight: 'bold' }}>Publicar anuncio</span>
      </nav>

      {/* FORMULARIO */}
      <form action={createListing} style={{ maxWidth: '600px', margin: '0 auto', padding: '24px 16px' }}>

        {/* Título */}
        <div style={{ marginBottom: '20px' }}>
          <label style={label}>Título del anuncio *</label>
          <input
            name="title"
            required
            placeholder="Ej: iPhone 13 128GB negro"
            style={field}
          />
        </div>

        {/* Descripción */}
        <div style={{ marginBottom: '20px' }}>
          <label style={label}>Descripción</label>
          <textarea
            name="description"
            placeholder="Describe el producto, su estado, accesorios incluidos..."
            rows={4}
            style={{ ...field, resize: 'vertical' }}
          />
        </div>

        {/* Precio */}
        <div style={{ marginBottom: '20px' }}>
          <label style={label}>Precio (XAF) *</label>
          <div style={{ position: 'relative' }}>
            <input
              name="price"
              type="number"
              required
              min="0"
              placeholder="Ej: 25000"
              style={{ ...field, paddingRight: '60px' }}
            />
            <span style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', color: '#006B3C', fontWeight: 'bold', fontSize: '14px' }}>
              XAF
            </span>
          </div>
        </div>

        {/* Categoría y Estado */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
          <div>
            <label style={label}>Categoría *</label>
            <select name="category" required style={field}>
              <option value="" style={{ color: '#1A1A2E' }}>Seleccionar...</option>
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat} style={{ color: '#1A1A2E' }}>{cat}</option>
              ))}
            </select>
          </div>
          <div>
            <label style={label}>Estado *</label>
            <select name="condition" required style={field}>
              <option value="" style={{ color: '#1A1A2E' }}>Seleccionar...</option>
              {CONDITIONS.map((c) => (
                <option key={c.value} value={c.value} style={{ color: '#1A1A2E' }}>{c.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Ciudad */}
        <div style={{ marginBottom: '20px' }}>
          <label style={label}>Ciudad *</label>
          <select name="city" required style={field}>
            <option value="" style={{ color: '#1A1A2E' }}>Seleccionar ciudad...</option>
            {CITIES.map((c) => (
              <option key={c} value={c} style={{ color: '#1A1A2E' }}>{c}</option>
            ))}
          </select>
        </div>

        {/* Fotos */}
        <div style={{ marginBottom: '32px' }}>
          <label style={label}>Fotos (máximo 5)</label>
          <div style={{ border: '2px dashed #d1d5db', borderRadius: '12px', padding: '24px', textAlign: 'center', backgroundColor: 'white' }}>
            <p style={{ fontSize: '32px', margin: '0 0 8px' }}>📷</p>
            <p style={{ color: '#6b7280', fontSize: '14px', margin: '0 0 12px' }}>
              Añade fotos de tu producto
            </p>
            <input
              name="photos"
              type="file"
              accept="image/*"
              multiple
              style={{ fontSize: '14px', color: '#374151' }}
            />
            <p style={{ color: '#9ca3af', fontSize: '12px', marginTop: '8px' }}>
              JPG, PNG — máx. 5 fotos
            </p>
          </div>
        </div>

        {/* Aviso */}
        <div style={{ backgroundColor: '#E8F5EE', border: '1px solid #006B3C', borderRadius: '12px', padding: '16px', marginBottom: '24px' }}>
          <p style={{ margin: 0, fontSize: '14px', color: '#006B3C' }}>
            💵 <strong>Pago en persona:</strong> EGMarket facilita el contacto entre comprador y vendedor. El pago se realiza directamente entre las partes.
          </p>
        </div>

        {/* Botón publicar */}
        <button
          type="submit"
          style={{ width: '100%', backgroundColor: '#006B3C', color: 'white', padding: '16px', borderRadius: '14px', border: 'none', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer' }}
        >
          Publicar anuncio
        </button>

      </form>
    </main>
  )
}
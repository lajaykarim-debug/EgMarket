'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

const CITIES = ['Todas', 'Malabo', 'Bata', 'Mongomo', 'Ebebiyín', 'Oyala']
const SORT_OPTIONS = [
  { value: 'reciente', label: '🕐 Más reciente' },
  { value: 'precio_asc', label: '💰 Precio: menor a mayor' },
  { value: 'precio_desc', label: '💰 Precio: mayor a menor' },
  { value: 'vistas', label: '👁️ Más visto' },
]

export default function SearchBar() {
  const [query, setQuery] = useState('')
  const [city, setCity] = useState('')
  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')
  const [sort, setSort] = useState('reciente')
  const [showFilters, setShowFilters] = useState(false)
  const router = useRouter()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams()
    if (query) params.set('q', query)
    if (city && city !== 'Todas') params.set('city', city)
    if (minPrice) params.set('min', minPrice)
    if (maxPrice) params.set('max', maxPrice)
    if (sort !== 'reciente') params.set('sort', sort)
    router.push(`/?${params.toString()}`)
  }

  return (
    <form onSubmit={handleSearch}>
      {/* Barra principal */}
      <div style={{ display: 'flex', gap: '8px' }}>
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', backgroundColor: 'white', borderRadius: '12px', padding: '0 12px', gap: '8px' }}>
          <span style={{ fontSize: '16px' }}>🔍</span>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="¿Qué estás buscando?"
            style={{ flex: 1, padding: '12px 0', fontSize: '14px', border: 'none', outline: 'none', color: '#1A1A2E', backgroundColor: 'transparent' }}
          />
        </div>
        <button
          type="button"
          onClick={() => setShowFilters(!showFilters)}
          style={{ backgroundColor: showFilters ? '#F5A623' : 'rgba(255,255,255,0.2)', color: showFilters ? '#1A1A2E' : 'white', padding: '12px 14px', borderRadius: '12px', border: 'none', fontSize: '18px', cursor: 'pointer' }}
        >
          ⚙️
        </button>
        <button
          type="submit"
          style={{ backgroundColor: '#F5A623', color: '#1A1A2E', padding: '12px 18px', borderRadius: '12px', border: 'none', fontWeight: 'bold', fontSize: '14px', cursor: 'pointer' }}
        >
          Buscar
        </button>
      </div>

      {/* Filtros expandibles */}
      {showFilters && (
        <div style={{ backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '12px', padding: '16px', marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '10px' }}>

          {/* Ciudad */}
          <div>
            <label style={{ color: '#a7f3d0', fontSize: '12px', fontWeight: '600', display: 'block', marginBottom: '4px' }}>📍 Ciudad</label>
            <select
              value={city}
              onChange={(e) => setCity(e.target.value)}
              style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: 'none', fontSize: '14px', color: '#1A1A2E', outline: 'none' }}
            >
              {CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          {/* Precio */}
          <div>
            <label style={{ color: '#a7f3d0', fontSize: '12px', fontWeight: '600', display: 'block', marginBottom: '4px' }}>💰 Rango de precio (XAF)</label>
            <div style={{ display: 'flex', gap: '8px' }}>
              <input
                type="number"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                placeholder="Mínimo"
                style={{ flex: 1, padding: '10px 12px', borderRadius: '10px', border: 'none', fontSize: '14px', color: '#1A1A2E', outline: 'none' }}
              />
              <input
                type="number"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                placeholder="Máximo"
                style={{ flex: 1, padding: '10px 12px', borderRadius: '10px', border: 'none', fontSize: '14px', color: '#1A1A2E', outline: 'none' }}
              />
            </div>
          </div>

          {/* Ordenar */}
          <div>
            <label style={{ color: '#a7f3d0', fontSize: '12px', fontWeight: '600', display: 'block', marginBottom: '4px' }}>↕️ Ordenar por</label>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: 'none', fontSize: '14px', color: '#1A1A2E', outline: 'none' }}
            >
              {SORT_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>

        </div>
      )}
    </form>
  )
}
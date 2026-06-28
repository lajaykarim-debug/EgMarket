'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

const CITIES = ['Todas', 'Malabo', 'Bata', 'Mongomo', 'Ebebiyín', 'Oyala']

export default function SearchBar() {
  const [query, setQuery] = useState('')
  const [city, setCity] = useState('')
  const router = useRouter()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams()
    if (query) params.set('q', query)
    if (city && city !== 'Todas') params.set('city', city)
    router.push(`/?${params.toString()}`)
  }

  return (
    <form onSubmit={handleSearch} style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="¿Qué estás buscando?"
        style={{ flex: 1, padding: '12px 16px', borderRadius: '12px', border: 'none', fontSize: '14px', outline: 'none' }}
      />
      <select
        value={city}
        onChange={(e) => setCity(e.target.value)}
        style={{ padding: '12px', borderRadius: '12px', border: 'none', fontSize: '14px', outline: 'none' }}
      >
        {CITIES.map((c) => <option key={c}>{c}</option>)}
      </select>
      <button
        type="submit"
        style={{ backgroundColor: '#F5A623', color: '#1A1A2E', padding: '12px 20px', borderRadius: '12px', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}
      >
        Buscar
      </button>
    </form>
  )
}
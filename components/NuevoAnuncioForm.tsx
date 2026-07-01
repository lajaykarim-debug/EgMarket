'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

const CATEGORIES = [
  'Electrónica',
  'Ropa',
  'Hogar',
  'Vehículos',
  'Inmuebles',
  'Otros',
]

const CONDITIONS = [
  { value: 'nuevo', label: '🆕 Nuevo' },
  { value: 'como_nuevo', label: '✨ Como nuevo' },
  { value: 'buen_estado', label: '👍 Buen estado' },
  { value: 'usado', label: '📦 Usado' },
]

const inputStyle = {
  width: '100%',
  padding: '14px 16px',
  borderRadius: '12px',
  border: '1px solid #D0D5DD',
  fontSize: '16px',
  color: '#1A1A2E',
  backgroundColor: 'white',
} as const

const labelStyle = {
  display: 'block',
  marginBottom: '8px',
  fontWeight: 'bold',
  color: '#1A1A2E',
} as const

export default function NuevoAnuncioForm() {
  const router = useRouter()
  const supabase = createClient()

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const formData = new FormData(e.currentTarget)

      const title = String(formData.get('title') || '')
      const description = String(formData.get('description') || '')
      const price = Number(formData.get('price') || 0)
      const category = String(formData.get('category') || '')
      const condition = String(formData.get('condition') || '')
      const city = String(formData.get('city') || '')

      const files = formData.getAll('photos') as File[]

      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        setError('Debes iniciar sesión para publicar.')
        setLoading(false)
        return
      }

      let photoUrls: string[] = []

      for (const file of files) {
        if (!file || file.size === 0) continue

        const fileExt = file.name.split('.').pop()
        const fileName = `${user.id}/${Date.now()}-${Math.random()
          .toString(36)
          .slice(2)}.${fileExt}`

        const { error: uploadError } = await supabase.storage
          .from('listing-photos')
          .upload(fileName, file)

        if (uploadError) {
          setError(`Error subiendo imagen: ${uploadError.message}`)
          setLoading(false)
          return
        }

        const { data } = supabase.storage
          .from('listing-photos')
          .getPublicUrl(fileName)

        if (data?.publicUrl) {
          photoUrls.push(data.publicUrl)
        }
      }

      const { error: insertError } = await supabase.from('listings').insert({
        seller_id: user.id,
        title,
        description,
        price,
        category,
        condition,
        city,
        photos: photoUrls,
        status: 'activo',
      })

      if (insertError) {
        setError(insertError.message)
        setLoading(false)
        return
      }

      router.push('/')
      router.refresh()
    } catch (err) {
      setError('Ocurrió un error al publicar el anuncio.')
      setLoading(false)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        maxWidth: '600px',
        margin: '0 auto',
        padding: '24px 16px 40px',
      }}
    >
      <div style={{ marginBottom: '24px', textAlign: 'center' }}>
        <h1
          style={{
            fontSize: '30px',
            fontWeight: 'bold',
            color: '#006B3C',
            marginBottom: '8px',
          }}
        >
          Publica tu producto
        </h1>
        <p style={{ color: '#666', fontSize: '16px' }}>
          Sube fotos y detalles para vender más rápido.
        </p>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <label htmlFor="title" style={labelStyle}>
          Título del anuncio
        </label>
        <input
          id="title"
          name="title"
          type="text"
          required
          placeholder="Ej: iPhone 12 en buen estado"
          style={inputStyle}
        />
      </div>

      <div style={{ marginBottom: '20px' }}>
        <label htmlFor="price" style={labelStyle}>
          Precio (XAF)
        </label>
        <input
          id="price"
          name="price"
          type="number"
          required
          placeholder="Ej: 50000"
          style={inputStyle}
        />
      </div>

      <div style={{ marginBottom: '20px' }}>
        <label htmlFor="category" style={labelStyle}>
          Categoría
        </label>
        <select
          id="category"
          name="category"
          required
          defaultValue=""
          style={inputStyle}
        >
          <option value="" disabled>
            Selecciona una categoría
          </option>
          {CATEGORIES.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <label htmlFor="condition" style={labelStyle}>
          Estado
        </label>
        <select
          id="condition"
          name="condition"
          required
          defaultValue=""
          style={inputStyle}
        >
          <option value="" disabled>
            Selecciona el estado
          </option>
          {CONDITIONS.map((condition) => (
            <option key={condition.value} value={condition.value}>
              {condition.label}
            </option>
          ))}
        </select>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <label htmlFor="city" style={labelStyle}>
          Ciudad
        </label>
        <input
          id="city"
          name="city"
          type="text"
          required
          placeholder="Ej: Malabo"
          style={inputStyle}
        />
      </div>

      <div style={{ marginBottom: '20px' }}>
        <label htmlFor="description" style={labelStyle}>
          Descripción
        </label>
        <textarea
          id="description"
          name="description"
          required
          rows={5}
          placeholder="Describe tu producto: marca, estado, tiempo de uso, etc."
          style={{
            ...inputStyle,
            resize: 'vertical',
          }}
        />
      </div>

      <div style={{ marginBottom: '20px' }}>
        <label htmlFor="photos" style={labelStyle}>
          Fotos
        </label>
        <input
          id="photos"
          name="photos"
          type="file"
          accept="image/*"
          multiple
          style={{
            ...inputStyle,
            padding: '12px',
          }}
        />
        <p style={{ marginTop: '8px', fontSize: '14px', color: '#666' }}>
          Puedes subir varias fotos del producto.
        </p>
      </div>

      {error && (
        <div
          style={{
            marginBottom: '20px',
            backgroundColor: '#FEE2E2',
            color: '#991B1B',
            border: '1px solid #FCA5A5',
            borderRadius: '12px',
            padding: '12px 14px',
            fontSize: '14px',
          }}
        >
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        style={{
          width: '100%',
          backgroundColor: loading ? '#7AAE95' : '#006B3C',
          color: 'white',
          padding: '16px',
          borderRadius: '14px',
          border: 'none',
          fontSize: '16px',
          fontWeight: 'bold',
          cursor: loading ? 'not-allowed' : 'pointer',
        }}
      >
        {loading ? 'Publicando...' : 'Publicar anuncio'}
      </button>
    </form>
  )
}
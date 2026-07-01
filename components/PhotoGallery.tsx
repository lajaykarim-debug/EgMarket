'use client'

import { useState } from 'react'

export default function PhotoGallery({ photos, title }: { photos: string[], title: string }) {
  const [current, setCurrent] = useState(0)

  if (photos.length === 0) {
    return (
      <div style={{ backgroundColor: '#1A1A2E', width: '100%', aspectRatio: '1', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '80px' }}>
        📦
      </div>
    )
  }

  const prev = () => setCurrent((c) => (c - 1 + photos.length) % photos.length)
  const next = () => setCurrent((c) => (c + 1) % photos.length)

  return (
    <div style={{ position: 'relative', backgroundColor: '#1A1A2E', width: '100%', aspectRatio: '1', overflow: 'hidden' }}>

      {/* Imagen principal */}
      <img
        src={photos[current]}
        alt={`${title} - foto ${current + 1}`}
        style={{ width: '100%', height: '100%', objectFit: 'contain' }}
      />

      {/* Botones anterior/siguiente — solo si hay más de 1 foto */}
      {photos.length > 1 && (
        <>
          <button
            onClick={prev}
            style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', backgroundColor: 'rgba(0,0,0,0.5)', color: 'white', border: 'none', borderRadius: '50%', width: '36px', height: '36px', fontSize: '18px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            ‹
          </button>
          <button
            onClick={next}
            style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', backgroundColor: 'rgba(0,0,0,0.5)', color: 'white', border: 'none', borderRadius: '50%', width: '36px', height: '36px', fontSize: '18px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            ›
          </button>

          {/* Contador */}
          <div style={{ position: 'absolute', bottom: '12px', right: '12px', backgroundColor: 'rgba(0,0,0,0.6)', color: 'white', padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '600' }}>
            {current + 1} / {photos.length}
          </div>

          {/* Puntos indicadores */}
          <div style={{ position: 'absolute', bottom: '12px', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '6px' }}>
            {photos.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                style={{ width: i === current ? '20px' : '8px', height: '8px', borderRadius: '4px', backgroundColor: i === current ? '#F5A623' : 'rgba(255,255,255,0.5)', border: 'none', cursor: 'pointer', padding: 0, transition: 'all 0.2s' }}
              />
            ))}
          </div>
        </>
      )}

      {/* Miniaturas */}
      {photos.length > 1 && (
        <div style={{ position: 'absolute', bottom: '48px', left: 0, right: 0, display: 'flex', gap: '6px', padding: '0 12px', overflowX: 'auto', justifyContent: 'center' }}>
          {photos.map((photo, i) => (
            <img
              key={i}
              src={photo}
              alt={`miniatura ${i + 1}`}
              onClick={() => setCurrent(i)}
              style={{ width: '48px', height: '48px', objectFit: 'cover', borderRadius: '8px', border: i === current ? '2px solid #F5A623' : '2px solid transparent', cursor: 'pointer', flexShrink: 0, opacity: i === current ? 1 : 0.6, transition: 'all 0.2s' }}
            />
          ))}
        </div>
      )}
    </div>
  )
}
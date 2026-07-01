import Link from 'next/link'
import NuevoAnuncioForm from '@/components/NuevoAnuncioForm'

export default function NuevoAnuncioPage() {
  return (
    <main style={{ minHeight: '100vh', backgroundColor: '#F8F9FA' }}>
      <nav
        style={{
          backgroundColor: '#006B3C',
          padding: '12px 16px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
        }}
      >
        <Link
          href="/"
          style={{ color: 'white', textDecoration: 'none', fontSize: '20px' }}
        >
          ←
        </Link>

        <span style={{ color: 'white', fontSize: '18px', fontWeight: 'bold' }}>
          Publicar anuncio
        </span>
      </nav>

      <NuevoAnuncioForm />
    </main>
  )
}
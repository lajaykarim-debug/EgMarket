import Link from 'next/link'

export default function SignUpPage() {
  return (
    <main style={{ minHeight: '100vh', backgroundColor: '#006B3C', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>

      {/* LOGO */}
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <p style={{ fontSize: '48px', margin: 0 }}>🛒</p>
        <h1 style={{ color: 'white', fontSize: '32px', fontWeight: 'bold', margin: '8px 0 4px' }}>EGMarket</h1>
        <p style={{ color: '#a7f3d0', fontSize: '14px', margin: 0 }}>Compra y vende en Guinea Ecuatorial 🇬🇶</p>
      </div>

      {/* TARJETA */}
      <div style={{ backgroundColor: 'white', borderRadius: '24px', padding: '32px 24px', width: '100%', maxWidth: '400px', boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}>

        {/* TABS */}
        <div style={{ display: 'flex', backgroundColor: '#F3F4F6', borderRadius: '12px', padding: '4px', marginBottom: '24px' }}>
          <a href="/auth/sign-in" style={{ flex: 1, textAlign: 'center', padding: '10px', borderRadius: '10px', color: '#6B7280', fontWeight: '600', fontSize: '14px', textDecoration: 'none' }}>
            Iniciar sesión
          </a>
          <a href="/auth/sign-up" style={{ flex: 1, textAlign: 'center', padding: '10px', borderRadius: '10px', backgroundColor: '#006B3C', color: 'white', fontWeight: '600', fontSize: '14px', textDecoration: 'none' }}>
            Registrarse
          </a>
        </div>

        {/* FORMULARIO REGISTRO */}
        <form action="/auth/sign-up" method="POST">
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '6px' }}>
              Email
            </label>
            <input
              name="email"
              type="email"
              required
              placeholder="tu@email.com"
              style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1.5px solid #e5e7eb', fontSize: '14px', outline: 'none', boxSizing: 'border-box', color: '#1A1A2E' }}
            />
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '6px' }}>
              Contraseña
            </label>
            <input
              name="password"
              type="password"
              required
              placeholder="Mínimo 6 caracteres"
              style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1.5px solid #e5e7eb', fontSize: '14px', outline: 'none', boxSizing: 'border-box', color: '#1A1A2E' }}
            />
          </div>

          <button
            type="submit"
            style={{ width: '100%', backgroundColor: '#F5A623', color: '#1A1A2E', padding: '14px', borderRadius: '12px', border: 'none', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer' }}
          >
            Crear cuenta gratis
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '14px', color: '#6B7280' }}>
          ¿Ya tienes cuenta?{' '}
          <a href="/auth/sign-in" style={{ color: '#006B3C', fontWeight: '600', textDecoration: 'none' }}>
            Iniciar sesión
          </a>
        </p>

      </div>

      <Link href="/" style={{ color: '#a7f3d0', marginTop: '24px', fontSize: '14px', textDecoration: 'none' }}>
        ← Volver al inicio
      </Link>

    </main>
  )
}
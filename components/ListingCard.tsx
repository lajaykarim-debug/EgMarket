import Image from 'next/image'
import Link from 'next/link'

interface Listing {
  id: string
  title: string
  price: number
  city: string
  condition: string
  photos: string[]
}

function formatPrice(price: number) {
  return new Intl.NumberFormat('es-ES').format(price) + ' XAF'
}

export default function ListingCard({ listing }: { listing: Listing }) {
  return (
    <Link href={`/listings/${listing.id}`} style={{ textDecoration: 'none' }}>
      <div style={{ backgroundColor: 'white', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', cursor: 'pointer' }}>
        <div style={{ position: 'relative', aspectRatio: '1', backgroundColor: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem' }}>
          {listing.photos?.[0]
            ? <Image src={listing.photos[0]} alt={listing.title} fill style={{ objectFit: 'cover' }} unoptimized />
            : '📦'}
        </div>
        <div style={{ padding: '12px' }}>
          <p style={{ margin: 0, fontSize: '14px', fontWeight: '500', color: '#1A1A2E', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
            {listing.title}
          </p>
          <p style={{ margin: '4px 0 0', fontSize: '16px', fontWeight: 'bold', color: '#006B3C' }}>
            {formatPrice(listing.price)}
          </p>
          <p style={{ margin: '4px 0 0', fontSize: '12px', color: '#9ca3af' }}>
            📍 {listing.city}
          </p>
        </div>
      </div>
    </Link>
  )
}
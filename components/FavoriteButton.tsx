'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function FavoriteButton({ listingId }: { listingId: string }) {
  const [isFavorite, setIsFavorite] = useState(false)
  const [loading, setLoading] = useState(true)
  const [userId, setUserId] = useState<string | null>(null)

  useEffect(() => {
    const supabase = createClient()

    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { setLoading(false); return }
      setUserId(user.id)

      const { data } = await supabase
        .from('favorites')
        .select('id')
        .eq('user_id', user.id)
        .eq('listing_id', listingId)
        .maybeSingle()

      setIsFavorite(!!data)
      setLoading(false)
    }

    init()
  }, [listingId])

  const toggleFavorite = async () => {
    if (!userId || loading) return

    const supabase = createClient()
    setLoading(true)

    const { data, error } = await supabase
      .rpc('toggle_favorite', {
        p_user_id: userId,
        p_listing_id: listingId
      })

    if (!error) setIsFavorite(data)
    setLoading(false)
  }

  if (loading && !userId) return null

  return (
    <button
      onClick={toggleFavorite}
      disabled={loading}
      style={{
        backgroundColor: isFavorite ? '#FEE2E2' : 'white',
        border: `2px solid ${isFavorite ? '#EF4444' : '#e5e7eb'}`,
        borderRadius: '50%',
        width: '44px',
        height: '44px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: loading ? 'not-allowed' : 'pointer',
        fontSize: '20px',
        transition: 'all 0.2s',
        flexShrink: 0,
      }}
    >
      {isFavorite ? '❤️' : '🤍'}
    </button>
  )
}
'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export async function createListing(formData: FormData) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/sign-in')

  // Crear perfil si no existe
  await supabase
    .from('profiles')
    .upsert({
      id: user.id,
      full_name: user.email?.split('@')[0] || 'Usuario',
    }, { onConflict: 'id', ignoreDuplicates: true })

  const title = formData.get('title') as string
  const description = formData.get('description') as string
  const price = parseInt(formData.get('price') as string)
  const category = formData.get('category') as string
  const condition = formData.get('condition') as string
  const city = formData.get('city') as string

  console.log('📝 Publicando:', { title, price, category, condition, city })

  // Subir fotos
  const photos = formData.getAll('photos') as File[]
  const photoUrls: string[] = []

  for (const photo of photos.slice(0, 5)) {
    if (photo.size === 0) continue
    const fileName = `${user.id}/${Date.now()}-${photo.name}`
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('listing-photos')
      .upload(fileName, photo, { contentType: photo.type })

    if (!uploadError && uploadData) {
      const { data: { publicUrl } } = supabase.storage
        .from('listing-photos')
        .getPublicUrl(uploadData.path)
      photoUrls.push(publicUrl)
    }
  }

  // Insertar anuncio
  const { data, error } = await supabase
    .from('listings')
    .insert({
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
    .select('id')
    .single()

  if (error) {
    console.log('❌ Error:', error.message)
    redirect('/listings/nuevo?error=1')
  }

  console.log('✅ Anuncio publicado con ID:', data.id)
  redirect('/')
}
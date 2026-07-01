'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export async function createListing(formData: FormData) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/sign-in')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, phone, city')
    .eq('id', user.id)
    .single()

  if (!profile?.full_name || !profile?.phone || !profile?.city) {
    redirect('/perfil?incompleto=1')
  }

  const title = String(formData.get('title') ?? '').trim()
  const description = String(formData.get('description') ?? '').trim()
  const price = Number(formData.get('price') ?? 0)
  const category = String(formData.get('category') ?? '')
  const condition = String(formData.get('condition') ?? '')
  const city = String(formData.get('city') ?? '')

  if (!title || !category || !condition || !city || Number.isNaN(price) || price < 0) {
    redirect('/listings/nuevo?error=fields')
  }

  const files = formData
    .getAll('photos')
    .filter((value): value is File => value instanceof File && value.size > 0)
    .slice(0, 5)

  const photoUrls: string[] = []

  for (const file of files) {
    const ext = file.name.split('.').pop() || 'jpg'
    const filePath = `${user.id}/${crypto.randomUUID()}.${ext}`

    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    const { data, error } = await supabase.storage
      .from('listing-photos')
      .upload(filePath, buffer, {
        contentType: file.type,
        upsert: false,
      })

    if (error || !data) {
      redirect('/listings/nuevo?error=upload')
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from('listing-photos').getPublicUrl(data.path)

    photoUrls.push(publicUrl)
  }

  const { error } = await supabase.from('listings').insert({
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

  if (error) {
    redirect('/listings/nuevo?error=db')
  }

  revalidatePath('/')
  redirect('/?published=1')
}
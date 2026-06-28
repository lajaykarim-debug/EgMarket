'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

export async function updateProfile(formData: FormData) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/sign-in')

  const full_name = formData.get('full_name') as string
  const city = formData.get('city') as string
  const phone = formData.get('phone') as string

  // Subir avatar si hay uno nuevo
  const avatar = formData.get('avatar') as File
  let avatar_url = formData.get('current_avatar') as string

  if (avatar && avatar.size > 0) {
    const fileName = `avatars/${user.id}-${Date.now()}`
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('listing-photos')
      .upload(fileName, avatar, { contentType: avatar.type, upsert: true })

    if (!uploadError && uploadData) {
      const { data: { publicUrl } } = supabase.storage
        .from('listing-photos')
        .getPublicUrl(uploadData.path)
      avatar_url = publicUrl
    }
  }

  const { error } = await supabase
    .from('profiles')
    .upsert({
      id: user.id,
      full_name,
      city,
      phone,
      avatar_url,
    }, { onConflict: 'id' })

  if (error) {
    console.log('❌ Error actualizando perfil:', error.message)
    return
  }

  console.log('✅ Perfil actualizado')
  revalidatePath('/perfil')
  redirect('/perfil')
}

export async function signOut() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/')
}
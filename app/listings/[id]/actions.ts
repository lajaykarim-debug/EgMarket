'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

export async function updateListing(formData: FormData) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/sign-in')

  const id = formData.get('id') as string
  const title = formData.get('title') as string
  const description = formData.get('description') as string
  const price = parseInt(formData.get('price') as string)
  const category = formData.get('category') as string
  const condition = formData.get('condition') as string
  const city = formData.get('city') as string

  const { error } = await supabase
    .from('listings')
    .update({ title, description, price, category, condition, city, updated_at: new Date().toISOString() })
    .eq('id', id)
    .eq('seller_id', user.id)

  if (error) {
    console.log('❌ Error:', error.message)
    return
  }

  revalidatePath(`/listings/${id}`)
  redirect(`/listings/${id}`)
}

export async function deleteListing(formData: FormData) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/sign-in')

  const id = formData.get('id') as string

  const { error } = await supabase
    .from('listings')
    .update({ status: 'eliminado' })
    .eq('id', id)
    .eq('seller_id', user.id)

  if (error) {
    console.log('❌ Error:', error.message)
    return
  }

  revalidatePath('/')
  redirect('/')
}

export async function markAsSold(formData: FormData) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/sign-in')

  const id = formData.get('id') as string

  await supabase
    .from('listings')
    .update({ status: 'vendido' })
    .eq('id', id)
    .eq('seller_id', user.id)

  revalidatePath('/')
  redirect('/')
}
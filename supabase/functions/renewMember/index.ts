
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { memberId, years = 1 } = await req.json()

    if (!memberId) {
      return new Response(
        JSON.stringify({ error: 'Member ID is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Get current member data
    const { data: currentMember, error: fetchError } = await supabaseClient
      .from('members')
      .select('paid_through, full_name, user_id')
      .eq('id', memberId)
      .single()

    if (fetchError) {
      throw fetchError
    }

    // Calculate new expiry date
    const currentDate = currentMember.paid_through ? new Date(currentMember.paid_through) : new Date()
    const newExpiryDate = new Date(currentDate.setFullYear(currentDate.getFullYear() + years))

    // Update member's paid_through date
    const { error: updateError } = await supabaseClient
      .from('members')
      .update({
        paid_through: newExpiryDate.toISOString().split('T')[0] // Format as YYYY-MM-DD
      })
      .eq('id', memberId)

    if (updateError) {
      throw updateError
    }

    // Create notification
    await supabaseClient
      .from('notifications')
      .insert({
        member_id: memberId,
        title: 'Membership Renewed',
        message: `Your membership has been renewed for ${years} year${years > 1 ? 's' : ''}. New expiry date: ${newExpiryDate.toLocaleDateString()}`,
        type: 'general'
      })

    console.log(`Member ${currentMember.full_name} renewed for ${years} years`)

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Member ${currentMember.full_name} renewed for ${years} year${years > 1 ? 's' : ''}`,
        newExpiryDate: newExpiryDate.toISOString().split('T')[0]
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error renewing member:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})

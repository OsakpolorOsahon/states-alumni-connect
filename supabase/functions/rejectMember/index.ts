
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

    const { memberId, reason } = await req.json()

    if (!memberId) {
      return new Response(
        JSON.stringify({ error: 'Member ID is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Update member status to Rejected
    const { data: member, error: updateError } = await supabaseClient
      .from('members')
      .update({
        status: 'Rejected'
      })
      .eq('id', memberId)
      .select('full_name, user_id')
      .single()

    if (updateError) {
      throw updateError
    }

    // Get user email for notification
    const { data: userData, error: userError } = await supabaseClient.auth.admin.getUserById(member.user_id)
    
    if (userError) {
      console.error('Error fetching user data:', userError)
    }

    // Create notification
    await supabaseClient
      .from('notifications')
      .insert({
        member_id: memberId,
        title: 'Membership Application Update',
        message: `Your membership application has been reviewed. ${reason || 'Please contact support for more information.'}`,
        type: 'member_rejected'
      })

    console.log(`Member ${member.full_name} rejected. Reason: ${reason}`)

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Member ${member.full_name} rejected`,
        email: userData?.user?.email,
        reason
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error rejecting member:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})

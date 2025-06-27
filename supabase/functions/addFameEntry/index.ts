
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

    const { memberId, achievementTitle, achievementDescription, achievementDate } = await req.json()

    if (!memberId || !achievementTitle) {
      return new Response(
        JSON.stringify({ error: 'Member ID and achievement title are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Add to hall of fame
    const { data: fameEntry, error: fameError } = await supabaseClient
      .from('hall_of_fame')
      .insert({
        member_id: memberId,
        achievement_title: achievementTitle,
        achievement_description: achievementDescription,
        achievement_date: achievementDate || new Date().toISOString().split('T')[0]
      })
      .select('*')
      .single()

    if (fameError) {
      throw fameError
    }

    // Get member info for notification
    const { data: member } = await supabaseClient
      .from('members')
      .select('full_name')
      .eq('id', memberId)
      .single()

    // Create notification
    await supabaseClient
      .from('notifications')
      .insert({
        member_id: memberId,
        title: 'Hall of Fame Entry!',
        message: `Congratulations! You've been added to the Hall of Fame for "${achievementTitle}".`,
        type: 'general'
      })

    console.log(`Hall of Fame entry created for member ${member?.full_name}: ${achievementTitle}`)

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Hall of Fame entry created for ${member?.full_name}`,
        fameEntry
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error creating Hall of Fame entry:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})


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

    const { member_id, achievement_title, achievement_description, achievement_date } = await req.json()

    if (!member_id || !achievement_title) {
      return new Response(
        JSON.stringify({ error: 'Member ID and achievement title are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Add Hall of Fame entry
    const { data: entry, error: entryError } = await supabaseClient
      .from('hall_of_fame')
      .insert({
        member_id,
        achievement_title,
        achievement_description,
        achievement_date: achievement_date || null
      })
      .select('*')
      .single()

    if (entryError) {
      throw entryError
    }

    // Get member info for notification
    const { data: member } = await supabaseClient
      .from('members')
      .select('full_name')
      .eq('id', member_id)
      .single()

    // Create notification
    await supabaseClient
      .from('notifications')
      .insert({
        member_id: member_id,
        title: 'Hall of Fame Recognition!',
        message: `Congratulations! You've been inducted into the Hall of Fame for "${achievement_title}".`,
        type: 'hall_of_fame'
      })

    console.log(`Hall of Fame entry added for member ${member?.full_name}`)

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Hall of Fame entry added successfully`,
        entry
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error adding hall of fame entry:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})

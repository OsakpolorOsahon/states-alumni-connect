
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const BADGE_DEFINITIONS = {
  'FOUNDING_MEMBER': { name: 'Founding Member', description: 'One of the founding members of SMMOWCUB' },
  'LEADERSHIP': { name: 'Leadership Excellence', description: 'Demonstrated exceptional leadership skills' },
  'SERVICE': { name: 'Community Service', description: 'Outstanding contribution to community service' },
  'MENTORSHIP': { name: 'Mentor of the Year', description: 'Exceptional mentoring of junior members' },
  'INNOVATION': { name: 'Innovation Award', description: 'Outstanding innovation and creativity' },
  'DEDICATION': { name: 'Dedication Award', description: 'Unwavering dedication to SMMOWCUB values' }
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

    const { memberId, badgeCode, awardedBy } = await req.json()

    if (!memberId || !badgeCode) {
      return new Response(
        JSON.stringify({ error: 'Member ID and badge code are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const badgeInfo = BADGE_DEFINITIONS[badgeCode]
    if (!badgeInfo) {
      return new Response(
        JSON.stringify({ error: 'Invalid badge code' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Check if member already has this badge
    const { data: existingBadge } = await supabaseClient
      .from('badges')
      .select('id')
      .eq('member_id', memberId)
      .eq('badge_code', badgeCode)
      .single()

    if (existingBadge) {
      return new Response(
        JSON.stringify({ error: 'Member already has this badge' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Award the badge
    const { data: badge, error: badgeError } = await supabaseClient
      .from('badges')
      .insert({
        member_id: memberId,
        badge_code: badgeCode,
        badge_name: badgeInfo.name,
        description: badgeInfo.description,
        awarded_by: awardedBy
      })
      .select('*')
      .single()

    if (badgeError) {
      throw badgeError
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
        title: 'Badge Awarded!',
        message: `Congratulations! You've been awarded the "${badgeInfo.name}" badge for ${badgeInfo.description.toLowerCase()}.`,
        type: 'badge_awarded'
      })

    console.log(`Badge ${badgeInfo.name} awarded to member ${member?.full_name}`)

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Badge "${badgeInfo.name}" awarded successfully`,
        badge
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error awarding badge:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})

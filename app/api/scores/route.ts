import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

function getSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key);
}

export async function POST(request: NextRequest) {
  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return NextResponse.json({ error: 'Database not configured' }, { status: 503 });
  }

  try {
    const body = await request.json();
    const {
      walletAddress,
      score,
      highestTier,
      maxChain,
      ballsDropped,
      mergesPerformed,
      discoveries,
      durationSeconds,
    } = body;

    if (!walletAddress || typeof score !== 'number') {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
    }

    const address = walletAddress.toLowerCase();

    const { data: profile } = await supabase
      .from('profiles')
      .select('id')
      .eq('wallet_address', address)
      .single();

    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    const { data: run, error: runError } = await supabase
      .from('runs')
      .insert({
        profile_id: profile.id,
        score,
        highest_tier: highestTier || 0,
        max_chain: maxChain || 0,
        balls_dropped: ballsDropped || 0,
        merges_performed: mergesPerformed || 0,
        discoveries: discoveries || [],
        duration_seconds: durationSeconds || null,
      })
      .select()
      .single();

    if (runError) {
      console.error('Run insert error:', runError);
      return NextResponse.json({ error: 'Failed to save score' }, { status: 500 });
    }

    if (discoveries && discoveries.length > 0) {
      const discoveryRecords = discoveries.map((tier: number) => ({
        profile_id: profile.id,
        run_id: run.id,
        tier,
        wallet_address: address,
      }));

      await supabase.from('discoveries').insert(discoveryRecords);
    }

    return NextResponse.json({ run });
  } catch (err) {
    console.error('Score submit error:', err);
    return NextResponse.json({ error: 'Failed to save' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return NextResponse.json({ leaderboard: [] });
  }

  const { searchParams } = new URL(request.url);
  const period = searchParams.get('period') || 'all_time';
  const limit = Math.min(parseInt(searchParams.get('limit') || '50'), 100);

  let query = supabase
    .from('runs')
    .select(`
      id,
      score,
      highest_tier,
      max_chain,
      created_at,
      profiles (
        wallet_address,
        display_name
      )
    `)
    .order('score', { ascending: false })
    .limit(limit);

  if (period === 'daily') {
    const dayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    query = query.gte('created_at', dayAgo);
  } else if (period === 'weekly') {
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
    query = query.gte('created_at', weekAgo);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Leaderboard fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 });
  }

  return NextResponse.json({ leaderboard: data });
}

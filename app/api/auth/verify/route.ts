import { NextRequest, NextResponse } from 'next/server';
import { SiweMessage } from 'siwe';
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
    const { message, signature } = await request.json();

    const siweMessage = new SiweMessage(message);
    const { success, data } = await siweMessage.verify({ signature });

    if (!success || !data) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }

    const walletAddress = data.address.toLowerCase();

    const { data: profile, error } = await supabase
      .from('profiles')
      .upsert(
        {
          wallet_address: walletAddress,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'wallet_address' },
      )
      .select()
      .single();

    if (error) {
      console.error('Profile upsert error:', error);
      return NextResponse.json({ error: 'Failed to create profile' }, { status: 500 });
    }

    return NextResponse.json({
      address: walletAddress,
      profile,
    });
  } catch (err) {
    console.error('Auth verify error:', err);
    return NextResponse.json({ error: 'Verification failed' }, { status: 500 });
  }
}

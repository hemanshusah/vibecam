// ============================================
// VibeCam V2 — Poll Render Status API
// ============================================

import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const { id } = params;

    const { data, error } = await supabase
      .from('renders')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) {
      return NextResponse.json(
        { error: 'Render not found' },
        { status: 404 },
      );
    }

    console.log(`[API] Sending status for ${id}: ${data.status} (${data.progress}%)`);

    return NextResponse.json({
      status: data.status,
      progress: data.progress,
      outputUrl: data.output_url,
      error: data.error,
    });
  } catch (err) {
    console.error('Render status error:', err);
    return NextResponse.json(
      { error: 'Failed to fetch render status' },
      { status: 500 },
    );
  }
}

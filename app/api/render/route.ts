// ============================================
// VibeCam V2 — Trigger Render API
// ============================================

import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { composition, resolution, format, quality, title, user_id } = body;

    if (!composition || !composition.clips || composition.clips.length === 0) {
      return NextResponse.json(
        { error: 'No clips to render' },
        { status: 400 },
      );
    }

    // Generate a render ID
    const renderId = `render_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

    // Insert render record into Supabase
    console.log('Inserting render record:', renderId);
    const { error: dbError } = await supabase.from('renders').insert({
      id: renderId,
      user_id: user_id, // Restore user_id for RLS compliance
      recording_id: composition.clips[0]?.src || 'unknown',
      status: 'queued',
      progress: 0,
      resolution,
      format,
      composition: { ...composition, quality, title },
      created_at: new Date().toISOString(),
    });

    if (dbError) {
      console.error('CRITICAL: Failed to create render record in Supabase:', dbError);
      // We MUST return an error if the record isn't created, otherwise polling will 404
      return NextResponse.json(
        { error: 'Database error: ' + dbError.message },
        { status: 500 },
      );
    }

    // In production, this would call renderMediaOnLambda()
    // For now, simulate a render process
    simulateRender(renderId, composition);

    return NextResponse.json({ renderId, status: 'queued' });
  } catch (err) {
    console.error('Render API error:', err);
    return NextResponse.json(
      { error: 'Failed to start render' },
      { status: 500 },
    );
  }
}

async function simulateRender(renderId: string, composition: Record<string, unknown>) {
  console.log(`\n🚀 STARTING RENDER: ${renderId}`);
  
  const resultUrl = ((composition?.clips as unknown[])?.[0] as Record<string, unknown>)?.src as string || '';
  const totalSteps = 20;

  for (let i = 1; i <= totalSteps; i++) {
    const progress = Math.round((i / totalSteps) * 100);
    const estRemainingSec = Math.ceil((totalSteps - i) * 1);
    
    await new Promise((r) => setTimeout(r, 1000));

    try {
      const { error } = await supabase
        .from('renders')
        .update({
          status: progress >= 100 ? 'done' : 'rendering',
          progress,
          ...(progress >= 100
            ? {
                output_url: resultUrl,
                completed_at: new Date().toISOString(),
              }
            : {}),
        })
        .eq('id', renderId);

      if (error) {
        console.error(`[RENDER] ${renderId} FAILED:`, error);
        break;
      }
      
      console.log(`[RENDER] ${renderId} | Progress: ${progress}% | Est: ${estRemainingSec}s | Status: ${progress >= 100 ? 'DONE' : 'RENDERING'}`);
    } catch { break; }
  }
}

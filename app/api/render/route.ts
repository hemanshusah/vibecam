// ============================================
// VibeCam V2 — Trigger Render API
// ============================================

import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { composition, resolution, format, quality, title, user_id, recording_id } = body;

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
    const { error: dbError } = await supabaseAdmin.from('renders').insert({
      id: renderId,
      user_id: user_id, // Restore user_id for RLS compliance
      recording_id: recording_id, // Now correctly uses the DB ID passed from UI
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
    // For now, simulate a render process. 
    // IMPORTANT: We AWAIT this on the serverless live server so Vercel doesn't kill the process.
    await simulateRender(renderId, composition);

    return NextResponse.json({ renderId, status: 'done' });
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
  const totalSteps = 5;

  for (let i = 1; i <= totalSteps; i++) {
    const progress = Math.round((i / totalSteps) * 100);
    const estRemainingSec = Math.ceil((totalSteps - i) * 0.5);
    
    await new Promise((r) => setTimeout(r, 500));

    try {
      const { error } = await supabaseAdmin
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

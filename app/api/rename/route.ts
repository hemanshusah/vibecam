import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

export async function POST(request: NextRequest) {
  try {
    const { id, title, type } = await request.json();
    const table = type === 'render' ? 'renders' : 'videos';

    if (!id || !title) {
      return NextResponse.json({ error: 'Missing ID or title' }, { status: 400 });
    }

    let updateData: { title?: string; composition?: Record<string, unknown> } = { title };
    
    // Renders table stores title inside the composition JSON
    if (type === 'render') {
      const { data: current } = await supabaseAdmin.from('renders').select('composition').eq('id', id).single();
      if (current) {
        updateData = { 
          composition: { 
            ...(current.composition as Record<string, unknown>), 
            title 
          } 
        };
      }
    }

    const { error } = await supabaseAdmin
      .from(table)
      .update(updateData)
      .eq('id', id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error('Rename API error:', message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

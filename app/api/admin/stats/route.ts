import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(request: Request) {
  try {
    // 1. Verify Admin Status (via Token)
    const authHeader = request.headers.get("Authorization");
    if (!authHeader) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);
    
    if (authError || !user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // Check role in profiles
    const { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (!profile || profile.role !== 'admin') {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // 2. Fetch Aggregated Stats
    const { count: totalUsers } = await supabaseAdmin.from('profiles').select('*', { count: 'exact', head: true });
    const { count: totalVideos } = await supabaseAdmin.from('videos').select('*', { count: 'exact', head: true });
    const { count: totalRenders } = await supabaseAdmin.from('renders').select('*', { count: 'exact', head: true });

    // 3. Fetch User List with Individual Stats
    const { data: users, error: usersError } = await supabaseAdmin
      .from('profiles')
      .select(`
        id,
        email,
        role,
        created_at,
        videos:videos(count),
        renders:renders(count)
      `)
      .order('created_at', { ascending: false });

    if (usersError) throw usersError;

    interface ProfileWithUsage {
      id: string;
      email: string;
      role: string;
      created_at: string;
      videos: { count: number }[];
      renders: { count: number }[];
    }

    // Format usage data
    const formattedUsers = (users as unknown as ProfileWithUsage[]).map((u) => ({
      ...u,
      videoCount: u.videos[0]?.count || 0,
      renderCount: u.renders[0]?.count || 0,
      // For storage, we'll estimate based on vids (average 10MB per vid/render for rough tracking)
      estStorageMB: ( (u.videos[0]?.count || 0) + (u.renders[0]?.count || 0) ) * 10 
    }));

    return NextResponse.json({
      stats: {
        totalUsers: totalUsers || 0,
        totalVideos: totalVideos || 0,
        totalRenders: totalRenders || 0,
        totalEstStorageMB: ((totalVideos || 0) + (totalRenders || 0)) * 10
      },
      users: formattedUsers
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "An unknown error occurred";
    console.error("Admin Stats Error:", error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import crypto from "crypto";

export const dynamic = "force-dynamic";

// Supabase Admin client (Using Service Role Key)
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!, // MUST ADD TO .ENV
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

export async function POST(request: Request) {
  try {
    const { email, uid } = await request.json();

    // 1. Generate a 'Ghost Password' based on Firebase UID + Server Secret
    // This allows us to sign the user into Supabase without them ever knowing a Supabase password.
    const ghostPepper = process.env.GHOST_PEPPER || "vibe-cam-secret-pepper-2025";
    const ghostPassword = crypto
      .createHmac("sha256", ghostPepper)
      .update(uid)
      .digest("hex");

    // 2. Check if user exists in Supabase Auth
    const { data: existingUser } = await supabaseAdmin.auth.admin.listUsers();
    const userMatches = existingUser.users.find(u => u.email === email);

    if (!userMatches) {
      // Create user if they don't exist
      const { error: createError } = await supabaseAdmin.auth.admin.createUser({
        email,
        password: ghostPassword,
        email_confirm: true, // Bypass verification since Firebase already did it
        user_metadata: { firebase_uid: uid }
      });

      if (createError) throw createError;
    } else {
      // Update password if user exists to ensure sync
      const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
        userMatches.id,
        { password: ghostPassword, email_confirm: true }
      );
      if (updateError) throw updateError;
    }

    // 3. Generate a Supabase session using the login credentials
    // Note: The client will call signInWithPassword using this same Ghost Password
    return NextResponse.json({ 
      success: true, 
      ghostPassword 
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Sync API Error:", error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

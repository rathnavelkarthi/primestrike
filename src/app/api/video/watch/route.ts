import { NextResponse } from "next/server";
import { supabaseAdmin, VIDEO_BUCKET } from "@/lib/supabaseAdmin";

export const dynamic = "force-dynamic";
export const revalidate = 0;

// GET /api/video/watch?token=...
// Validates the one-time token, consumes it atomically, signs a short-lived
// URL, stores it in an httpOnly cookie, and redirects to the /watch player.
// The cookie lets the same browser refresh / resume without a fresh token,
// while a second device gets nothing (token already used).
export async function GET(request: Request) {
  const url = new URL(request.url);
  const token = url.searchParams.get("token");
  const origin = url.origin;

  if (!token) {
    return NextResponse.redirect(`${origin}/watch?error=missing`);
  }

  // Load grant.
  const { data: grant, error } = await supabaseAdmin
    .from("video_grants")
    .select("token, video_path, used, expires_at")
    .eq("token", token)
    .single();

  if (error || !grant) {
    return NextResponse.redirect(`${origin}/watch?error=invalid`);
  }

  if (new Date(grant.expires_at).getTime() < Date.now()) {
    return NextResponse.redirect(`${origin}/watch?error=expired`);
  }

  if (grant.used) {
    return NextResponse.redirect(`${origin}/watch?error=used`);
  }

  // Atomically consume: only flip to used if still unused. Guards against
  // double-open races (two tabs opened together).
  const { data: consumed, error: consumeErr } = await supabaseAdmin
    .from("video_grants")
    .update({ used: true, used_at: new Date().toISOString() })
    .eq("token", token)
    .eq("used", false)
    .select("token")
    .single();

  if (consumeErr || !consumed) {
    return NextResponse.redirect(`${origin}/watch?error=used`);
  }

  // Sign a short-lived URL (10 min) for the private object.
  const { data: signed, error: signErr } = await supabaseAdmin.storage
    .from(VIDEO_BUCKET)
    .createSignedUrl(grant.video_path, 600);

  if (signErr || !signed?.signedUrl) {
    console.error("createSignedUrl failed:", signErr);
    return NextResponse.redirect(`${origin}/watch?error=sign`);
  }

  const res = NextResponse.redirect(`${origin}/watch`);
  // httpOnly so client JS can't read/copy the signed URL. Session cookie,
  // short max-age so a screenshot of devtools won't outlive playback.
  res.cookies.set("vid_src", signed.signedUrl, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 600,
  });
  return res;
}

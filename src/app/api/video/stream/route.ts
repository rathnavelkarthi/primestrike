import { cookies } from "next/headers";

export const dynamic = "force-dynamic";
export const revalidate = 0;

// GET /api/video/stream
// Reads the httpOnly signed URL from the cookie and proxies the bytes.
// The signed Supabase URL is never exposed to client JS or the DOM.
// Forwards Range headers so the <video> element can seek.
export async function GET(request: Request) {
  const cookieStore = await cookies();
  const signedUrl = cookieStore.get("vid_src")?.value;

  if (!signedUrl) {
    return new Response("No active video session.", { status: 403 });
  }

  const range = request.headers.get("range") || undefined;
  const upstream = await fetch(signedUrl, {
    headers: range ? { Range: range } : {},
  });

  if (!upstream.ok && upstream.status !== 206) {
    return new Response("Video unavailable.", { status: 502 });
  }

  const headers = new Headers();
  const passthrough = [
    "content-type",
    "content-length",
    "content-range",
    "accept-ranges",
    "cache-control",
  ];
  for (const h of passthrough) {
    const v = upstream.headers.get(h);
    if (v) headers.set(h, v);
  }
  if (!headers.has("content-type")) headers.set("content-type", "video/mp4");
  if (!headers.has("cache-control")) headers.set("cache-control", "no-store");
  // Discourage download tooling from treating it as a file.
  headers.set("content-disposition", "inline");

  return new Response(upstream.body, {
    status: upstream.status,
    headers,
  });
}

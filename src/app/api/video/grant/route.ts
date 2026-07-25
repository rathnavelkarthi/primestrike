import { NextResponse } from "next/server";
import { randomBytes } from "crypto";
import nodemailer from "nodemailer";
import { supabaseAdmin, VIDEO_BUCKET } from "@/lib/supabaseAdmin";

export const dynamic = "force-dynamic";
export const revalidate = 0;

// POST /api/video/grant
// body: { email, videoPath, expiresInHours?, adminSecret }
// Creates a one-time watch grant and emails the unique link to the user.
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, videoPath, expiresInHours, adminSecret } = body;

    // Simple gate so random visitors can't mint grants.
    if (!process.env.VIDEO_ADMIN_SECRET || adminSecret !== process.env.VIDEO_ADMIN_SECRET) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    if (!email || !videoPath) {
      return NextResponse.json(
        { error: "email and videoPath are required." },
        { status: 400 }
      );
    }

    // Verify the object actually exists in the bucket before granting.
    const lastSlash = videoPath.lastIndexOf("/");
    const dir = lastSlash === -1 ? "" : videoPath.slice(0, lastSlash);
    const fileName = lastSlash === -1 ? videoPath : videoPath.slice(lastSlash + 1);
    const { data: listed, error: listErr } = await supabaseAdmin.storage
      .from(VIDEO_BUCKET)
      .list(dir, { search: fileName });
    if (listErr || !listed?.some((f) => f.name === fileName)) {
      return NextResponse.json(
        { error: `Video not found in bucket "${VIDEO_BUCKET}": ${videoPath}` },
        { status: 404 }
      );
    }

    const token = randomBytes(32).toString("hex");
    const hours = Number(expiresInHours) > 0 ? Number(expiresInHours) : 72;
    const expiresAt = new Date(Date.now() + hours * 3600 * 1000).toISOString();

    const { error: dbError } = await supabaseAdmin.from("video_grants").insert([
      {
        token,
        video_path: videoPath,
        email,
        used: false,
        expires_at: expiresAt,
      },
    ]);

    if (dbError) {
      console.error("video_grants insert failed:", dbError);
      return NextResponse.json(
        { error: "Failed to create grant." },
        { status: 500 }
      );
    }

    const origin = new URL(request.url).origin;
    const watchUrl = `${origin}/api/video/watch?token=${token}`;

    // Fire-and-forget email (matches existing leads route pattern).
    sendVideoLinkEmail({ toEmail: email, watchUrl, expiresInHours: hours }).catch(
      (err) => console.error("Video link email failed:", err)
    );

    return NextResponse.json({ success: true, watchUrl }, { status: 200 });
  } catch (error) {
    console.error("POST /api/video/grant error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

async function sendVideoLinkEmail(opts: {
  toEmail: string;
  watchUrl: string;
  expiresInHours: number;
}) {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.hostinger.com",
    port: parseInt(process.env.SMTP_PORT || "465"),
    secure: parseInt(process.env.SMTP_PORT || "465") === 465,
    auth: {
      user: process.env.SMTP_USER || "contact@primestrike.co.in",
      pass: process.env.SMTP_PASS || "",
    },
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 15000,
  });

  const smtpUser = process.env.SMTP_USER || "contact@primestrike.co.in";

  await transporter.sendMail({
    from: `"Prime Strike Trading Academy" <${smtpUser}>`,
    to: opts.toEmail,
    subject: "Your private video access link",
    html: `
      <div style="font-family:Helvetica,Arial,sans-serif;background:#000;color:#fff;padding:32px;">
        <div style="max-width:560px;margin:0 auto;background:#0a0a0a;border:1px solid #1a1a1a;border-radius:12px;padding:32px;">
          <h2 style="color:#fff;margin-top:0;">Your private video is ready</h2>
          <p style="color:#ccc;line-height:1.6;">
            Click below to watch. This link is <strong style="color:#d4af37;">personal to you</strong>
            and can be opened <strong style="color:#d4af37;">only once</strong>. It expires in ${opts.expiresInHours} hours.
          </p>
          <p style="text-align:center;margin:28px 0;">
            <a href="${opts.watchUrl}"
               style="display:inline-block;background:#d4af37;color:#000;font-weight:bold;
                      text-decoration:none;padding:14px 34px;border-radius:60px;">
              Watch Video
            </a>
          </p>
          <p style="color:#888;font-size:12px;">
            Do not share this link. Once opened, it will not work again.
          </p>
        </div>
      </div>
    `,
  });
}

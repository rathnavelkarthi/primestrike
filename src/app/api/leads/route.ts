import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";
import nodemailer from "nodemailer";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, phone, experience, goal, capital, notes } = body;

    if (!name || !email || !phone || !experience) {
      return NextResponse.json(
        { error: "Name, email, phone, and experience are required." },
        { status: 400 }
      );
    }

    // 1. Insert into Supabase Leads table
    const { error: dbError } = await supabase
      .from("leads")
      .insert([
        {
          name,
          email,
          phone,
          experience,
          goal: goal || "",
          capital: capital || "",
          notes: notes || "",
          status: "new",
        },
      ]);

    if (dbError) {
      console.error("Database error inserting lead:", dbError);
      return NextResponse.json(
        { error: "Failed to store assessment details." },
        { status: 500 }
      );
    }

    // 2. Setup nodemailer transporter (Hostinger SMTP)
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || "smtp.hostinger.com",
      port: parseInt(process.env.SMTP_PORT || "465"),
      secure: true, // true for port 465
      auth: {
        user: process.env.SMTP_USER || "contact@primestrike.co.in",
        pass: process.env.SMTP_PASS || "Lmas@123",
      },
    });

    const portalUrl = `${new URL(request.url).origin}`;
    
    // 3. Email Template (Black-Gold Theme)
    const mailOptions = {
      from: `"Prime Strike Trading Academy" <${process.env.SMTP_USER || "contact@primestrike.co.in"}>`,
      to: email,
      subject: "Welcome to Prime Strike — Trading Assessment Received",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #000000; color: #ffffff; margin: 0; padding: 0; }
            .container { max-width: 600px; margin: 0 auto; background-color: #0a0a0a; border: 1px solid #1a1a1a; border-radius: 12px; overflow: hidden; margin-top: 40px; margin-bottom: 40px; }
            .header { background-color: #000000; text-align: center; padding: 30px 20px; border-bottom: 1px solid #1c1c1c; }
            .header h1 { color: #ffffff; font-size: 26px; font-weight: 700; margin: 0; letter-spacing: -0.5px; }
            .header h1 span { color: #d4af37; } /* Gold accent */
            .content { padding: 40px 30px; line-height: 1.6; color: #cccccc; }
            .content h2 { color: #ffffff; font-size: 20px; font-weight: 600; margin-top: 0; }
            .badge { display: inline-block; background-color: rgba(212, 175, 55, 0.1); border: 1px solid rgba(212, 175, 55, 0.3); color: #d4af37; font-size: 11px; font-weight: 600; text-transform: uppercase; padding: 4px 10px; border-radius: 4px; margin-bottom: 15px; }
            .highlight { color: #d4af37; font-weight: 600; }
            .cta-box { background-color: #121212; border: 1px solid #1c1c1c; border-radius: 8px; padding: 25px; margin: 25px 0; text-align: center; }
            .button { display: inline-block; background-color: #d4af37; color: #000000; text-decoration: none; font-weight: bold; font-size: 14px; padding: 12px 30px; border-radius: 60px; margin-top: 10px; transition: background-color 0.2s; }
            .social-links { text-align: center; margin-top: 20px; }
            .social-btn { display: inline-block; border: 1px solid #1c1c1c; border-radius: 6px; padding: 8px 15px; text-decoration: none; font-size: 12px; color: #ffffff; background-color: #161616; margin: 0 5px; }
            .footer { background-color: #000000; text-align: center; padding: 20px; font-size: 12px; color: #555555; border-top: 1px solid #1a1a1a; }
            .footer a { color: #d4af37; text-decoration: none; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Prime<span>Strike</span></h1>
            </div>
            
            <div class="content">
              <h2>Thank you for your submission, ${name}!</h2>
              <div class="badge">Assessment Received</div>
              <p>
                We have received your trading profile details. Our founder, <span class="highlight">Saranya</span>, and our team will review your objectives and contact you shortly at <span class="highlight">${phone}</span> (via call or WhatsApp) to help you get started on your options trading journey.
              </p>
              
              <div class="cta-box">
                <p style="margin-top:0; color:#ffffff; font-weight:600;">Ready to explore our webinars and calendar?</p>
                <p style="font-size:13px; color:#888888; margin-bottom:15px;">Create a student account on our website to access upcoming webinar listings, recorded resources, and tools.</p>
                <a href="${portalUrl}/signup" class="button">Create Student Account</a>
              </div>
              
              <h3 style="color:#ffffff; font-size:15px; font-weight:600; margin-top:30px; margin-bottom:10px;">Connect With Us:</h3>
              <p style="font-size:13px; margin-top:0;">Follow us to receive daily charts, analysis, and trade setup alerts:</p>
              <div class="social-links">
                <a href="https://www.instagram.com/prime__strike?igsh=MTBvZTkzdzFjNXA2cw%3D%3D&utm_source=qr" class="social-btn">📸 Instagram</a>
                <a href="https://t.me/prime_strik" class="social-btn">✈️ Telegram Channel</a>
              </div>
            </div>
            
            <div class="footer">
              <p>&copy; ${new Date().getFullYear()} Prime Strike Academy. All Rights Reserved.</p>
              <p>Email: <a href="mailto:contact@primestrike.co.in">contact@primestrike.co.in</a> | Phone: +91 95002 98631</p>
            </div>
          </div>
        </body>
        </html>
      `,
    };

    // 4. Send the email
    try {
      await transporter.sendMail(mailOptions);
    } catch (mailError) {
      console.error("Mailer error sending lead confirmation:", mailError);
    }

    return NextResponse.json({ success: true }, { status: 200 });

  } catch (error: any) {
    console.error("Server API error in POST /api/leads:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

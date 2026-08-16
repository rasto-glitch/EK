import { NextResponse } from "next/server";
import { Resend } from "resend";

const CONTACT_TO = process.env.CONTACT_TO || "contact@elkurdi.co";
// Resend only requires the SENDER domain to be verified. elkurdi.co is not on
// the Resend account (plan limit — scholify.krd occupies the free slot), so we
// send from scholify.krd; contact@elkurdi.co receives via Cloudflare Email
// Routing → Gmail forward.
const CONTACT_FROM = process.env.CONTACT_FROM || "EK Website <noreply@scholify.krd>";

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  const name = typeof body.name === "string" ? body.name.trim().slice(0, 100) : "";
  const email = typeof body.email === "string" ? body.email.trim().slice(0, 200) : "";
  const projectType =
    typeof body.projectType === "string" ? body.projectType.trim().slice(0, 50) : "";
  const message =
    typeof body.message === "string" ? body.message.trim().slice(0, 5000) : "";
  const honeypot = typeof body.company === "string" ? body.company.trim() : "";

  // Bots fill the hidden field; pretend it worked and drop it.
  if (honeypot) {
    return NextResponse.json({ ok: true });
  }

  if (!name || !message || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json(
      { ok: false, error: "Please fill in your name, a valid email, and a message." },
      { status: 400 }
    );
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("contact form: RESEND_API_KEY is not set — cannot deliver message");
    return NextResponse.json(
      { ok: false, error: `Sending is temporarily unavailable — please email ${CONTACT_TO} directly.` },
      { status: 503 }
    );
  }

  const html = `
    <h2>New project inquiry — EK website</h2>
    <p><strong>Name:</strong> ${escapeHtml(name)}</p>
    <p><strong>Email:</strong> ${escapeHtml(email)}</p>
    <p><strong>Project type:</strong> ${escapeHtml(projectType || "Not specified")}</p>
    <p><strong>Message:</strong></p>
    <p style="white-space:pre-wrap">${escapeHtml(message)}</p>
  `;

  try {
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from: CONTACT_FROM,
      to: [CONTACT_TO],
      replyTo: email,
      subject: `EK inquiry from ${name} — ${projectType || "General"}`,
      html,
      text: `New project inquiry\n\nName: ${name}\nEmail: ${email}\nProject type: ${projectType || "Not specified"}\n\n${message}`,
    });
    if (error) {
      console.error("contact form: Resend error", error);
      return NextResponse.json(
        { ok: false, error: `Could not send your message — please email ${CONTACT_TO} directly.` },
        { status: 502 }
      );
    }
  } catch (err) {
    console.error("contact form: send failed", err);
    return NextResponse.json(
      { ok: false, error: `Could not send your message — please email ${CONTACT_TO} directly.` },
      { status: 502 }
    );
  }

  return NextResponse.json({ ok: true });
}

import { NextResponse } from "next/server";

// Delivery is handled by a Cloudflare Worker (cloudflare/contact-worker) that
// uses Email Routing's send-email binding to deliver to the verified Gmail
// destination address. No Resend involved. This route just validates and
// forwards server-to-server, so the Worker URL never reaches the browser.
const CONTACT_TO = "contact@elkurdi.co";

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

  const workerUrl = process.env.CONTACT_WORKER_URL;
  if (!workerUrl) {
    console.error("contact form: CONTACT_WORKER_URL is not set — cannot deliver message");
    return NextResponse.json(
      { ok: false, error: `Sending is temporarily unavailable — please email ${CONTACT_TO} directly.` },
      { status: 503 }
    );
  }

  try {
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (process.env.CONTACT_WORKER_SECRET) {
      headers["x-contact-secret"] = process.env.CONTACT_WORKER_SECRET;
    }
    const res = await fetch(workerUrl, {
      method: "POST",
      headers,
      body: JSON.stringify({ name, email, projectType, message }),
    });
    if (!res.ok) {
      const detail = await res.text().catch(() => "");
      console.error("contact form: worker responded", res.status, detail);
      return NextResponse.json(
        { ok: false, error: `Could not send your message — please email ${CONTACT_TO} directly.` },
        { status: 502 }
      );
    }
  } catch (err) {
    console.error("contact form: worker fetch failed", err);
    return NextResponse.json(
      { ok: false, error: `Could not send your message — please email ${CONTACT_TO} directly.` },
      { status: 502 }
    );
  }

  return NextResponse.json({ ok: true });
}

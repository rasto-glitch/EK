import { EmailMessage } from "cloudflare:email";
import { createMimeMessage, Mailbox } from "mimetext";

function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

export default {
  async fetch(request, env) {
    if (request.method !== "POST") {
      return json({ ok: false, error: "Method not allowed." }, 405);
    }

    if (env.CONTACT_SECRET) {
      const provided = request.headers.get("x-contact-secret") || "";
      if (provided !== env.CONTACT_SECRET) {
        return json({ ok: false, error: "Unauthorized." }, 401);
      }
    }

    let body;
    try {
      body = await request.json();
    } catch {
      return json({ ok: false, error: "Invalid request." }, 400);
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
      return json({ ok: true });
    }

    if (!name || !message || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return json(
        { ok: false, error: "Please fill in your name, a valid email, and a message." },
        400
      );
    }

    const msg = createMimeMessage();
    msg.setSender({ name: "EK Website", addr: env.CONTACT_FROM });
    msg.setRecipient(env.CONTACT_TO);
    msg.setHeader("Reply-To", new Mailbox(email));
    msg.setSubject(`EK inquiry from ${name} — ${projectType || "General"}`);
    msg.addMessage({
      contentType: "text/plain",
      data: [
        "New project inquiry — EK website",
        "",
        `Name: ${name}`,
        `Email: ${email}`,
        `Project type: ${projectType || "Not specified"}`,
        "",
        message,
      ].join("\n"),
    });

    try {
      await env.CONTACT_EMAIL.send(
        new EmailMessage(env.CONTACT_FROM, env.CONTACT_TO, msg.asRaw())
      );
    } catch (err) {
      console.error("send failed:", err && err.message);
      return json({ ok: false, error: "Could not send your message." }, 502);
    }

    return json({ ok: true });
  },
};

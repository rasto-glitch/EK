"use client";

import { useState } from "react";

type Status = "idle" | "sending" | "sent" | "error";

const inputClass =
  "w-full rounded-lg border border-line bg-ink px-4 py-3 text-sm text-snow placeholder:text-mist/60 outline-none transition focus:border-accent";

export default function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());

    setStatus("sending");
    setErrorMsg("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok || !json.ok) {
        throw new Error(json.error || "Something went wrong. Please try again.");
      }
      setStatus("sent");
      form.reset();
    } catch (err) {
      setStatus("error");
      setErrorMsg(
        err instanceof Error ? err.message : "Something went wrong. Please try again."
      );
    }
  }

  if (status === "sent") {
    return (
      <div className="grid place-items-center rounded-2xl border border-line bg-ink p-10 text-center">
        <div className="mb-4 grid h-12 w-12 place-items-center rounded-full bg-accent/10 text-accent">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-6 w-6">
            <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold">Message sent</h3>
        <p className="mt-2 max-w-sm text-sm text-mist">
          Thanks for reaching out — we&apos;ll get back to you at the email you
          provided, usually within one business day.
        </p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="mt-6 text-sm font-medium text-accent hover:underline"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-line bg-ink p-6 sm:p-8"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-1">
          <label htmlFor="name" className="mb-1.5 block text-sm font-medium">
            Name
          </label>
          <input
            id="name"
            name="name"
            required
            maxLength={100}
            placeholder="Your name"
            className={inputClass}
          />
        </div>
        <div className="sm:col-span-1">
          <label htmlFor="email" className="mb-1.5 block text-sm font-medium">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            maxLength={200}
            placeholder="you@example.com"
            className={inputClass}
          />
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="projectType" className="mb-1.5 block text-sm font-medium">
            What do you need?
          </label>
          <select id="projectType" name="projectType" className={inputClass} defaultValue="Web app">
            <option>Web app</option>
            <option>Mobile app</option>
            <option>Web + mobile</option>
            <option>Something else</option>
          </select>
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="message" className="mb-1.5 block text-sm font-medium">
            Project details
          </label>
          <textarea
            id="message"
            name="message"
            required
            rows={5}
            maxLength={5000}
            placeholder="Describe your idea, who it's for, and any timeline you have in mind…"
            className={inputClass}
          />
        </div>
        {/* Honeypot — hidden from humans, bots fill it in */}
        <div className="hidden" aria-hidden="true">
          <label htmlFor="company">Company</label>
          <input id="company" name="company" tabIndex={-1} autoComplete="off" />
        </div>
      </div>

      {status === "error" && (
        <p className="mt-4 rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {errorMsg}
        </p>
      )}

      <button
        type="submit"
        disabled={status === "sending"}
        className="mt-6 w-full rounded-lg bg-accent px-6 py-3 font-semibold text-ink transition hover:bg-accent-deep disabled:cursor-not-allowed disabled:opacity-60"
      >
        {status === "sending" ? "Sending…" : "Send message"}
      </button>
    </form>
  );
}

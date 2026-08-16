import ContactForm from "./contact-form";
import EkMark from "./ek-mark";

const services = [
  {
    title: "Web applications",
    body: "Dashboards, portals, e-commerce, internal tools — modern, fast sites built with production-grade stacks and deployed to the edge.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-6 w-6">
        <rect x="3" y="4" width="18" height="14" rx="2" />
        <path d="M3 9h18M7 13l2 2-2 2M12 17h4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    title: "Mobile apps",
    body: "iOS and Android apps from a single codebase — push notifications, offline support, over-the-air updates, and store publishing handled for you.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-6 w-6">
        <rect x="7" y="2" width="10" height="20" rx="2.5" />
        <path d="M11 18.5h2" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    title: "APIs & backends",
    body: "Secure APIs, databases, authentication, payments, and integrations — the plumbing that keeps your product reliable as it grows.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-6 w-6">
        <ellipse cx="12" cy="5.5" rx="7" ry="2.8" />
        <path d="M5 5.5v6.3c0 1.5 3.1 2.8 7 2.8s7-1.3 7-2.8V5.5M5 11.8v6.3c0 1.5 3.1 2.8 7 2.8s7-1.3 7-2.8v-6.3" strokeLinecap="round" />
      </svg>
    ),
  },
];

const steps = [
  {
    n: "01",
    title: "Tell us the idea",
    body: "Send a short description of what you need — a product, a rebuild, or a feature. No spec required.",
  },
  {
    n: "02",
    title: "Get a clear plan",
    body: "We reply with a scoped proposal: what gets built, how long it takes, and what it costs. No surprises.",
  },
  {
    n: "03",
    title: "Launch",
    body: "We build, you review, we ship — then stay available for updates and support after release.",
  },
];

export default function Home() {
  return (
    <main>
      {/* Nav */}
      <header className="sticky top-0 z-20 border-b border-line/60 bg-ink/80 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
          <a href="#" className="flex items-center gap-3">
            <EkMark className="h-9 w-9 text-accent" />
            <span className="text-sm font-semibold tracking-widest text-snow uppercase">
              El Kurdi
            </span>
          </a>
          <nav className="flex items-center gap-6 text-sm text-mist">
            <a href="#services" className="hidden transition hover:text-snow sm:block">
              Services
            </a>
            <a href="#process" className="hidden transition hover:text-snow sm:block">
              Process
            </a>
            <a
              href="#contact"
              className="rounded-lg bg-accent px-4 py-2 font-medium text-ink transition hover:bg-accent-deep"
            >
              Start a project
            </a>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-40 left-1/2 h-[480px] w-[720px] -translate-x-1/2 rounded-full bg-accent/10 blur-3xl"
        />
        <EkMark className="pointer-events-none absolute top-1/2 -right-20 hidden h-96 w-96 -translate-y-1/2 text-accent/[0.06] lg:block" />
        <div className="mx-auto max-w-6xl px-5 pt-24 pb-20 text-center sm:pt-32 sm:pb-28">
          <p className="mb-5 inline-block rounded-full border border-line px-4 py-1.5 text-xs tracking-widest text-mist uppercase">
            Web &amp; mobile app development
          </p>
          <h1 className="mx-auto max-w-3xl text-4xl leading-tight font-bold sm:text-6xl">
            Have an app in mind?{" "}
            <span className="text-accent">We build it.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-mist">
            EK designs and builds custom web and mobile applications — for
            businesses, schools, shops, and startups. Bring us the idea; we
            handle everything from design to launch.
          </p>
          <div className="mt-10 flex items-center justify-center gap-4">
            <a
              href="#contact"
              className="rounded-lg bg-accent px-6 py-3 font-semibold text-ink transition hover:bg-accent-deep"
            >
              Request a project
            </a>
            <a
              href="#services"
              className="rounded-lg border border-line px-6 py-3 font-semibold text-snow transition hover:border-mist"
            >
              What we do
            </a>
          </div>
        </div>
      </section>

      {/* Services */}
      <section id="services" className="border-t border-line/60 bg-ink-soft/40">
        <div className="mx-auto max-w-6xl px-5 py-20">
          <h2 className="text-3xl font-bold">What we build</h2>
          <p className="mt-3 max-w-xl text-mist">
            Full products or single features — whatever your project needs.
          </p>
          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            {services.map((s) => (
              <div
                key={s.title}
                className="rounded-2xl border border-line bg-ink p-6 transition hover:border-accent/50"
              >
                <div className="mb-4 grid h-11 w-11 place-items-center rounded-lg bg-accent/10 text-accent">
                  {s.icon}
                </div>
                <h3 className="text-lg font-semibold">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-mist">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section id="process" className="border-t border-line/60">
        <div className="mx-auto max-w-6xl px-5 py-20">
          <h2 className="text-3xl font-bold">How it works</h2>
          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            {steps.map((s) => (
              <div key={s.n} className="rounded-2xl border border-line p-6">
                <span className="text-sm font-bold tracking-widest text-accent">
                  {s.n}
                </span>
                <h3 className="mt-3 text-lg font-semibold">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-mist">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="border-t border-line/60 bg-ink-soft/40">
        <div className="mx-auto max-w-6xl px-5 py-20">
          <div className="grid gap-12 lg:grid-cols-2">
            <div>
              <h2 className="text-3xl font-bold">Start a project</h2>
              <p className="mt-4 max-w-md leading-relaxed text-mist">
                Tell us what you want to build. We usually reply within one
                business day with next steps or a few questions.
              </p>
              <p className="mt-6 text-sm text-mist">
                Prefer email? Write to{" "}
                <a
                  href="mailto:contact@elkurdi.co"
                  className="font-medium text-accent hover:underline"
                >
                  contact@elkurdi.co
                </a>
              </p>
            </div>
            <ContactForm />
          </div>
        </div>
      </section>

      <footer className="border-t border-line/60">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-5 py-8 text-sm text-mist sm:flex-row">
          <p className="flex items-center gap-2">
            <EkMark className="h-5 w-5 text-mist" />© {new Date().getFullYear()} EK
            — El Kurdi. All rights reserved.
          </p>
          <a href="mailto:contact@elkurdi.co" className="hover:text-snow">
            contact@elkurdi.co
          </a>
        </div>
      </footer>
    </main>
  );
}

import Link from "next/link";
import { Section } from "@/components/Section";

export default function HomePage() {
  return (
    <main className="container">
      <div className="card" style={{ padding: 22 }}>
        <div className="badge">Event • Celebration • Vendors</div>
        <h1 className="h1">Find trusted vendors for your next celebration.</h1>
        <p className="muted" style={{ fontSize: 16, marginTop: 10, maxWidth: 760 }}>
          Browse decorators, cake suppliers, caterers, photographers, rentals, and more. Request quotes in minutes — compare packages and book with confidence.
        </p>

        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 16 }}>
          <Link className="btn primary" href="/browse">Browse vendors</Link>
          <Link className="btn" href="/vendors/onboard">List your business</Link>
        </div>

        <div className="kpis">
          <div className="kpi"><b>Categories</b><div className="muted">Decor • Cakes • Catering • Media • Rentals</div></div>
          <div className="kpi"><b>Quote-based</b><div className="muted">Best for custom events</div></div>
          <div className="kpi"><b>Vendor approvals</b><div className="muted">Quality control</div></div>
        </div>
      </div>

      <Section
        title="How it works"
        subtitle="Simple flow designed for real-world event pricing"
      >
        <div className="grid cols-3">
          <div className="card">
            <div className="h3">1) Browse</div>
            <div className="muted">Filter by event type, location, budget, halal, and lead time.</div>
          </div>
          <div className="card">
            <div className="h3">2) Request quote</div>
            <div className="muted">Send details like date, venue, pax, and budget range to vendors.</div>
          </div>
          <div className="card">
            <div className="h3">3) Compare & book</div>
            <div className="muted">Vendors reply with packages. Choose the best fit.</div>
          </div>
        </div>
      </Section>

      <Section
        title="Popular categories"
        subtitle="A default set you can change in the admin panel"
      >
        <div className="grid cols-3">
          {[
            { t: "Decorations", d: "Balloon arches, backdrops, florals, themed sets." },
            { t: "Cakes & Dessert", d: "Custom cakes, cupcakes, dessert tables." },
            { t: "Catering", d: "Buffet, bento, live stations, party platters." },
            { t: "Photo & Video", d: "Event coverage, videography, photobooths." },
            { t: "Rentals", d: "Chairs, tables, tents, sound, lighting." },
            { t: "Entertainment", d: "Emcee, live band, magician, kids activities." }
          ].map((x) => (
            <div key={x.t} className="card">
              <div style={{ fontWeight: 800 }}>{x.t}</div>
              <div className="muted" style={{ marginTop: 6 }}>{x.d}</div>
            </div>
          ))}
        </div>
      </Section>

      <hr className="hr" />
      <div className="muted">
        Tip: Start with inquiry/quote. Add Stripe checkout later only for standardized packages.
      </div>
    </main>
  );
}

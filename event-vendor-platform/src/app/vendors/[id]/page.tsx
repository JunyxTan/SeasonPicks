"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { Listing, VendorProfile } from "@/lib/types";
import { ListingCard } from "@/components/ListingCard";
import { Section } from "@/components/Section";

type Category = { id: string; name: string };
type Subcategory = { id: string; name: string };

export default function VendorPage() {
  const params = useParams<{ id: string }>();
  const vendorId = params.id;

  const [vendor, setVendor] = useState<VendorProfile | null>(null);
  const [listings, setListings] = useState<Listing[]>([]);
  const [category, setCategory] = useState<Category | null>(null);
  const [subcategory, setSubcategory] = useState<Subcategory | null>(null);
  const [loading, setLoading] = useState(true);

  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [eventType, setEventType] = useState("birthday");
  const [eventDate, setEventDate] = useState("");
  const [eventLocation, setEventLocation] = useState("");
  const [budgetMin, setBudgetMin] = useState("");
  const [budgetMax, setBudgetMax] = useState("");
  const [pax, setPax] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState<null | "ok" | "err">(null);

  useEffect(() => {
    async function load() {
      setLoading(true);

      const { data: v } = await supabase
        .from("vendor_profiles")
        .select("id,name,description,location,coverage_area,whatsapp,min_budget,lead_time_days,is_halal,tags,portfolio_urls,status,category_id,subcategory_id")
        .eq("id", vendorId)
        .single();

      const { data: l } = await supabase
        .from("listings")
        .select("id,vendor_id,type,title,description,price_type,price_value,images,includes,addons,is_active")
        .eq("vendor_id", vendorId)
        .eq("is_active", true)
        .order("title");

      setVendor((v ?? null) as any);
      setListings((l ?? []) as any);

      if (v?.category_id) {
        const { data } = await supabase.from("categories").select("id,name").eq("id", v.category_id).single();
        setCategory((data ?? null) as any);
      }
      if (v?.subcategory_id) {
        const { data } = await supabase.from("subcategories").select("id,name").eq("id", v.subcategory_id).single();
        setSubcategory((data ?? null) as any);
      }

      setLoading(false);
    }
    load();
  }, [vendorId]);

  const whatsappLink = useMemo(() => {
    if (!vendor?.whatsapp) return null;
    const cleaned = vendor.whatsapp.replace(/\s+/g, "");
    if (cleaned.startsWith("http")) return cleaned;
    if (cleaned.startsWith("+")) return `https://wa.me/${cleaned.replace("+", "")}`;
    if (/^\d+$/.test(cleaned)) return `https://wa.me/${cleaned}`;
    return null;
  }, [vendor?.whatsapp]);

  async function submitInquiry() {
    setSent(null);
    if (!customerName.trim() || !customerEmail.trim() || !message.trim()) {
      setSent("err");
      return;
    }

    const { error } = await supabase.from("inquiries").insert({
      vendor_id: vendorId,
      listing_id: null,
      event_type: eventType,
      event_date: eventDate || null,
      event_location: eventLocation || null,
      budget_min: budgetMin ? Number(budgetMin) : null,
      budget_max: budgetMax ? Number(budgetMax) : null,
      pax: pax ? Number(pax) : null,
      customer_name: customerName.trim(),
      customer_email: customerEmail.trim(),
      customer_phone: customerPhone.trim() || null,
      message: message.trim(),
      status: "new"
    });

    if (error) setSent("err");
    else {
      setCustomerName(""); setCustomerEmail(""); setCustomerPhone("");
      setEventType("birthday"); setEventDate(""); setEventLocation("");
      setBudgetMin(""); setBudgetMax(""); setPax(""); setMessage("");
      setSent("ok");
    }
  }

  if (loading) return <main className="container"><div className="muted">Loading…</div></main>;
  if (!vendor) return <main className="container"><div className="card">Vendor not found.</div></main>;

  return (
    <main className="container">
      <div className="card">
        <div className="badge">Vendor</div>
        <div style={{ display: "flex", gap: 14, alignItems: "center", flexWrap: "wrap" }}>
          <div style={{
            width: 64, height: 64, borderRadius: 18, background: "#0f0f12",
            display: "grid", placeItems: "center", border: "1px solid var(--border)", fontWeight: 900, fontSize: 22
          }}>
            {vendor.name.slice(0, 1).toUpperCase()}
          </div>
          <div style={{ flex: 1, minWidth: 240 }}>
            <h1 className="h1" style={{ fontSize: 30, margin: 0 }}>{vendor.name}</h1>
            <div className="muted" style={{ marginTop: 6 }}>
              {(subcategory?.name ?? category?.name ?? "Event Vendor")} • {vendor.location ?? "Location not set"}
              {vendor.coverage_area ? ` • ${vendor.coverage_area}` : ""}
            </div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 10 }}>
              {vendor.is_halal ? <span className="tag">Halal</span> : null}
              {vendor.min_budget != null ? <span className="tag">Min ${vendor.min_budget}</span> : null}
              {vendor.lead_time_days != null ? <span className="tag">{vendor.lead_time_days}d lead</span> : null}
            </div>
          </div>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            {whatsappLink ? <a className="btn" href={whatsappLink} target="_blank" rel="noreferrer">WhatsApp</a> : null}
            <Link className="btn" href="/browse">Back to browse</Link>
          </div>
        </div>

        <p className="muted" style={{ marginTop: 14, fontSize: 15 }}>
          {vendor.description ?? "No description yet."}
        </p>

        {vendor.tags?.length ? (
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {vendor.tags.map((t) => <span className="tag" key={t}>{t}</span>)}
          </div>
        ) : null}
      </div>

      <Section title="Packages & listings" subtitle="Standard packages are listed here. For custom requests, use the quote form.">
        {listings.length ? (
          <div className="grid cols-2">
            {listings.map((l) => <ListingCard key={l.id} listing={l} />)}
          </div>
        ) : (
          <div className="card">
            <div style={{ fontWeight: 800 }}>No listings yet</div>
            <div className="muted" style={{ marginTop: 6 }}>Send a quote request below for custom pricing.</div>
          </div>
        )}
      </Section>

      <Section title="Request a quote" subtitle="Send your event details — the vendor can reply with a package and price.">
        <div className="card">
          <div className="grid cols-2">
            <input className="input" value={customerName} onChange={(e) => setCustomerName(e.target.value)} placeholder="Your name *" />
            <input className="input" value={customerEmail} onChange={(e) => setCustomerEmail(e.target.value)} placeholder="Your email *" />
          </div>
          <div className="grid cols-2" style={{ marginTop: 10 }}>
            <input className="input" value={customerPhone} onChange={(e) => setCustomerPhone(e.target.value)} placeholder="Phone (optional)" />
            <select className="select" value={eventType} onChange={(e) => setEventType(e.target.value)}>
              <option value="birthday">Birthday</option>
              <option value="wedding">Wedding</option>
              <option value="corporate">Corporate</option>
              <option value="baby_shower">Baby shower</option>
              <option value="graduation">Graduation</option>
              <option value="festive">Festive (CNY/Raya/Christmas)</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="grid cols-2" style={{ marginTop: 10 }}>
            <input className="input" value={eventDate} onChange={(e) => setEventDate(e.target.value)} placeholder="Event date (YYYY-MM-DD)" />
            <input className="input" value={eventLocation} onChange={(e) => setEventLocation(e.target.value)} placeholder="Event location / venue" />
          </div>

          <div className="grid cols-3" style={{ marginTop: 10 }}>
            <input className="input" value={budgetMin} onChange={(e) => setBudgetMin(e.target.value)} placeholder="Budget min (optional)" inputMode="numeric" />
            <input className="input" value={budgetMax} onChange={(e) => setBudgetMax(e.target.value)} placeholder="Budget max (optional)" inputMode="numeric" />
            <input className="input" value={pax} onChange={(e) => setPax(e.target.value)} placeholder="Pax (optional)" inputMode="numeric" />
          </div>

          <textarea className="textarea" value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Tell the vendor what you need (theme, colors, venue size, timing, add-ons) *" style={{ marginTop: 10 }} />

          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 12 }}>
            <button className="btn primary" onClick={submitInquiry}>Send quote request</button>
            {sent === "ok" ? <span className="tag" style={{ borderColor: "rgba(45,212,191,.4)", color: "var(--good)" }}>Sent!</span> : null}
            {sent === "err" ? <span className="tag">Please fill required fields.</span> : null}
          </div>
        </div>
      </Section>
    </main>
  );
}

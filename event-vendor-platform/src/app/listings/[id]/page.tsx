"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { Listing, VendorProfile } from "@/lib/types";

function priceLabel(listing: Listing) {
  if (listing.price_type === "quote") return "Quote only";
  if (listing.price_value == null) return "—";
  if (listing.price_type === "from") return `From $${listing.price_value}`;
  return `$${listing.price_value}`;
}

export default function ListingPage() {
  const params = useParams<{ id: string }>();
  const listingId = params.id;

  const [listing, setListing] = useState<Listing | null>(null);
  const [vendor, setVendor] = useState<VendorProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState<null | "ok" | "err">(null);

  useEffect(() => {
    async function load() {
      setLoading(true);

      const { data: l } = await supabase
        .from("listings")
        .select("id,vendor_id,type,title,description,price_type,price_value,images,includes,addons,is_active")
        .eq("id", listingId)
        .single();

      if (l) {
        setListing(l as any);
        const { data: v } = await supabase
          .from("vendor_profiles")
          .select("id,name,description,location,coverage_area,whatsapp,min_budget,lead_time_days,is_halal,tags,portfolio_urls,status,category_id,subcategory_id")
          .eq("id", l.vendor_id)
          .single();
        setVendor((v ?? null) as any);
      }

      setLoading(false);
    }
    load();
  }, [listingId]);

  const includes = listing?.includes ?? [];
  const addons = listing?.addons ?? [];

  async function sendInquiry() {
    setSent(null);
    if (!listing || !vendor) return;
    if (!name.trim() || !email.trim() || !message.trim()) { setSent("err"); return; }

    const { error } = await supabase.from("inquiries").insert({
      vendor_id: vendor.id,
      listing_id: listing.id,
      event_type: "other",
      event_date: null,
      event_location: null,
      budget_min: null,
      budget_max: null,
      pax: null,
      customer_name: name.trim(),
      customer_email: email.trim(),
      customer_phone: null,
      message: message.trim(),
      status: "new"
    });

    if (error) setSent("err");
    else { setName(""); setEmail(""); setMessage(""); setSent("ok"); }
  }

  if (loading) return <main className="container"><div className="muted">Loading…</div></main>;
  if (!listing || !vendor) return <main className="container"><div className="card">Listing not found.</div></main>;

  return (
    <main className="container">
      <div className="card">
        <div className="badge">Listing</div>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
          <div>
            <h1 className="h1" style={{ fontSize: 30, margin: 0 }}>{listing.title}</h1>
            <div className="muted" style={{ marginTop: 8 }}>
              by <Link href={`/vendors/${vendor.id}`} style={{ textDecoration: "underline" }}>{vendor.name}</Link>
              {" • "}
              {listing.type === "service" ? "Service" : "Product"}
            </div>
          </div>
          <div style={{ fontWeight: 900, fontSize: 20, whiteSpace: "nowrap" }}>{priceLabel(listing)}</div>
        </div>

        <p className="muted" style={{ marginTop: 14, fontSize: 15 }}>
          {listing.description ?? "—"}
        </p>

        {(includes.length || addons.length) ? (
          <div className="grid cols-2" style={{ marginTop: 12 }}>
            <div className="card" style={{ background: "#0f0f12" }}>
              <div style={{ fontWeight: 800 }}>Includes</div>
              <ul className="muted">
                {(includes.length ? includes : ["—"]).map((x, i) => <li key={i}>{x}</li>)}
              </ul>
            </div>
            <div className="card" style={{ background: "#0f0f12" }}>
              <div style={{ fontWeight: 800 }}>Add-ons</div>
              <ul className="muted">
                {(addons.length ? addons : ["—"]).map((x, i) => <li key={i}>{x}</li>)}
              </ul>
            </div>
          </div>
        ) : null}

        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 14 }}>
          <Link className="btn" href={`/vendors/${vendor.id}`}>View vendor</Link>
          <Link className="btn" href="/browse">Browse more</Link>
        </div>
      </div>

      <div style={{ marginTop: 16 }} className="card">
        <div style={{ fontWeight: 900 }}>Ask about this package</div>
        <div className="muted" style={{ marginTop: 6 }}>Send a message to the vendor. They can confirm availability and details.</div>

        <div className="grid cols-2" style={{ marginTop: 12 }}>
          <input className="input" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name *" />
          <input className="input" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Your email *" />
        </div>
        <textarea className="textarea" value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Your message *" style={{ marginTop: 10 }} />
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 12 }}>
          <button className="btn primary" onClick={sendInquiry}>Send</button>
          {sent === "ok" ? <span className="tag" style={{ borderColor: "rgba(45,212,191,.4)", color: "var(--good)" }}>Sent!</span> : null}
          {sent === "err" ? <span className="tag">Please fill required fields.</span> : null}
        </div>
      </div>
    </main>
  );
}

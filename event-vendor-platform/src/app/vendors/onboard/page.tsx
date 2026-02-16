"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

type Category = { id: string; name: string };
type Subcategory = { id: string; name: string; category_id: string };

export default function VendorOnboardPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [loading, setLoading] = useState(true);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [subcategoryId, setSubcategoryId] = useState("");
  const [location, setLocation] = useState("");
  const [coverage, setCoverage] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [minBudget, setMinBudget] = useState("");
  const [leadDays, setLeadDays] = useState("");
  const [isHalal, setIsHalal] = useState("no");
  const [tags, setTags] = useState("");

  const [sent, setSent] = useState<null | "ok" | "err">(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const [{ data: cat }, { data: sub }] = await Promise.all([
        supabase.from("categories").select("id,name").order("name"),
        supabase.from("subcategories").select("id,name,category_id").order("name")
      ]);
      setCategories((cat ?? []) as any);
      setSubcategories((sub ?? []) as any);
      setLoading(false);
    }
    load();
  }, []);

  const filteredSubcats = categoryId ? subcategories.filter(s => s.category_id === categoryId) : subcategories;

  async function submit() {
    setSent(null);
    if (!name.trim()) { setSent("err"); return; }

    const tagArr = tags.split(",").map(s => s.trim()).filter(Boolean);

    const { error } = await supabase.from("vendor_profiles").insert({
      user_id: null,
      name: name.trim(),
      description: description.trim() || null,
      category_id: categoryId || null,
      subcategory_id: subcategoryId || null,
      location: location.trim() || null,
      coverage_area: coverage.trim() || null,
      whatsapp: whatsapp.trim() || null,
      min_budget: minBudget ? Number(minBudget) : null,
      lead_time_days: leadDays ? Number(leadDays) : null,
      is_halal: isHalal === "yes",
      tags: tagArr.length ? tagArr : null,
      portfolio_urls: null,
      status: "pending"
    });

    if (error) setSent("err");
    else {
      setName(""); setDescription(""); setCategoryId(""); setSubcategoryId("");
      setLocation(""); setCoverage(""); setWhatsapp(""); setMinBudget(""); setLeadDays("");
      setIsHalal("no"); setTags("");
      setSent("ok");
    }
  }

  return (
    <main className="container">
      <div className="card">
        <div className="badge">Vendors</div>
        <h1 className="h1" style={{ fontSize: 32 }}>List your business</h1>
        <div className="muted">Submit your profile. Admin will review and approve your listing.</div>

        {loading ? <div className="muted" style={{ marginTop: 14 }}>Loading…</div> : (
          <>
            <div className="grid cols-2" style={{ marginTop: 14 }}>
              <input className="input" value={name} onChange={(e) => setName(e.target.value)} placeholder="Business name *" />
              <input className="input" value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} placeholder="WhatsApp (e.g., +6591234567)" />
            </div>

            <textarea className="textarea" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Short description (what you do, styles, packages)" style={{ marginTop: 10 }} />

            <div className="grid cols-2" style={{ marginTop: 10 }}>
              <select className="select" value={categoryId} onChange={(e) => { setCategoryId(e.target.value); setSubcategoryId(""); }}>
                <option value="">Category (optional)</option>
                {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>

              <select className="select" value={subcategoryId} onChange={(e) => setSubcategoryId(e.target.value)} disabled={!filteredSubcats.length}>
                <option value="">Subcategory (optional)</option>
                {filteredSubcats.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>

            <div className="grid cols-2" style={{ marginTop: 10 }}>
              <input className="input" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Base location (e.g., Punggol)" />
              <input className="input" value={coverage} onChange={(e) => setCoverage(e.target.value)} placeholder="Coverage area (e.g., islandwide)" />
            </div>

            <div className="grid cols-3" style={{ marginTop: 10 }}>
              <input className="input" value={minBudget} onChange={(e) => setMinBudget(e.target.value)} placeholder="Minimum budget (optional)" inputMode="numeric" />
              <input className="input" value={leadDays} onChange={(e) => setLeadDays(e.target.value)} placeholder="Lead time days (optional)" inputMode="numeric" />
              <select className="select" value={isHalal} onChange={(e) => setIsHalal(e.target.value)}>
                <option value="no">Halal: no / n.a.</option>
                <option value="yes">Halal: yes</option>
              </select>
            </div>

            <input className="input" value={tags} onChange={(e) => setTags(e.target.value)} placeholder="Tags (comma-separated) e.g., Same-day, 24/7, Premium, Kids" style={{ marginTop: 10 }} />

            <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 12 }}>
              <button className="btn primary" onClick={submit}>Submit for approval</button>
              <Link className="btn" href="/browse">Browse vendors</Link>
              {sent === "ok" ? <span className="tag" style={{ borderColor: "rgba(45,212,191,.4)", color: "var(--good)" }}>Submitted!</span> : null}
              {sent === "err" ? <span className="tag">Please fill business name.</span> : null}
            </div>

            <div className="muted" style={{ marginTop: 14, fontSize: 13 }}>
              Note: For production, add authentication so vendors can manage their own profiles & listings.
            </div>
          </>
        )}
      </div>
    </main>
  );
}

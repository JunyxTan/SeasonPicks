"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { VendorCard } from "@/components/VendorCard";
import { VendorProfile } from "@/lib/types";
import { Section } from "@/components/Section";

type Category = { id: string; name: string };
type Subcategory = { id: string; name: string; category_id: string };

export default function BrowsePage() {
  const [loading, setLoading] = useState(true);

  const [vendors, setVendors] = useState<VendorProfile[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);

  const [q, setQ] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [subcategoryId, setSubcategoryId] = useState("");
  const [location, setLocation] = useState("");
  const [halal, setHalal] = useState("any");
  const [budgetMax, setBudgetMax] = useState("");

  useEffect(() => {
    async function load() {
      setLoading(true);

      const [{ data: cat }, { data: sub }, { data: ven }] = await Promise.all([
        supabase.from("categories").select("id, name").order("name"),
        supabase.from("subcategories").select("id, name, category_id").order("name"),
        supabase
          .from("vendor_profiles")
          .select("id,name,description,location,coverage_area,whatsapp,min_budget,lead_time_days,is_halal,tags,portfolio_urls,status,category_id,subcategory_id")
          .eq("status", "approved")
          .order("name")
      ]);

      setCategories((cat ?? []) as Category[]);
      setSubcategories((sub ?? []) as Subcategory[]);
      setVendors((ven ?? []) as VendorProfile[]);
      setLoading(false);
    }
    load();
  }, []);

  const filteredSubcats = useMemo(() => {
    if (!categoryId) return subcategories;
    return subcategories.filter((s) => s.category_id === categoryId);
  }, [categoryId, subcategories]);

  const catNameById = useMemo(() => Object.fromEntries(categories.map(c => [c.id, c.name])), [categories]);
  const subNameById = useMemo(() => Object.fromEntries(subcategories.map(s => [s.id, s.name])), [subcategories]);

  const filteredVendors = useMemo(() => {
    const term = q.trim().toLowerCase();
    const loc = location.trim().toLowerCase();
    const bMax = budgetMax ? Number(budgetMax) : null;

    return vendors.filter((v) => {
      if (categoryId && v.category_id !== categoryId) return false;
      if (subcategoryId && v.subcategory_id !== subcategoryId) return false;

      if (halal === "yes" && !v.is_halal) return false;
      if (halal === "no" && v.is_halal) return false;

      if (loc) {
        const hay = `${v.location ?? ""} ${v.coverage_area ?? ""}`.toLowerCase();
        if (!hay.includes(loc)) return false;
      }

      if (bMax != null && v.min_budget != null && v.min_budget > bMax) return false;

      if (term) {
        const hay = `${v.name} ${v.description ?? ""} ${v.tags?.join(" ") ?? ""}`.toLowerCase();
        if (!hay.includes(term)) return false;
      }

      return true;
    });
  }, [vendors, q, location, categoryId, subcategoryId, halal, budgetMax]);

  return (
    <main className="container">
      <div className="card">
        <div className="badge">Browse</div>
        <h1 className="h1" style={{ fontSize: 32 }}>Explore event vendors</h1>
        <div className="muted">Filter by category, location, budget and halal options.</div>

        <div className="grid cols-3" style={{ marginTop: 14 }}>
          <input className="input" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search (e.g., balloon, wedding, photobooth)" />
          <input className="input" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Location / coverage (e.g., Tampines, islandwide)" />
          <input className="input" value={budgetMax} onChange={(e) => setBudgetMax(e.target.value)} placeholder="Max min budget (e.g., 500)" inputMode="numeric" />
        </div>

        <div className="grid cols-3" style={{ marginTop: 10 }}>
          <select className="select" value={categoryId} onChange={(e) => { setCategoryId(e.target.value); setSubcategoryId(""); }}>
            <option value="">All categories</option>
            {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>

          <select className="select" value={subcategoryId} onChange={(e) => setSubcategoryId(e.target.value)} disabled={!filteredSubcats.length}>
            <option value="">All subcategories</option>
            {filteredSubcats.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>

          <select className="select" value={halal} onChange={(e) => setHalal(e.target.value)}>
            <option value="any">Halal: any</option>
            <option value="yes">Halal: yes</option>
            <option value="no">Halal: no</option>
          </select>
        </div>

        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 12 }}>
          <button className="btn" onClick={() => { setQ(""); setCategoryId(""); setSubcategoryId(""); setLocation(""); setHalal("any"); setBudgetMax(""); }}>
            Reset filters
          </button>
          <Link className="btn primary" href="/vendors/onboard">List your business</Link>
        </div>
      </div>

      <Section title={`Results (${filteredVendors.length})`}>
        {loading ? (
          <div className="muted">Loading…</div>
        ) : filteredVendors.length ? (
          <div className="grid cols-3">
            {filteredVendors.map((v) => (
              <VendorCard
                key={v.id}
                vendor={v}
                categoryName={v.category_id ? catNameById[v.category_id] : undefined}
                subcategoryName={v.subcategory_id ? subNameById[v.subcategory_id] : undefined}
              />
            ))}
          </div>
        ) : (
          <div className="card">
            <div style={{ fontWeight: 800 }}>No matches</div>
            <div className="muted" style={{ marginTop: 6 }}>Try changing category/location or remove budget filter.</div>
          </div>
        )}
      </Section>
    </main>
  );
}

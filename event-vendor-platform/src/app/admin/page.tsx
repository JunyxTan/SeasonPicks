"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

type Vendor = {
  id: string;
  name: string;
  description: string | null;
  location: string | null;
  status: "pending" | "approved" | "rejected";
  created_at: string;
};

export default function AdminPage() {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    const { data } = await supabase
      .from("vendor_profiles")
      .select("id,name,description,location,status,created_at")
      .order("created_at", { ascending: false });
    setVendors((data ?? []) as any);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function setStatus(id: string, status: Vendor["status"]) {
    setBusyId(id);
    await supabase.from("vendor_profiles").update({ status }).eq("id", id);
    setBusyId(null);
    load();
  }

  return (
    <main className="container">
      <div className="card">
        <div className="badge">Admin</div>
        <h1 className="h1" style={{ fontSize: 32 }}>Approvals</h1>
        <div className="muted">This is a basic MVP admin screen. Protect it with auth + RLS in production.</div>

        {loading ? <div className="muted" style={{ marginTop: 14 }}>Loading…</div> : (
          <div className="grid" style={{ marginTop: 14 }}>
            {vendors.map((v) => (
              <div key={v.id} className="card" style={{ background: "#101014" }}>
                <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
                  <div>
                    <div style={{ fontWeight: 900 }}>{v.name}</div>
                    <div className="muted" style={{ marginTop: 6 }}>
                      {v.location ?? "—"} • <span className="tag">{v.status}</span>
                    </div>
                    <div className="muted" style={{ marginTop: 8 }}>{(v.description ?? "—").slice(0, 140)}{(v.description ?? "").length > 140 ? "…" : ""}</div>
                  </div>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
                    <Link className="btn" href={`/vendors/${v.id}`}>View</Link>
                    <button className="btn" disabled={busyId === v.id} onClick={() => setStatus(v.id, "approved")}>Approve</button>
                    <button className="btn" disabled={busyId === v.id} onClick={() => setStatus(v.id, "rejected")}>Reject</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

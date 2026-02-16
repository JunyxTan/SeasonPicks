import Link from "next/link";
import { VendorProfile } from "@/lib/types";

export function VendorCard({ vendor, categoryName, subcategoryName }: { vendor: VendorProfile; categoryName?: string; subcategoryName?: string }) {
  return (
    <Link href={`/vendors/${vendor.id}`} className="card" style={{ display: "block" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{
          width: 46, height: 46, borderRadius: 14, background: "#0f0f12",
          display: "grid", placeItems: "center", border: "1px solid var(--border)", fontWeight: 900
        }}>
          {vendor.name.slice(0, 1).toUpperCase()}
        </div>
        <div style={{ minWidth: 0 }}>
          <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
            <div style={{ fontWeight: 800 }}>{vendor.name}</div>
            {vendor.is_halal ? <span className="tag">Halal</span> : null}
            {vendor.lead_time_days != null ? <span className="tag">{vendor.lead_time_days}d lead</span> : null}
          </div>
          <div className="muted" style={{ fontSize: 13, marginTop: 4 }}>
            {(subcategoryName ?? categoryName ?? "Event Vendor")} • {vendor.location ?? "Location not set"}
          </div>
        </div>
      </div>

      <div style={{ marginTop: 10 }} className="muted">
        {(vendor.description ?? "No description yet.").slice(0, 130)}
        {(vendor.description ?? "").length > 130 ? "…" : ""}
      </div>

      {vendor.tags?.length ? (
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 10 }}>
          {vendor.tags.slice(0, 5).map((t) => (
            <span key={t} className="tag">{t}</span>
          ))}
        </div>
      ) : null}
    </Link>
  );
}

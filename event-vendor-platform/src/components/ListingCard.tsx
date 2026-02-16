import Link from "next/link";
import { Listing } from "@/lib/types";

function priceLabel(listing: Listing) {
  if (listing.price_type === "quote") return "Quote only";
  if (listing.price_value == null) return "—";
  if (listing.price_type === "from") return `From $${listing.price_value}`;
  return `$${listing.price_value}`;
}

export function ListingCard({ listing }: { listing: Listing }) {
  return (
    <Link href={`/listings/${listing.id}`} className="card" style={{ display: "block" }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
        <div style={{ minWidth: 0 }}>
          <div style={{ fontWeight: 800 }}>{listing.title}</div>
          <div className="muted" style={{ marginTop: 6 }}>
            {(listing.description ?? "—").slice(0, 120)}
            {(listing.description ?? "").length > 120 ? "…" : ""}
          </div>
        </div>
        <div style={{ whiteSpace: "nowrap", fontWeight: 800 }}>{priceLabel(listing)}</div>
      </div>

      <div style={{ marginTop: 10, display: "flex", gap: 8, flexWrap: "wrap" }}>
        <span className="tag">{listing.type === "service" ? "Service" : "Product"}</span>
        <span className="tag">{listing.is_active ? "Active" : "Hidden"}</span>
      </div>
    </Link>
  );
}

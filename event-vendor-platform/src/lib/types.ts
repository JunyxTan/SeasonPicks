export type EventType =
  | "birthday"
  | "wedding"
  | "corporate"
  | "baby_shower"
  | "graduation"
  | "festive"
  | "other";

export type ListingType = "service" | "product";

export type VendorProfile = {
  id: string;
  name: string;
  description: string | null;
  location: string | null;
  coverage_area: string | null;
  whatsapp: string | null;
  min_budget: number | null;
  lead_time_days: number | null;
  is_halal: boolean | null;
  tags: string[] | null;
  portfolio_urls: string[] | null;
  status: "pending" | "approved" | "rejected";
  category_id: string | null;
  subcategory_id: string | null;
};

export type Listing = {
  id: string;
  vendor_id: string;
  type: ListingType;
  title: string;
  description: string | null;
  price_type: "fixed" | "from" | "quote";
  price_value: number | null;
  images: string[] | null;
  includes: string[] | null;
  addons: string[] | null;
  is_active: boolean;
};

export type Inquiry = {
  id: string;
  vendor_id: string;
  listing_id: string | null;
  event_type: EventType;
  event_date: string | null;
  event_location: string | null;
  budget_min: number | null;
  budget_max: number | null;
  pax: number | null;
  customer_name: string;
  customer_email: string;
  customer_phone: string | null;
  message: string;
  status: "new" | "replied" | "closed";
};

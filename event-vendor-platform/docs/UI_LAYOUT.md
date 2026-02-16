# CelebrateHub — UI Layout (MVP)

## Design principles
- Quote-first flow (pricing varies by date/venue/pax)
- Trust signals: halal, lead time, min budget, tags, approvals
- Fast discovery: category + subcategory + location + budget filters

---

## Pages & sections

### 1) Home (/)
**Hero**
- Headline: Find trusted vendors for your next celebration
- Primary CTA: Browse vendors
- Secondary CTA: List your business

**How it works**
- Browse → Request quote → Compare & book

**Popular categories**
- Decorations
- Cakes & Dessert
- Catering
- Photo & Video
- Rentals
- Entertainment

---

### 2) Browse (/browse)
**Top filters**
- Search keyword
- Location/coverage
- Max min budget
- Category + subcategory dropdown
- Halal toggle

**Result cards**
- Vendor name
- Category/subcategory
- Location
- Tags (e.g., Same-day, Premium, Kids)
- Trust badges (Halal, lead time, min budget)

---

### 3) Vendor profile (/vendors/[id])
**Header**
- Vendor name + category/subcategory
- Location & coverage
- Badges: halal, lead time, min budget
- WhatsApp button (optional)

**Listings grid**
- Packages displayed as cards

**Quote form**
- Customer name/email/phone
- Event type + date + venue
- Budget range + pax
- Message

---

### 4) Listing detail (/listings/[id])
- Title, vendor link, price label
- Includes + add-ons
- Quick inquiry box

---

### 5) Vendor onboarding (/vendors/onboard)
- Public form → creates pending vendor profile

---

### 6) Admin approvals (/admin)
- Pending/approved/rejected vendor list
- Approve/reject buttons
- (Production: protect with auth + RLS)

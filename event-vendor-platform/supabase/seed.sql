-- Seed data for categories and subcategories
insert into categories (name, slug) values
  ('Decorations', 'decorations'),
  ('Cakes & Dessert', 'cakes-dessert'),
  ('Catering', 'catering'),
  ('Photo & Video', 'photo-video'),
  ('Rentals', 'rentals'),
  ('Entertainment', 'entertainment')
on conflict (slug) do nothing;

-- Subcategories
with c as (select id, slug from categories)
insert into subcategories (category_id, name, slug)
select id, name, slug from (
  select (select id from c where slug='decorations') as id, 'Balloon Decor' as name, 'balloon-decor' as slug
  union all select (select id from c where slug='decorations'), 'Backdrops & Floral' ,'backdrops-floral'
  union all select (select id from c where slug='cakes-dessert'), 'Custom Cakes' ,'custom-cakes'
  union all select (select id from c where slug='cakes-dessert'), 'Dessert Table' ,'dessert-table'
  union all select (select id from c where slug='catering'), 'Buffet Catering' ,'buffet-catering'
  union all select (select id from c where slug='catering'), 'Bento Sets' ,'bento-sets'
  union all select (select id from c where slug='photo-video'), 'Event Photography' ,'event-photography'
  union all select (select id from c where slug='photo-video'), 'Photobooth' ,'photobooth'
  union all select (select id from c where slug='rentals'), 'Tables & Chairs' ,'tables-chairs'
  union all select (select id from c where slug='rentals'), 'Sound & Lighting' ,'sound-lighting'
  union all select (select id from c where slug='entertainment'), 'Emcee' ,'emcee'
  union all select (select id from c where slug='entertainment'), 'Kids Activities' ,'kids-activities'
) s
on conflict (slug) do nothing;

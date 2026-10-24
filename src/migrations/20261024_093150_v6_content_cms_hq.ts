import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'
import { applyV6Content } from '../seed/v6-content'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "cafe_nova"."enum_menu_items_badges" AS ENUM('new', 'popular', 'bestseller', 'chefs', 'seasonal', 'spicy', 'healthy', 'kids', 'limited', 'turkish');
  CREATE TYPE "cafe_nova"."enum_jobs_team" AS ENUM('front', 'kitchen', 'coffee');
  CREATE TYPE "cafe_nova"."enum_suppliers_category" AS ENUM('coffee', 'dairy', 'bakery', 'fresh-produce', 'meat-fish', 'dry-goods', 'drinks', 'packaging', 'cleaning', 'equipment', 'services');
  CREATE TYPE "cafe_nova"."enum_purchases_status" AS ENUM('unpaid', 'paid', 'disputed');
  CREATE TYPE "cafe_nova"."enum_expenses_category" AS ENUM('rent-rates', 'utilities', 'staff', 'marketing', 'delivery-fees', 'card-fees', 'repairs', 'software', 'insurance', 'other');
  CREATE TYPE "cafe_nova"."enum_expenses_recurring" AS ENUM('one-off', 'weekly', 'monthly', 'quarterly', 'yearly');
  CREATE TYPE "cafe_nova"."enum_documents_kind" AS ENUM('epos-sales-export', 'bank-statement', 'supplier-invoice', 'payroll-rota', 'delivery-app-report', 'stock-count', 'other');
  CREATE TYPE "cafe_nova"."enum_site_settings_facilities_icon" AS ENUM('dog', 'run', 'bike', 'rowing', 'river', 'family', 'party', 'hygiene', 'coffee', 'heart');
  ALTER TYPE "cafe_nova"."enum_menu_items_dietary" ADD VALUE 'df';
  CREATE TABLE "cafe_nova"."menu_items_badges" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "cafe_nova"."enum_menu_items_badges",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "cafe_nova"."jobs_responsibilities" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar NOT NULL
  );
  
  CREATE TABLE "cafe_nova"."jobs_requirements" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar NOT NULL
  );
  
  CREATE TABLE "cafe_nova"."jobs_benefits" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar NOT NULL
  );
  
  CREATE TABLE "cafe_nova"."themes_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"menu_items_id" integer
  );
  
  CREATE TABLE "cafe_nova"."suppliers_products" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"item" varchar NOT NULL,
  	"unit" varchar,
  	"price" numeric,
  	"updated" timestamp(3) with time zone
  );
  
  CREATE TABLE "cafe_nova"."suppliers" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"category" "cafe_nova"."enum_suppliers_category",
  	"contact" varchar,
  	"phone" varchar,
  	"email" varchar,
  	"website" varchar,
  	"account_number" varchar,
  	"payment_terms" varchar,
  	"delivery_days" varchar,
  	"minimum_order" numeric,
  	"notes" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "cafe_nova"."purchases_lines" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"item" varchar NOT NULL,
  	"qty" numeric,
  	"unit" varchar,
  	"unit_price" numeric
  );
  
  CREATE TABLE "cafe_nova"."purchases" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"date" timestamp(3) with time zone NOT NULL,
  	"supplier_id" integer,
  	"reference" varchar,
  	"net" numeric,
  	"vat" numeric,
  	"total" numeric NOT NULL,
  	"status" "cafe_nova"."enum_purchases_status" DEFAULT 'unpaid',
  	"file_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "cafe_nova"."expenses" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"date" timestamp(3) with time zone NOT NULL,
  	"category" "cafe_nova"."enum_expenses_category" NOT NULL,
  	"amount" numeric NOT NULL,
  	"description" varchar NOT NULL,
  	"recurring" "cafe_nova"."enum_expenses_recurring",
  	"receipt_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "cafe_nova"."documents" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"kind" "cafe_nova"."enum_documents_kind",
  	"period" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric
  );
  
  CREATE TABLE "cafe_nova"."site_settings_facilities_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"url" varchar NOT NULL,
  	"note" varchar
  );
  
  CREATE TABLE "cafe_nova"."homepage_hero_captions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"from" numeric NOT NULL,
  	"to" numeric NOT NULL,
  	"center" boolean,
  	"cta" boolean,
  	"title" varchar NOT NULL,
  	"body" varchar
  );
  
  CREATE TABLE "cafe_nova"."homepage_book_kit" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar NOT NULL
  );
  
  CREATE TABLE "cafe_nova"."homepage_values_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "cafe_nova"."homepage" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"hero_show" boolean DEFAULT true,
  	"hero_title" varchar DEFAULT 'Good morning, Richmond.',
  	"hero_text" varchar DEFAULT 'British and Turkish breakfasts, proper lunches and Alchemy coffee — cooked fresh in East Twickenham, by Richmond Bridge.',
  	"plates_show" boolean DEFAULT true,
  	"plates_eyebrow" varchar DEFAULT 'From the kitchen',
  	"plates_title" varchar DEFAULT 'Popular plates',
  	"plates_text" varchar DEFAULT 'Breakfast all day, lunch from noon. Two kitchens, British and Turkish, one table.',
  	"shop_show" boolean DEFAULT true,
  	"shop_eyebrow" varchar DEFAULT 'Order online',
  	"shop_title" varchar DEFAULT 'Order your favourites',
  	"shop_text" varchar DEFAULT 'Freshly cooked for your time — pick it up in the café or get it delivered.',
  	"new_on_menu_show" boolean DEFAULT true,
  	"new_on_menu_eyebrow" varchar DEFAULT 'New this season',
  	"new_on_menu_title" varchar DEFAULT 'New on the menu',
  	"new_on_menu_text" varchar DEFAULT 'Fresh from our kitchen this season — come and try it first.',
  	"new_on_menu_dish_id" integer,
  	"new_on_menu_link_label" varchar DEFAULT 'See the menu',
  	"book_show" boolean DEFAULT true,
  	"book_eyebrow" varchar DEFAULT 'Book an event',
  	"book_title" varchar DEFAULT 'Your party, our café.',
  	"book_text" varchar DEFAULT 'Birthdays, team parties, meze nights, quizzes and match nights — after 5pm the café is yours.',
  	"events_show" boolean DEFAULT true,
  	"events_title" varchar DEFAULT 'Festive & events',
  	"events_nearby_title" varchar DEFAULT 'Around Richmond',
  	"products_show" boolean DEFAULT true,
  	"products_eyebrow" varchar DEFAULT 'Products & suppliers',
  	"products_title" varchar DEFAULT 'Quality you can taste',
  	"products_text" varchar DEFAULT 'Speciality coffee, organic milk and produce bought fresh — the good stuff, every day.',
  	"products_take_home_title" varchar DEFAULT 'Take Alchemy home',
  	"products_take_home_image_path" varchar DEFAULT '/img/coffee-pack.svg',
  	"products_take_home_text" varchar DEFAULT 'The same speciality beans we pour, in bags to take home. Ask us to grind them for you.',
  	"products_take_home_image_id" integer,
  	"values_show" boolean DEFAULT true,
  	"values_eyebrow" varchar DEFAULT 'Our neighbourhood café',
  	"values_title" varchar DEFAULT 'A local hub, made with love.',
  	"values_text" varchar DEFAULT 'Fresh, home-made, friendly and welcoming. Come as a guest, leave as a friend.',
  	"google_show" boolean DEFAULT true,
  	"google_eyebrow" varchar DEFAULT 'Google reviews',
  	"google_title" varchar DEFAULT 'Loved by our neighbours',
  	"google_text" varchar DEFAULT 'What guests say on Google.',
  	"tripadvisor_show" boolean DEFAULT true,
  	"tripadvisor_eyebrow" varchar DEFAULT 'Tripadvisor',
  	"tripadvisor_title" varchar DEFAULT '',
  	"tripadvisor_text" varchar DEFAULT '',
  	"welcome_show" boolean DEFAULT true,
  	"welcome_eyebrow" varchar DEFAULT 'Everyone’s welcome',
  	"welcome_title" varchar DEFAULT 'Dogs, bikes, buggies and big groups',
  	"welcome_text" varchar DEFAULT 'A neighbourhood meeting spot between Richmond Bridge and the park.',
  	"find_us_show" boolean DEFAULT true,
  	"find_us_title" varchar DEFAULT 'Find us around Richmond',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "cafe_nova"."pages_about_story" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar NOT NULL
  );
  
  CREATE TABLE "cafe_nova"."pages_about_values" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "cafe_nova"."pages_hire_kit" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "cafe_nova"."pages_hire_ideas" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar NOT NULL
  );
  
  CREATE TABLE "cafe_nova"."pages_careers_why" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar NOT NULL
  );
  
  CREATE TABLE "cafe_nova"."pages" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"about_eyebrow" varchar DEFAULT 'Our story',
  	"about_title" varchar DEFAULT 'Two cultures. One table.',
  	"about_lede" varchar DEFAULT '60 years of family heritage, 20 years in Richmond, and one simple belief: every guest deserves to feel at home.',
  	"about_signature" varchar DEFAULT 'Come as a guest, leave as a friend.',
  	"about_signed_by" varchar DEFAULT 'Süleyman Demir, Founder & Owner',
  	"about_mission_title" varchar DEFAULT 'To be the neighbourhood’s favourite place to start the day.',
  	"about_mission_text" varchar DEFAULT 'Delicious food, happy faces, a peaceful corner and fresh ingredients — a local hub where everyone feels at home.',
  	"hire_title" varchar DEFAULT 'After five, the café is yours.',
  	"hire_text" varchar DEFAULT 'Birthdays, team parties, meze nights and match nights in our corner café by Richmond Bridge — cooked by our kitchen, hosted by our team.',
  	"hire_food_note" varchar DEFAULT 'Food: breakfast-for-dinner, Turkish meze sharing plates, wraps and sandwich platters or something of your own — tell us what you have in mind and we’ll put together a menu and a price.',
  	"hire_when" varchar DEFAULT 'Evenings after we close at 5pm — tell us your date and we’ll confirm. Bigger daytime groups: just let us know you’re coming.',
  	"careers_title" varchar DEFAULT 'Work with us',
  	"careers_text" varchar DEFAULT 'We’re a family-run café that cares about good food and warm service. If that sounds like you, we’d like to hear from you.',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  ALTER TABLE "cafe_nova"."enquiries" ADD COLUMN "position" varchar;
  ALTER TABLE "cafe_nova"."jobs" ADD COLUMN "order" numeric DEFAULT 0;
  ALTER TABLE "cafe_nova"."jobs" ADD COLUMN "team" "cafe_nova"."enum_jobs_team";
  ALTER TABLE "cafe_nova"."jobs" ADD COLUMN "schedule" varchar;
  ALTER TABLE "cafe_nova"."jobs" ADD COLUMN "pay" varchar;
  ALTER TABLE "cafe_nova"."payload_locked_documents_rels" ADD COLUMN "suppliers_id" integer;
  ALTER TABLE "cafe_nova"."payload_locked_documents_rels" ADD COLUMN "purchases_id" integer;
  ALTER TABLE "cafe_nova"."payload_locked_documents_rels" ADD COLUMN "expenses_id" integer;
  ALTER TABLE "cafe_nova"."payload_locked_documents_rels" ADD COLUMN "documents_id" integer;
  ALTER TABLE "cafe_nova"."site_settings_facilities" ADD COLUMN "icon" "cafe_nova"."enum_site_settings_facilities_icon";
  ALTER TABLE "cafe_nova"."menu_items_badges" ADD CONSTRAINT "menu_items_badges_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "cafe_nova"."menu_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cafe_nova"."jobs_responsibilities" ADD CONSTRAINT "jobs_responsibilities_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "cafe_nova"."jobs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cafe_nova"."jobs_requirements" ADD CONSTRAINT "jobs_requirements_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "cafe_nova"."jobs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cafe_nova"."jobs_benefits" ADD CONSTRAINT "jobs_benefits_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "cafe_nova"."jobs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cafe_nova"."themes_rels" ADD CONSTRAINT "themes_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "cafe_nova"."themes"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cafe_nova"."themes_rels" ADD CONSTRAINT "themes_rels_menu_items_fk" FOREIGN KEY ("menu_items_id") REFERENCES "cafe_nova"."menu_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cafe_nova"."suppliers_products" ADD CONSTRAINT "suppliers_products_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "cafe_nova"."suppliers"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cafe_nova"."purchases_lines" ADD CONSTRAINT "purchases_lines_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "cafe_nova"."purchases"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cafe_nova"."purchases" ADD CONSTRAINT "purchases_supplier_id_suppliers_id_fk" FOREIGN KEY ("supplier_id") REFERENCES "cafe_nova"."suppliers"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "cafe_nova"."purchases" ADD CONSTRAINT "purchases_file_id_documents_id_fk" FOREIGN KEY ("file_id") REFERENCES "cafe_nova"."documents"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "cafe_nova"."expenses" ADD CONSTRAINT "expenses_receipt_id_documents_id_fk" FOREIGN KEY ("receipt_id") REFERENCES "cafe_nova"."documents"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "cafe_nova"."site_settings_facilities_links" ADD CONSTRAINT "site_settings_facilities_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "cafe_nova"."site_settings_facilities"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cafe_nova"."homepage_hero_captions" ADD CONSTRAINT "homepage_hero_captions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "cafe_nova"."homepage"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cafe_nova"."homepage_book_kit" ADD CONSTRAINT "homepage_book_kit_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "cafe_nova"."homepage"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cafe_nova"."homepage_values_items" ADD CONSTRAINT "homepage_values_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "cafe_nova"."homepage"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cafe_nova"."homepage" ADD CONSTRAINT "homepage_new_on_menu_dish_id_menu_items_id_fk" FOREIGN KEY ("new_on_menu_dish_id") REFERENCES "cafe_nova"."menu_items"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "cafe_nova"."homepage" ADD CONSTRAINT "homepage_products_take_home_image_id_media_id_fk" FOREIGN KEY ("products_take_home_image_id") REFERENCES "cafe_nova"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "cafe_nova"."pages_about_story" ADD CONSTRAINT "pages_about_story_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "cafe_nova"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cafe_nova"."pages_about_values" ADD CONSTRAINT "pages_about_values_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "cafe_nova"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cafe_nova"."pages_hire_kit" ADD CONSTRAINT "pages_hire_kit_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "cafe_nova"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cafe_nova"."pages_hire_ideas" ADD CONSTRAINT "pages_hire_ideas_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "cafe_nova"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cafe_nova"."pages_careers_why" ADD CONSTRAINT "pages_careers_why_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "cafe_nova"."pages"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "menu_items_badges_order_idx" ON "cafe_nova"."menu_items_badges" USING btree ("order");
  CREATE INDEX "menu_items_badges_parent_idx" ON "cafe_nova"."menu_items_badges" USING btree ("parent_id");
  CREATE INDEX "jobs_responsibilities_order_idx" ON "cafe_nova"."jobs_responsibilities" USING btree ("_order");
  CREATE INDEX "jobs_responsibilities_parent_id_idx" ON "cafe_nova"."jobs_responsibilities" USING btree ("_parent_id");
  CREATE INDEX "jobs_requirements_order_idx" ON "cafe_nova"."jobs_requirements" USING btree ("_order");
  CREATE INDEX "jobs_requirements_parent_id_idx" ON "cafe_nova"."jobs_requirements" USING btree ("_parent_id");
  CREATE INDEX "jobs_benefits_order_idx" ON "cafe_nova"."jobs_benefits" USING btree ("_order");
  CREATE INDEX "jobs_benefits_parent_id_idx" ON "cafe_nova"."jobs_benefits" USING btree ("_parent_id");
  CREATE INDEX "themes_rels_order_idx" ON "cafe_nova"."themes_rels" USING btree ("order");
  CREATE INDEX "themes_rels_parent_idx" ON "cafe_nova"."themes_rels" USING btree ("parent_id");
  CREATE INDEX "themes_rels_path_idx" ON "cafe_nova"."themes_rels" USING btree ("path");
  CREATE INDEX "themes_rels_menu_items_id_idx" ON "cafe_nova"."themes_rels" USING btree ("menu_items_id");
  CREATE INDEX "suppliers_products_order_idx" ON "cafe_nova"."suppliers_products" USING btree ("_order");
  CREATE INDEX "suppliers_products_parent_id_idx" ON "cafe_nova"."suppliers_products" USING btree ("_parent_id");
  CREATE INDEX "suppliers_updated_at_idx" ON "cafe_nova"."suppliers" USING btree ("updated_at");
  CREATE INDEX "suppliers_created_at_idx" ON "cafe_nova"."suppliers" USING btree ("created_at");
  CREATE INDEX "purchases_lines_order_idx" ON "cafe_nova"."purchases_lines" USING btree ("_order");
  CREATE INDEX "purchases_lines_parent_id_idx" ON "cafe_nova"."purchases_lines" USING btree ("_parent_id");
  CREATE INDEX "purchases_supplier_idx" ON "cafe_nova"."purchases" USING btree ("supplier_id");
  CREATE INDEX "purchases_file_idx" ON "cafe_nova"."purchases" USING btree ("file_id");
  CREATE INDEX "purchases_updated_at_idx" ON "cafe_nova"."purchases" USING btree ("updated_at");
  CREATE INDEX "purchases_created_at_idx" ON "cafe_nova"."purchases" USING btree ("created_at");
  CREATE INDEX "expenses_receipt_idx" ON "cafe_nova"."expenses" USING btree ("receipt_id");
  CREATE INDEX "expenses_updated_at_idx" ON "cafe_nova"."expenses" USING btree ("updated_at");
  CREATE INDEX "expenses_created_at_idx" ON "cafe_nova"."expenses" USING btree ("created_at");
  CREATE INDEX "documents_updated_at_idx" ON "cafe_nova"."documents" USING btree ("updated_at");
  CREATE INDEX "documents_created_at_idx" ON "cafe_nova"."documents" USING btree ("created_at");
  CREATE UNIQUE INDEX "documents_filename_idx" ON "cafe_nova"."documents" USING btree ("filename");
  CREATE INDEX "site_settings_facilities_links_order_idx" ON "cafe_nova"."site_settings_facilities_links" USING btree ("_order");
  CREATE INDEX "site_settings_facilities_links_parent_id_idx" ON "cafe_nova"."site_settings_facilities_links" USING btree ("_parent_id");
  CREATE INDEX "homepage_hero_captions_order_idx" ON "cafe_nova"."homepage_hero_captions" USING btree ("_order");
  CREATE INDEX "homepage_hero_captions_parent_id_idx" ON "cafe_nova"."homepage_hero_captions" USING btree ("_parent_id");
  CREATE INDEX "homepage_book_kit_order_idx" ON "cafe_nova"."homepage_book_kit" USING btree ("_order");
  CREATE INDEX "homepage_book_kit_parent_id_idx" ON "cafe_nova"."homepage_book_kit" USING btree ("_parent_id");
  CREATE INDEX "homepage_values_items_order_idx" ON "cafe_nova"."homepage_values_items" USING btree ("_order");
  CREATE INDEX "homepage_values_items_parent_id_idx" ON "cafe_nova"."homepage_values_items" USING btree ("_parent_id");
  CREATE INDEX "homepage_new_on_menu_new_on_menu_dish_idx" ON "cafe_nova"."homepage" USING btree ("new_on_menu_dish_id");
  CREATE INDEX "homepage_products_products_take_home_image_idx" ON "cafe_nova"."homepage" USING btree ("products_take_home_image_id");
  CREATE INDEX "pages_about_story_order_idx" ON "cafe_nova"."pages_about_story" USING btree ("_order");
  CREATE INDEX "pages_about_story_parent_id_idx" ON "cafe_nova"."pages_about_story" USING btree ("_parent_id");
  CREATE INDEX "pages_about_values_order_idx" ON "cafe_nova"."pages_about_values" USING btree ("_order");
  CREATE INDEX "pages_about_values_parent_id_idx" ON "cafe_nova"."pages_about_values" USING btree ("_parent_id");
  CREATE INDEX "pages_hire_kit_order_idx" ON "cafe_nova"."pages_hire_kit" USING btree ("_order");
  CREATE INDEX "pages_hire_kit_parent_id_idx" ON "cafe_nova"."pages_hire_kit" USING btree ("_parent_id");
  CREATE INDEX "pages_hire_ideas_order_idx" ON "cafe_nova"."pages_hire_ideas" USING btree ("_order");
  CREATE INDEX "pages_hire_ideas_parent_id_idx" ON "cafe_nova"."pages_hire_ideas" USING btree ("_parent_id");
  CREATE INDEX "pages_careers_why_order_idx" ON "cafe_nova"."pages_careers_why" USING btree ("_order");
  CREATE INDEX "pages_careers_why_parent_id_idx" ON "cafe_nova"."pages_careers_why" USING btree ("_parent_id");
  ALTER TABLE "cafe_nova"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_suppliers_fk" FOREIGN KEY ("suppliers_id") REFERENCES "cafe_nova"."suppliers"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cafe_nova"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_purchases_fk" FOREIGN KEY ("purchases_id") REFERENCES "cafe_nova"."purchases"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cafe_nova"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_expenses_fk" FOREIGN KEY ("expenses_id") REFERENCES "cafe_nova"."expenses"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cafe_nova"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_documents_fk" FOREIGN KEY ("documents_id") REFERENCES "cafe_nova"."documents"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_suppliers_id_idx" ON "cafe_nova"."payload_locked_documents_rels" USING btree ("suppliers_id");
  CREATE INDEX "payload_locked_documents_rels_purchases_id_idx" ON "cafe_nova"."payload_locked_documents_rels" USING btree ("purchases_id");
  CREATE INDEX "payload_locked_documents_rels_expenses_id_idx" ON "cafe_nova"."payload_locked_documents_rels" USING btree ("expenses_id");
  CREATE INDEX "payload_locked_documents_rels_documents_id_idx" ON "cafe_nova"."payload_locked_documents_rels" USING btree ("documents_id");`)

  await applyV6Content(payload, req)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "cafe_nova"."menu_items_badges" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "cafe_nova"."jobs_responsibilities" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "cafe_nova"."jobs_requirements" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "cafe_nova"."jobs_benefits" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "cafe_nova"."themes_rels" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "cafe_nova"."suppliers_products" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "cafe_nova"."suppliers" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "cafe_nova"."purchases_lines" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "cafe_nova"."purchases" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "cafe_nova"."expenses" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "cafe_nova"."documents" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "cafe_nova"."site_settings_facilities_links" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "cafe_nova"."homepage_hero_captions" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "cafe_nova"."homepage_book_kit" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "cafe_nova"."homepage_values_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "cafe_nova"."homepage" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "cafe_nova"."pages_about_story" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "cafe_nova"."pages_about_values" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "cafe_nova"."pages_hire_kit" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "cafe_nova"."pages_hire_ideas" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "cafe_nova"."pages_careers_why" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "cafe_nova"."pages" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "cafe_nova"."menu_items_badges" CASCADE;
  DROP TABLE "cafe_nova"."jobs_responsibilities" CASCADE;
  DROP TABLE "cafe_nova"."jobs_requirements" CASCADE;
  DROP TABLE "cafe_nova"."jobs_benefits" CASCADE;
  DROP TABLE "cafe_nova"."themes_rels" CASCADE;
  DROP TABLE "cafe_nova"."suppliers_products" CASCADE;
  DROP TABLE "cafe_nova"."suppliers" CASCADE;
  DROP TABLE "cafe_nova"."purchases_lines" CASCADE;
  DROP TABLE "cafe_nova"."purchases" CASCADE;
  DROP TABLE "cafe_nova"."expenses" CASCADE;
  DROP TABLE "cafe_nova"."documents" CASCADE;
  DROP TABLE "cafe_nova"."site_settings_facilities_links" CASCADE;
  DROP TABLE "cafe_nova"."homepage_hero_captions" CASCADE;
  DROP TABLE "cafe_nova"."homepage_book_kit" CASCADE;
  DROP TABLE "cafe_nova"."homepage_values_items" CASCADE;
  DROP TABLE "cafe_nova"."homepage" CASCADE;
  DROP TABLE "cafe_nova"."pages_about_story" CASCADE;
  DROP TABLE "cafe_nova"."pages_about_values" CASCADE;
  DROP TABLE "cafe_nova"."pages_hire_kit" CASCADE;
  DROP TABLE "cafe_nova"."pages_hire_ideas" CASCADE;
  DROP TABLE "cafe_nova"."pages_careers_why" CASCADE;
  DROP TABLE "cafe_nova"."pages" CASCADE;
  ALTER TABLE "cafe_nova"."payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_suppliers_fk";
  
  ALTER TABLE "cafe_nova"."payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_purchases_fk";
  
  ALTER TABLE "cafe_nova"."payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_expenses_fk";
  
  ALTER TABLE "cafe_nova"."payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_documents_fk";
  
  ALTER TABLE "cafe_nova"."menu_items_dietary" ALTER COLUMN "value" SET DATA TYPE text;
  DROP TYPE "cafe_nova"."enum_menu_items_dietary";
  CREATE TYPE "cafe_nova"."enum_menu_items_dietary" AS ENUM('v', 'vg', 'gf');
  ALTER TABLE "cafe_nova"."menu_items_dietary" ALTER COLUMN "value" SET DATA TYPE "cafe_nova"."enum_menu_items_dietary" USING "value"::"cafe_nova"."enum_menu_items_dietary";
  DROP INDEX "cafe_nova"."payload_locked_documents_rels_suppliers_id_idx";
  DROP INDEX "cafe_nova"."payload_locked_documents_rels_purchases_id_idx";
  DROP INDEX "cafe_nova"."payload_locked_documents_rels_expenses_id_idx";
  DROP INDEX "cafe_nova"."payload_locked_documents_rels_documents_id_idx";
  ALTER TABLE "cafe_nova"."enquiries" DROP COLUMN "position";
  ALTER TABLE "cafe_nova"."jobs" DROP COLUMN "order";
  ALTER TABLE "cafe_nova"."jobs" DROP COLUMN "team";
  ALTER TABLE "cafe_nova"."jobs" DROP COLUMN "schedule";
  ALTER TABLE "cafe_nova"."jobs" DROP COLUMN "pay";
  ALTER TABLE "cafe_nova"."payload_locked_documents_rels" DROP COLUMN "suppliers_id";
  ALTER TABLE "cafe_nova"."payload_locked_documents_rels" DROP COLUMN "purchases_id";
  ALTER TABLE "cafe_nova"."payload_locked_documents_rels" DROP COLUMN "expenses_id";
  ALTER TABLE "cafe_nova"."payload_locked_documents_rels" DROP COLUMN "documents_id";
  ALTER TABLE "cafe_nova"."site_settings_facilities" DROP COLUMN "icon";
  DROP TYPE "cafe_nova"."enum_menu_items_badges";
  DROP TYPE "cafe_nova"."enum_jobs_team";
  DROP TYPE "cafe_nova"."enum_suppliers_category";
  DROP TYPE "cafe_nova"."enum_purchases_status";
  DROP TYPE "cafe_nova"."enum_expenses_category";
  DROP TYPE "cafe_nova"."enum_expenses_recurring";
  DROP TYPE "cafe_nova"."enum_documents_kind";
  DROP TYPE "cafe_nova"."enum_site_settings_facilities_icon";`)
}

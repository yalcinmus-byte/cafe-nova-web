import * as migration_20261021_140053_initial from './20261021_140053_initial';
import * as migration_20261021_195220_v3_orders_reviews_partners from './20261021_195220_v3_orders_reviews_partners';
import * as migration_20261021_205159_weekend_first_slot from './20261021_205159_weekend_first_slot';
import * as migration_20261022_204934_v4_shop from './20261022_204934_v4_shop';
import * as migration_20261023_114734_v5_seasonal_photo from './20261023_114734_v5_seasonal_photo';
import * as migration_20261024_093150_v6_content_cms_hq from './20261024_093150_v6_content_cms_hq';
import * as migration_20261024_100751_v7_careers_teaser from './20261024_100751_v7_careers_teaser';
import * as migration_20261024_104045_v8_whatsapp from './20261024_104045_v8_whatsapp';

export const migrations = [
  {
    up: migration_20261021_140053_initial.up,
    down: migration_20261021_140053_initial.down,
    name: '20261021_140053_initial',
  },
  {
    up: migration_20261021_195220_v3_orders_reviews_partners.up,
    down: migration_20261021_195220_v3_orders_reviews_partners.down,
    name: '20261021_195220_v3_orders_reviews_partners',
  },
  {
    up: migration_20261021_205159_weekend_first_slot.up,
    down: migration_20261021_205159_weekend_first_slot.down,
    name: '20261021_205159_weekend_first_slot',
  },
  {
    up: migration_20261022_204934_v4_shop.up,
    down: migration_20261022_204934_v4_shop.down,
    name: '20261022_204934_v4_shop',
  },
  {
    up: migration_20261023_114734_v5_seasonal_photo.up,
    down: migration_20261023_114734_v5_seasonal_photo.down,
    name: '20261023_114734_v5_seasonal_photo',
  },
  {
    up: migration_20261024_093150_v6_content_cms_hq.up,
    down: migration_20261024_093150_v6_content_cms_hq.down,
    name: '20261024_093150_v6_content_cms_hq',
  },
  {
    up: migration_20261024_100751_v7_careers_teaser.up,
    down: migration_20261024_100751_v7_careers_teaser.down,
    name: '20261024_100751_v7_careers_teaser',
  },
  {
    up: migration_20261024_104045_v8_whatsapp.up,
    down: migration_20261024_104045_v8_whatsapp.down,
    name: '20261024_104045_v8_whatsapp'
  },
];

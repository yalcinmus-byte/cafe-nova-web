import * as migration_20261021_140053_initial from './20261021_140053_initial';
import * as migration_20261021_195220_v3_orders_reviews_partners from './20261021_195220_v3_orders_reviews_partners';
import * as migration_20261021_205159_weekend_first_slot from './20261021_205159_weekend_first_slot';
import * as migration_20261022_204934_v4_shop from './20261022_204934_v4_shop';

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
    name: '20261022_204934_v4_shop'
  },
];

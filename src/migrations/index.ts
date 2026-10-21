import * as migration_20261021_140053_initial from './20261021_140053_initial';
import * as migration_20261021_195220_v3_orders_reviews_partners from './20261021_195220_v3_orders_reviews_partners';

export const migrations = [
  {
    up: migration_20261021_140053_initial.up,
    down: migration_20261021_140053_initial.down,
    name: '20261021_140053_initial',
  },
  {
    up: migration_20261021_195220_v3_orders_reviews_partners.up,
    down: migration_20261021_195220_v3_orders_reviews_partners.down,
    name: '20261021_195220_v3_orders_reviews_partners'
  },
];

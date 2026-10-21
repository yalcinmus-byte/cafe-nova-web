import * as migration_20261021_140053_initial from './20261021_140053_initial';

export const migrations = [
  {
    up: migration_20261021_140053_initial.up,
    down: migration_20261021_140053_initial.down,
    name: '20261021_140053_initial'
  },
];

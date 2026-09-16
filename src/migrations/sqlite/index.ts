import * as migration_20260910_161003_initial from './20260910_161003_initial';
import * as migration_20260911_142929_media_seo_blog from './20260911_142929_media_seo_blog';

export const migrations = [
  {
    up: migration_20260910_161003_initial.up,
    down: migration_20260910_161003_initial.down,
    name: '20260910_161003_initial',
  },
  {
    up: migration_20260911_142929_media_seo_blog.up,
    down: migration_20260911_142929_media_seo_blog.down,
    name: '20260911_142929_media_seo_blog'
  },
];

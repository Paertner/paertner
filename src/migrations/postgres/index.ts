import * as migration_20260910_161014_initial from './20260910_161014_initial';
import * as migration_20260911_143148_media_seo_blog from './20260911_143148_media_seo_blog';

export const migrations = [
  {
    up: migration_20260910_161014_initial.up,
    down: migration_20260910_161014_initial.down,
    name: '20260910_161014_initial',
  },
  {
    up: migration_20260911_143148_media_seo_blog.up,
    down: migration_20260911_143148_media_seo_blog.down,
    name: '20260911_143148_media_seo_blog'
  },
];

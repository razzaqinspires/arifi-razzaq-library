CREATE TABLE IF NOT EXISTS releases (
  id BIGSERIAL PRIMARY KEY,
  title VARCHAR(180) NOT NULL,
  slug VARCHAR(190) NOT NULL UNIQUE,
  short_description VARCHAR(280) NOT NULL,
  description TEXT NOT NULL,
  category VARCHAR(80) NOT NULL,
  version VARCHAR(60) NOT NULL,
  file_size VARCHAR(60),
  file_name VARCHAR(180),
  download_url TEXT NOT NULL,
  video_url TEXT,
  thumbnail_url TEXT,
  tags TEXT[] NOT NULL DEFAULT '{}',
  changelog TEXT[] NOT NULL DEFAULT '{}',
  featured BOOLEAN NOT NULL DEFAULT FALSE,
  downloads BIGINT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS releases_created_at_idx ON releases (created_at DESC);
CREATE INDEX IF NOT EXISTS releases_category_idx ON releases (category);

CREATE TABLE IF NOT EXISTS release_likes (
  id BIGSERIAL PRIMARY KEY,
  release_id BIGINT NOT NULL REFERENCES releases(id) ON DELETE CASCADE,
  visitor_id UUID NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (release_id, visitor_id)
);

CREATE TABLE IF NOT EXISTS release_ratings (
  id BIGSERIAL PRIMARY KEY,
  release_id BIGINT NOT NULL REFERENCES releases(id) ON DELETE CASCADE,
  visitor_id UUID NOT NULL,
  score SMALLINT NOT NULL CHECK (score BETWEEN 1 AND 5),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (release_id, visitor_id)
);

CREATE TABLE IF NOT EXISTS release_comments (
  id BIGSERIAL PRIMARY KEY,
  release_id BIGINT NOT NULL REFERENCES releases(id) ON DELETE CASCADE,
  visitor_id UUID NOT NULL,
  name VARCHAR(48) NOT NULL,
  body VARCHAR(1200) NOT NULL,
  status VARCHAR(16) NOT NULL DEFAULT 'approved' CHECK (status IN ('approved', 'hidden')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS release_comments_public_idx
  ON release_comments (release_id, created_at DESC) WHERE status = 'approved';

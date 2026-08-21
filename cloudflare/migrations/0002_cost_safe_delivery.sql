ALTER TABLE images
ADD COLUMN original_bytes INTEGER NOT NULL DEFAULT 0;

CREATE TABLE image_transform_usage (
  billing_month TEXT NOT NULL,
  image_id TEXT NOT NULL REFERENCES images(id) ON DELETE CASCADE,
  preset TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (billing_month, image_id, preset)
);

CREATE INDEX image_transform_usage_month_idx
ON image_transform_usage(billing_month);

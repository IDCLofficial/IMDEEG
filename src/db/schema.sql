-- Skillup Imo Cohort Portal: registrations table (Neon / Postgres)

CREATE TABLE IF NOT EXISTS registrations (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- personal info
  full_name             TEXT NOT NULL,
  phone_number          TEXT NOT NULL,
  email                 TEXT NOT NULL,
  gender                TEXT NOT NULL,
  age_bracket           TEXT NOT NULL,
  marital_status        TEXT,
  state_of_origin       TEXT,
  nin                   CHAR(11) NOT NULL,
  imssbn                TEXT NOT NULL,

  -- location
  local_government      TEXT NOT NULL,
  town                  TEXT NOT NULL,
  ward                  TEXT NOT NULL,
  residential_address   TEXT,

  -- programme choice
  selected_course       TEXT NOT NULL,
  selected_center       TEXT NOT NULL,
  time_frame            TEXT NOT NULL DEFAULT 'Intermediate: 4-12 weeks',

  -- education
  highest_qualification TEXT,
  course_of_study       TEXT,
  institution           TEXT,
  digital_skills        TEXT,

  -- next of kin
  nok_name              TEXT,
  nok_phone             TEXT,
  nok_nin               CHAR(11),
  nok_relationship      TEXT,

  -- admin
  status                TEXT NOT NULL DEFAULT 'pending',
  is_active             BOOLEAN NOT NULL DEFAULT TRUE,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS registrations_nin_key ON registrations (nin);

CREATE UNIQUE INDEX IF NOT EXISTS registrations_imssbn_key ON registrations (imssbn);

CREATE INDEX IF NOT EXISTS registrations_course_idx ON registrations (selected_course);

CREATE INDEX IF NOT EXISTS registrations_lga_idx ON registrations (local_government);

CREATE INDEX IF NOT EXISTS registrations_created_idx ON registrations (created_at DESC);

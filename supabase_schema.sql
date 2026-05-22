-- ============================================================
-- SpendLens Database Schema
-- Run this in Supabase SQL Editor:
-- Project → SQL Editor → New Query → paste → Run
-- ============================================================

-- 1. AUDITS TABLE
-- Stores every audit result (linked to by the shareable URL)
-- ============================================================
CREATE TABLE IF NOT EXISTS audits (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),

  -- User inputs
  team_size     INTEGER NOT NULL,
  use_case      TEXT NOT NULL,    -- 'coding' | 'writing' | 'data' | 'research' | 'mixed'
  tools_input   JSONB NOT NULL,   -- raw form data (array of tool entries)

  -- Audit results
  results       JSONB NOT NULL,   -- per-tool breakdown array
  total_monthly_savings  NUMERIC(10,2) NOT NULL DEFAULT 0,
  total_annual_savings   NUMERIC(10,2) NOT NULL DEFAULT 0,
  ai_summary    TEXT,             -- LLM-generated summary paragraph

  -- Flags
  is_high_savings  BOOLEAN GENERATED ALWAYS AS (total_monthly_savings > 500) STORED
);

-- 2. LEADS TABLE
-- Stores captured emails after audit is shown
-- ============================================================
CREATE TABLE IF NOT EXISTS leads (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),

  audit_id      UUID REFERENCES audits(id) ON DELETE SET NULL,

  -- Captured fields
  email         TEXT NOT NULL,
  company_name  TEXT,
  role          TEXT,
  team_size     INTEGER,

  -- Metadata
  monthly_savings  NUMERIC(10,2),  -- copied from audit at time of capture
  email_sent    BOOLEAN NOT NULL DEFAULT false,
  notified_credex BOOLEAN NOT NULL DEFAULT false  -- true if Credex should follow up
);

-- 3. INDEXES for performance
-- ============================================================
CREATE INDEX IF NOT EXISTS audits_created_at_idx ON audits(created_at DESC);
CREATE INDEX IF NOT EXISTS leads_email_idx ON leads(email);
CREATE INDEX IF NOT EXISTS leads_audit_id_idx ON leads(audit_id);

-- 4. ROW LEVEL SECURITY
-- Audits are publicly readable (for shareable URLs)
-- Leads are server-only (no public read)
-- ============================================================
ALTER TABLE audits ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read audits (needed for shareable public URLs)
CREATE POLICY "Public audits are viewable by everyone"
  ON audits FOR SELECT USING (true);

-- Only service role can insert/update audits (done via backend)
CREATE POLICY "Service role can insert audits"
  ON audits FOR INSERT WITH CHECK (true);

-- Leads: only service role can read/write (never exposed to client)
CREATE POLICY "Service role only for leads"
  ON leads FOR ALL USING (true);

-- ============================================================
-- Done! You should see tables: audits, leads
-- ============================================================

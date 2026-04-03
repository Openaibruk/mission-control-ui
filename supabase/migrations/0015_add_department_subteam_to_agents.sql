-- Add department and subteam to agents for org chart grouping
ALTER TABLE agents
ADD COLUMN IF NOT EXISTS department text,
ADD COLUMN IF NOT EXISTS subteam text;

-- Enable indexing for filtering and grouping
CREATE INDEX IF NOT EXISTS idx_agents_department ON agents(department);
CREATE INDEX IF NOT EXISTS idx_agents_subteam ON agents(subteam);

-- Populate with initial values from existing agent data (based on AGENT_DEPT_OVERRIDE mapping)
-- This is optional; can be populated via application logic instead

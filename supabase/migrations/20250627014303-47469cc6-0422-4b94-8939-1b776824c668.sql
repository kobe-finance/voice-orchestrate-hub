
-- Create the registration_logs table that's missing (without duplicate policy)
CREATE TABLE IF NOT EXISTS public.registration_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  action TEXT NOT NULL,
  details JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on registration logs (if not already enabled)
ALTER TABLE public.registration_logs ENABLE ROW LEVEL SECURITY;

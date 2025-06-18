
-- Create waitlist table with proper structure
CREATE TABLE public.waitlist (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL, -- Not nullable for RLS
  email TEXT NOT NULL UNIQUE,
  referral_code TEXT NOT NULL UNIQUE DEFAULT encode(gen_random_bytes(12), 'base64url'),
  referred_by UUID REFERENCES public.waitlist(id),
  points INTEGER NOT NULL DEFAULT 0,
  discord_joined BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create view for dynamic position calculation using ROW_NUMBER()
CREATE OR REPLACE VIEW public.waitlist_with_position AS
SELECT 
  w.*,
  ROW_NUMBER() OVER (ORDER BY w.points DESC, w.created_at ASC) as waitlist_position,
  (SELECT COUNT(*) FROM public.waitlist w2 WHERE w2.referred_by = w.id) as referral_count
FROM public.waitlist w;

-- Enable RLS
ALTER TABLE public.waitlist ENABLE ROW LEVEL SECURITY;

-- RLS policies
CREATE POLICY "Users can view their own waitlist entry" 
  ON public.waitlist 
  FOR SELECT 
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own waitlist entry" 
  ON public.waitlist 
  FOR INSERT 
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own waitlist entry" 
  ON public.waitlist 
  FOR UPDATE 
  USING (user_id = auth.uid());

-- Function to handle referral signup atomically
CREATE OR REPLACE FUNCTION public.handle_waitlist_signup(
  p_email TEXT,
  p_referral_code TEXT DEFAULT NULL
) RETURNS JSON AS $$
DECLARE
  v_user_id UUID;
  v_referrer_id UUID;
  v_new_entry public.waitlist;
  v_result JSON;
BEGIN
  -- Get current user ID
  v_user_id := auth.uid();
  
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'User must be authenticated';
  END IF;

  -- Find referrer if referral code provided
  IF p_referral_code IS NOT NULL THEN
    SELECT id INTO v_referrer_id 
    FROM public.waitlist 
    WHERE referral_code = p_referral_code;
  END IF;

  -- Insert new waitlist entry
  INSERT INTO public.waitlist (user_id, email, referred_by)
  VALUES (v_user_id, p_email, v_referrer_id)
  RETURNING * INTO v_new_entry;

  -- Award points to referrer if exists
  IF v_referrer_id IS NOT NULL THEN
    UPDATE public.waitlist 
    SET points = points + 10, updated_at = now()
    WHERE id = v_referrer_id;
  END IF;

  -- Get the result with position
  SELECT json_build_object(
    'id', wv.id,
    'email', wv.email,
    'referral_code', wv.referral_code,
    'points', wv.points,
    'waitlist_position', wv.waitlist_position,
    'referral_count', wv.referral_count,
    'discord_joined', wv.discord_joined
  ) INTO v_result
  FROM public.waitlist_with_position wv
  WHERE wv.id = v_new_entry.id;

  RETURN v_result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update Discord join status and award points
CREATE OR REPLACE FUNCTION public.update_discord_status()
RETURNS JSON AS $$
DECLARE
  v_user_id UUID;
  v_result JSON;
BEGIN
  v_user_id := auth.uid();
  
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'User must be authenticated';
  END IF;

  -- Update Discord status and award points
  UPDATE public.waitlist 
  SET discord_joined = true, 
      points = points + 50, 
      updated_at = now()
  WHERE user_id = v_user_id AND discord_joined = false;

  -- Return updated data
  SELECT json_build_object(
    'id', wv.id,
    'email', wv.email,
    'referral_code', wv.referral_code,
    'points', wv.points,
    'waitlist_position', wv.waitlist_position,
    'referral_count', wv.referral_count,
    'discord_joined', wv.discord_joined
  ) INTO v_result
  FROM public.waitlist_with_position wv
  WHERE wv.user_id = v_user_id;

  RETURN v_result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get user's waitlist data
CREATE OR REPLACE FUNCTION public.get_waitlist_data()
RETURNS JSON AS $$
DECLARE
  v_user_id UUID;
  v_result JSON;
BEGIN
  v_user_id := auth.uid();
  
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'User must be authenticated';
  END IF;

  SELECT json_build_object(
    'id', wv.id,
    'email', wv.email,
    'referral_code', wv.referral_code,
    'points', wv.points,
    'waitlist_position', wv.waitlist_position,
    'referral_count', wv.referral_count,
    'discord_joined', wv.discord_joined
  ) INTO v_result
  FROM public.waitlist_with_position wv
  WHERE wv.user_id = v_user_id;

  RETURN v_result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

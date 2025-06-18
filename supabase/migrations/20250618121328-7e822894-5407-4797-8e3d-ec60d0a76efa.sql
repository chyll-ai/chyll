
-- Update RLS policies to allow users to manage their own waitlist entries
-- while keeping management functions superadmin-only

-- Drop existing restrictive policies
DROP POLICY IF EXISTS "Only superadmin can view waitlist entries" ON public.waitlist;
DROP POLICY IF EXISTS "Only superadmin can insert waitlist entries" ON public.waitlist;
DROP POLICY IF EXISTS "Only superadmin can update waitlist entries" ON public.waitlist;
DROP POLICY IF EXISTS "Only superadmin can delete waitlist entries" ON public.waitlist;

-- Create new policies that allow users to manage their own entries
CREATE POLICY "Users can view their own waitlist entry" 
  ON public.waitlist 
  FOR SELECT 
  USING (user_id = auth.uid());

CREATE POLICY "Superadmins can view all waitlist entries" 
  ON public.waitlist 
  FOR SELECT 
  USING (public.is_superadmin());

CREATE POLICY "Users can insert their own waitlist entry" 
  ON public.waitlist 
  FOR INSERT 
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own waitlist entry" 
  ON public.waitlist 
  FOR UPDATE 
  USING (user_id = auth.uid());

CREATE POLICY "Superadmins can manage all waitlist entries" 
  ON public.waitlist 
  FOR ALL 
  USING (public.is_superadmin());

-- Update waitlist functions to allow users to manage their own data
-- while keeping bulk access superadmin-only

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

  -- Insert new waitlist entry (RLS will ensure user can only insert their own)
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

  -- Update Discord status and award points (RLS will ensure user can only update their own)
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

  -- Get user's own waitlist data (RLS will ensure user can only see their own)
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

-- Create a separate function for superadmin management access
CREATE OR REPLACE FUNCTION public.get_all_waitlist_data()
RETURNS TABLE(
  id UUID,
  user_id UUID,
  email TEXT,
  referral_code TEXT,
  points INTEGER,
  waitlist_position BIGINT,
  referral_count BIGINT,
  discord_joined BOOLEAN,
  created_at TIMESTAMPTZ
) AS $$
BEGIN
  -- Check if user is superadmin
  IF NOT public.is_superadmin() THEN
    RAISE EXCEPTION 'Access denied: Superadmin privileges required';
  END IF;

  RETURN QUERY
  SELECT 
    wv.id,
    wv.user_id,
    wv.email,
    wv.referral_code,
    wv.points,
    wv.waitlist_position,
    wv.referral_count,
    wv.discord_joined,
    wv.created_at
  FROM public.waitlist_with_position wv
  ORDER BY wv.waitlist_position ASC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

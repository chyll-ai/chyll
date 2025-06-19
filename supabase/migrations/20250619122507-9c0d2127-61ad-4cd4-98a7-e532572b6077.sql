
-- Update the handle_waitlist_signup function to work without authentication
CREATE OR REPLACE FUNCTION public.handle_waitlist_signup(
  p_email TEXT,
  p_referral_code TEXT DEFAULT NULL
) RETURNS JSON AS $$
DECLARE
  v_referrer_id UUID;
  v_new_entry public.waitlist;
  v_result JSON;
  v_user_id UUID;
BEGIN
  -- Generate a temporary user ID for anonymous users
  v_user_id := gen_random_uuid();

  -- Find referrer if referral code provided
  IF p_referral_code IS NOT NULL THEN
    SELECT id INTO v_referrer_id 
    FROM public.waitlist 
    WHERE referral_code = p_referral_code;
  END IF;

  -- Insert new waitlist entry with generated user_id
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

-- Update RLS policies to allow anonymous inserts for waitlist
DROP POLICY IF EXISTS "Users can insert their own waitlist entry" ON public.waitlist;
CREATE POLICY "Anyone can join waitlist" 
  ON public.waitlist 
  FOR INSERT 
  WITH CHECK (true);

-- Update the get_waitlist_data function to work with email lookup for anonymous users
CREATE OR REPLACE FUNCTION public.get_waitlist_data_by_email(p_email TEXT)
RETURNS JSON AS $$
DECLARE
  v_result JSON;
BEGIN
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
  WHERE wv.email = p_email;

  RETURN v_result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

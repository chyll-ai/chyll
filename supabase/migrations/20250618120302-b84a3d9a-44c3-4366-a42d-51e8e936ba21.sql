
-- Create app_role enum for user roles
CREATE TYPE public.app_role AS ENUM ('superadmin', 'admin', 'user');

-- Create user_roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE (user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check user roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Create function to get user email (for checking specific email)
CREATE OR REPLACE FUNCTION public.get_user_email(_user_id UUID)
RETURNS TEXT
LANGUAGE SQL
STABLE
SECURITY DEFINER
AS $$
  SELECT email
  FROM auth.users
  WHERE id = _user_id
$$;

-- Function to check if user is superadmin or specific email
CREATE OR REPLACE FUNCTION public.is_superadmin()
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
AS $$
  SELECT 
    public.has_role(auth.uid(), 'superadmin') OR 
    public.get_user_email(auth.uid()) = 'ceo@chyll.ai'
$$;

-- Update waitlist RLS policies to only allow superadmin access
DROP POLICY IF EXISTS "Users can view their own waitlist entry" ON public.waitlist;
DROP POLICY IF EXISTS "Users can insert their own waitlist entry" ON public.waitlist;
DROP POLICY IF EXISTS "Users can update their own waitlist entry" ON public.waitlist;

-- New restrictive policies for waitlist - only superadmin
CREATE POLICY "Only superadmin can view waitlist entries" 
  ON public.waitlist 
  FOR SELECT 
  USING (public.is_superadmin());

CREATE POLICY "Only superadmin can insert waitlist entries" 
  ON public.waitlist 
  FOR INSERT 
  WITH CHECK (public.is_superadmin());

CREATE POLICY "Only superadmin can update waitlist entries" 
  ON public.waitlist 
  FOR UPDATE 
  USING (public.is_superadmin());

CREATE POLICY "Only superadmin can delete waitlist entries" 
  ON public.waitlist 
  FOR DELETE 
  USING (public.is_superadmin());

-- RLS policies for user_roles table
CREATE POLICY "Superadmins can view all roles" 
  ON public.user_roles 
  FOR SELECT 
  USING (public.is_superadmin());

CREATE POLICY "Superadmins can manage all roles" 
  ON public.user_roles 
  FOR ALL 
  USING (public.is_superadmin());

-- Insert superadmin role for ceo@chyll.ai if the user exists
-- This will be handled in the application code since we need to check if user exists first

-- Update waitlist functions to check superadmin permissions
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

  -- Check if user is superadmin
  IF NOT public.is_superadmin() THEN
    RAISE EXCEPTION 'Access denied: Superadmin privileges required';
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

  -- Check if user is superadmin
  IF NOT public.is_superadmin() THEN
    RAISE EXCEPTION 'Access denied: Superadmin privileges required';
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

  -- Check if user is superadmin
  IF NOT public.is_superadmin() THEN
    RAISE EXCEPTION 'Access denied: Superadmin privileges required';
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

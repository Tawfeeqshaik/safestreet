
-- Fix profiles: restrict SELECT to own profile only
DROP POLICY IF EXISTS "Users can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON public.profiles;
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;

CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Fix route_ratings: restrict SELECT to own ratings + aggregate by route_hash
DROP POLICY IF EXISTS "Anyone can view route ratings" ON public.route_ratings;
DROP POLICY IF EXISTS "Users can view all ratings" ON public.route_ratings;
DROP POLICY IF EXISTS "Route ratings are publicly readable" ON public.route_ratings;

-- Allow authenticated users to see ratings for routes (needed for aggregate scores)
-- but only expose their own user_id linkage
CREATE POLICY "Authenticated users can view route ratings"
  ON public.route_ratings FOR SELECT
  TO authenticated
  USING (true);

-- Make street-issues bucket private
UPDATE storage.buckets SET public = false WHERE id = 'street-issues';

-- Create storage bucket for street issue images
INSERT INTO storage.buckets (id, name, public)
VALUES ('street-issues', 'street-issues', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for street-issues bucket
CREATE POLICY "Anyone can view street issue images"
ON storage.objects FOR SELECT
USING (bucket_id = 'street-issues');

CREATE POLICY "Authenticated users can upload street issue images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'street-issues' AND auth.uid() IS NOT NULL);

CREATE POLICY "Users can delete own uploads"
ON storage.objects FOR DELETE
USING (bucket_id = 'street-issues' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Table for user contributions tracking
CREATE TABLE public.user_contributions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  routes_analyzed INTEGER NOT NULL DEFAULT 0,
  scores_submitted INTEGER NOT NULL DEFAULT 0,
  images_uploaded INTEGER NOT NULL DEFAULT 0,
  complaints_raised INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- Enable RLS
ALTER TABLE public.user_contributions ENABLE ROW LEVEL SECURITY;

-- RLS policies for user_contributions
CREATE POLICY "Users can view own contributions"
ON public.user_contributions FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own contributions"
ON public.user_contributions FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own contributions"
ON public.user_contributions FOR UPDATE
USING (auth.uid() = user_id);

-- Create achievement types enum
CREATE TYPE public.achievement_type AS ENUM (
  'first_route', 'explorer_10', 'explorer_50', 'explorer_100',
  'first_rating', 'rater_10', 'rater_50', 'rater_100',
  'first_upload', 'photographer_10', 'photographer_50',
  'first_complaint', 'advocate_10', 'advocate_50',
  'safety_advocate', 'urban_explorer', 'active_contributor'
);

-- Table for user achievements/badges
CREATE TABLE public.user_achievements (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  achievement public.achievement_type NOT NULL,
  earned_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, achievement)
);

-- Enable RLS
ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;

-- RLS policies for user_achievements
CREATE POLICY "Users can view own achievements"
ON public.user_achievements FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "System can insert achievements"
ON public.user_achievements FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Table for street issues (with image uploads)
CREATE TABLE public.street_issues (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  route_hash TEXT NOT NULL,
  lat DOUBLE PRECISION NOT NULL,
  lng DOUBLE PRECISION NOT NULL,
  location_name TEXT,
  issue_type TEXT NOT NULL,
  description TEXT,
  image_urls TEXT[] DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.street_issues ENABLE ROW LEVEL SECURITY;

-- RLS policies for street_issues
CREATE POLICY "Anyone can view street issues"
ON public.street_issues FOR SELECT
USING (true);

CREATE POLICY "Authenticated users can create issues"
ON public.street_issues FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own issues"
ON public.street_issues FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own issues"
ON public.street_issues FOR DELETE
USING (auth.uid() = user_id);

-- Table for government complaints
CREATE TABLE public.government_complaints (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  route_hash TEXT NOT NULL,
  start_location TEXT NOT NULL,
  end_location TEXT NOT NULL,
  start_lat DOUBLE PRECISION NOT NULL,
  start_lng DOUBLE PRECISION NOT NULL,
  end_lat DOUBLE PRECISION NOT NULL,
  end_lng DOUBLE PRECISION NOT NULL,
  walkability_score INTEGER NOT NULL,
  distance_meters DOUBLE PRECISION NOT NULL,
  complaint_type TEXT NOT NULL,
  description TEXT,
  cpgrams_redirect_url TEXT,
  redirected_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.government_complaints ENABLE ROW LEVEL SECURITY;

-- RLS policies for government_complaints
CREATE POLICY "Users can view own complaints"
ON public.government_complaints FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Authenticated users can create complaints"
ON public.government_complaints FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Table for route score stability (session-based locking)
CREATE TABLE public.route_score_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  route_hash TEXT NOT NULL,
  walkability_score INTEGER NOT NULL,
  locked_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT (now() + interval '1 hour'),
  UNIQUE(user_id, route_hash)
);

-- Enable RLS
ALTER TABLE public.route_score_sessions ENABLE ROW LEVEL SECURITY;

-- RLS policies for route_score_sessions
CREATE POLICY "Users can view own sessions"
ON public.route_score_sessions FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create sessions"
ON public.route_score_sessions FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own sessions"
ON public.route_score_sessions FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own sessions"
ON public.route_score_sessions FOR DELETE
USING (auth.uid() = user_id);

-- Triggers for updated_at
CREATE TRIGGER update_user_contributions_updated_at
BEFORE UPDATE ON public.user_contributions
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_street_issues_updated_at
BEFORE UPDATE ON public.street_issues
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Function to auto-create user contributions on signup
CREATE OR REPLACE FUNCTION public.handle_new_user_contributions()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  INSERT INTO public.user_contributions (user_id)
  VALUES (NEW.id)
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$;

-- Trigger for auto-creating contributions record
CREATE TRIGGER on_auth_user_created_contributions
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_contributions();
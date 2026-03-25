
-- Company reviews table with Glassdoor-style category ratings
CREATE TABLE public.company_reviews (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  company_name TEXT NOT NULL,
  job_title TEXT NOT NULL,
  employment_status TEXT NOT NULL DEFAULT 'Current',
  overall_rating SMALLINT NOT NULL CHECK (overall_rating BETWEEN 1 AND 5),
  culture_rating SMALLINT NOT NULL CHECK (culture_rating BETWEEN 1 AND 5),
  salary_rating SMALLINT NOT NULL CHECK (salary_rating BETWEEN 1 AND 5),
  management_rating SMALLINT NOT NULL CHECK (management_rating BETWEEN 1 AND 5),
  work_life_balance_rating SMALLINT NOT NULL CHECK (work_life_balance_rating BETWEEN 1 AND 5),
  pros TEXT NOT NULL,
  cons TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.company_reviews ENABLE ROW LEVEL SECURITY;

-- Anyone can read reviews (public feature)
CREATE POLICY "Anyone can view reviews"
  ON public.company_reviews FOR SELECT
  USING (true);

-- Authenticated users can create reviews
CREATE POLICY "Authenticated users can create reviews"
  ON public.company_reviews FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own reviews
CREATE POLICY "Users can update own reviews"
  ON public.company_reviews FOR UPDATE
  USING (auth.uid() = user_id);

-- Users can delete their own reviews
CREATE POLICY "Users can delete own reviews"
  ON public.company_reviews FOR DELETE
  USING (auth.uid() = user_id);

-- Timestamp trigger
CREATE TRIGGER update_company_reviews_updated_at
  BEFORE UPDATE ON public.company_reviews
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Index for company name lookups
CREATE INDEX idx_company_reviews_company_name ON public.company_reviews (company_name);

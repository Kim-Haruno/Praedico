
-- Add employer_approved column to profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS employer_approved boolean NOT NULL DEFAULT false;

-- Create job_type enum
DO $$ BEGIN
  CREATE TYPE public.job_type AS ENUM ('Full-time', 'Part-time', 'Hybrid');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- Create job_status enum
DO $$ BEGIN
  CREATE TYPE public.job_status AS ENUM ('pending', 'approved', 'rejected');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- Create jobs table
CREATE TABLE public.jobs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  employer_id uuid NOT NULL,
  title text NOT NULL,
  company text NOT NULL,
  location text NOT NULL,
  salary text NOT NULL,
  type public.job_type NOT NULL DEFAULT 'Full-time',
  description text NOT NULL,
  requirements text[] NOT NULL DEFAULT '{}',
  benefits text[] NOT NULL DEFAULT '{}',
  status public.job_status NOT NULL DEFAULT 'pending',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;

-- Anyone can view approved jobs
CREATE POLICY "Anyone can view approved jobs"
  ON public.jobs FOR SELECT
  USING (status = 'approved');

-- Employers can see their own jobs (any status)
CREATE POLICY "Employers can view own jobs"
  ON public.jobs FOR SELECT
  TO authenticated
  USING (auth.uid() = employer_id);

-- Employers can insert jobs
CREATE POLICY "Employers can insert jobs"
  ON public.jobs FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = employer_id
    AND public.has_role(auth.uid(), 'employer')
  );

-- Employers can update their own pending jobs
CREATE POLICY "Employers can update own pending jobs"
  ON public.jobs FOR UPDATE
  TO authenticated
  USING (auth.uid() = employer_id AND status = 'pending')
  WITH CHECK (auth.uid() = employer_id);

-- Admins can view all jobs
CREATE POLICY "Admins can view all jobs"
  ON public.jobs FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Admins can update any job (approve/reject)
CREATE POLICY "Admins can update any job"
  ON public.jobs FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Admins can delete any job
CREATE POLICY "Admins can delete any job"
  ON public.jobs FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Admins can view all profiles
CREATE POLICY "Admins can view all profiles"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Admins can update all profiles (approve employers)
CREATE POLICY "Admins can update all profiles"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Admins can view all user_roles
CREATE POLICY "Admins can view all user_roles"
  ON public.user_roles FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Updated_at trigger for jobs
CREATE TRIGGER update_jobs_updated_at
  BEFORE UPDATE ON public.jobs
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Update handle_new_user to set employer_approved
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _role public.app_role;
BEGIN
  _role := COALESCE(
    (NEW.raw_user_meta_data ->> 'role')::public.app_role,
    'job_seeker'
  );

  INSERT INTO public.profiles (user_id, full_name, role, employer_approved)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', ''),
    _role,
    CASE WHEN _role = 'job_seeker' THEN true ELSE false END
  );

  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, _role);

  RETURN NEW;
END;
$$;


-- Create job_applications table
CREATE TABLE public.job_applications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  job_id UUID NOT NULL REFERENCES public.jobs(id) ON DELETE CASCADE,
  applicant_id UUID NOT NULL,
  cover_letter TEXT,
  resume_path TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Unique constraint: one application per user per job
ALTER TABLE public.job_applications ADD CONSTRAINT unique_application UNIQUE (job_id, applicant_id);

-- Enable RLS
ALTER TABLE public.job_applications ENABLE ROW LEVEL SECURITY;

-- Job seekers can insert their own applications
CREATE POLICY "Job seekers can apply"
ON public.job_applications FOR INSERT
WITH CHECK (auth.uid() = applicant_id AND has_role(auth.uid(), 'job_seeker'::app_role));

-- Users can view their own applications
CREATE POLICY "Users can view own applications"
ON public.job_applications FOR SELECT
USING (auth.uid() = applicant_id);

-- Employers can view applications for their jobs
CREATE POLICY "Employers can view applications for own jobs"
ON public.job_applications FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.jobs
    WHERE jobs.id = job_applications.job_id
    AND jobs.employer_id = auth.uid()
  )
);

-- Admins can view all applications
CREATE POLICY "Admins can view all applications"
ON public.job_applications FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create storage bucket for resumes
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('resumes', 'resumes', false, 5242880, ARRAY['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']);

-- Storage policies: users can upload their own resumes
CREATE POLICY "Users can upload resumes"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'resumes' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Users can view their own resumes
CREATE POLICY "Users can view own resumes"
ON storage.objects FOR SELECT
USING (bucket_id = 'resumes' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Employers can view resumes for applicants to their jobs
CREATE POLICY "Employers can view applicant resumes"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'resumes' AND
  EXISTS (
    SELECT 1 FROM public.job_applications ja
    JOIN public.jobs j ON j.id = ja.job_id
    WHERE j.employer_id = auth.uid()
    AND ja.applicant_id::text = (storage.foldername(name))[1]
  )
);

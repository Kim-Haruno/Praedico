import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Upload } from "lucide-react";

interface ApplyDialogProps {
  jobId: string;
  jobTitle: string;
  children: React.ReactNode;
}

const ApplyDialog = ({ jobId, jobTitle, children }: ApplyDialogProps) => {
  const { user, userRole } = useAuth();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [coverLetter, setCoverLetter] = useState("");
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    if (!resumeFile) {
      toast({ title: "Resume required", description: "Please upload your resume.", variant: "destructive" });
      return;
    }

    setLoading(true);
    try {
      // Upload resume
      const fileExt = resumeFile.name.split(".").pop();
      const filePath = `${user.id}/${jobId}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("resumes")
        .upload(filePath, resumeFile, { upsert: true });

      if (uploadError) throw uploadError;

      // Create application record
      const { error } = await supabase.from("job_applications").insert({
        job_id: jobId,
        applicant_id: user.id,
        cover_letter: coverLetter || null,
        resume_path: filePath,
      } as any);

      if (error) {
        if (error.code === "23505") {
          toast({ title: "Already applied", description: "You have already applied to this job.", variant: "destructive" });
        } else {
          throw error;
        }
      } else {
        toast({ title: "Application sent!", description: `Your application for ${jobTitle} has been submitted.` });
        setOpen(false);
        setCoverLetter("");
        setResumeFile(null);
      }
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  if (!user || userRole !== "job_seeker") {
    return (
      <div onClick={() => toast({ title: "Sign in required", description: "Please sign in as a job seeker to apply.", variant: "destructive" })}>
        {children}
      </div>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Apply for {jobTitle}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="resume">Resume (PDF, DOC, DOCX — max 5MB) *</Label>
            <label
              htmlFor="resume"
              className="flex cursor-pointer items-center gap-2 rounded-lg border border-dashed border-border p-4 text-sm text-muted-foreground hover:bg-secondary/50 transition-colors"
            >
              <Upload className="h-4 w-4 shrink-0" />
              {resumeFile ? resumeFile.name : "Click to upload your resume"}
            </label>
            <input
              id="resume"
              type="file"
              className="hidden"
              accept=".pdf,.doc,.docx"
              onChange={(e) => setResumeFile(e.target.files?.[0] ?? null)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="cover">Cover Letter (optional)</Label>
            <Textarea
              id="cover"
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              placeholder="Tell the employer why you're a great fit..."
              rows={4}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {loading ? "Submitting..." : "Submit Application"}
          </button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ApplyDialog;

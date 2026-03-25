import { MapPin, Banknote, Clock, Bookmark, Share2, CheckCircle } from "lucide-react";
import type { Job } from "@/pages/Index";
import ApplyDialog from "@/components/ApplyDialog";

interface JobDetailProps {
  job: Job;
}

const JobDetail = ({ job }: JobDetailProps) => {
  return (
    <div className="rounded-lg border border-border bg-card p-6">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-xl font-bold text-foreground">{job.title}</h2>
          <p className="mt-1 text-base font-medium text-primary">{job.company}</p>
        </div>
        <div className="flex gap-2">
          <button className="rounded-lg border border-border p-2 text-muted-foreground hover:bg-secondary transition-colors">
            <Bookmark className="h-4 w-4" />
          </button>
          <button className="rounded-lg border border-border p-2 text-muted-foreground hover:bg-secondary transition-colors">
            <Share2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <MapPin className="h-4 w-4" />
          {job.location}
        </span>
        <span className="flex items-center gap-1.5">
          <Banknote className="h-4 w-4" />
          {job.salary}
        </span>
        <span className="flex items-center gap-1.5">
          <Clock className="h-4 w-4" />
          {job.posted}
        </span>
      </div>

      <div className="mt-4 flex gap-2">
        <span className="rounded-md bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground">
          {job.type}
        </span>
      </div>

      <ApplyDialog jobId={job.id} jobTitle={job.title}>
        <button className="mt-6 w-full rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity md:w-auto">
          Apply now
        </button>
      </ApplyDialog>

      <div className="mt-8">
        <h3 className="text-base font-semibold text-foreground">Job Description</h3>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{job.description}</p>
      </div>

      <div className="mt-6">
        <h3 className="text-base font-semibold text-foreground">Requirements</h3>
        <ul className="mt-2 space-y-2">
          {job.requirements.map((req, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
              <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-success" />
              {req}
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-6">
        <h3 className="text-base font-semibold text-foreground">Benefits</h3>
        <ul className="mt-2 space-y-2">
          {job.benefits.map((ben, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
              <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              {ben}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default JobDetail;

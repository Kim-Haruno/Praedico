import { MapPin, Clock, DollarSign } from "lucide-react";
import type { Job } from "@/pages/Index";

interface JobCardProps {
  job: Job;
  isSelected: boolean;
  onClick: () => void;
}

const JobCard = ({ job, isSelected, onClick }: JobCardProps) => {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left rounded-lg border p-5 transition-all hover:shadow-md ${
      isSelected ?
      "border-primary bg-accent shadow-md" :
      "border-border bg-card hover:border-primary/30"}`
      }>

      <h3 className="text-base font-semibold hover:underline text-primary">{job.title}</h3>
      <p className="mt-1 text-sm font-medium text-foreground">{job.company}</p>
      <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
        <span className="flex items-center gap-1">
          <MapPin className="h-3.5 w-3.5" />
          {job.location}
        </span>
        <span className="flex items-center gap-1">
          <DollarSign className="h-3.5 w-3.5" />
          {job.salary}
        </span>
      </div>
      <div className="mt-3 flex items-center gap-2">
        <span className="rounded-md bg-secondary px-2.5 py-1 text-xs font-medium text-secondary-foreground">
          {job.type}
        </span>
        <span className="flex items-center gap-1 text-xs text-muted-foreground">
          <Clock className="h-3 w-3" />
          {job.posted}
        </span>
      </div>
      <p className="mt-3 text-sm text-muted-foreground line-clamp-2">{job.description}</p>
    </button>);

};

export default JobCard;
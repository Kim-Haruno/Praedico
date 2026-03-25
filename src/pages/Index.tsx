import { useState, useMemo, useEffect } from "react";
import Header from "@/components/Header";
import HeroSearch from "@/components/HeroSearch";
import JobCard from "@/components/JobCard";
import JobDetail from "@/components/JobDetail";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";

export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  salary: string;
  type: string;
  posted: string;
  description: string;
  requirements: string[];
  benefits: string[];
}

const Index = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [selectedJobId, setSelectedJobId] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchLocation, setSearchLocation] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      const { data } = await supabase
        .from("jobs")
        .select("*")
        .eq("status", "approved" as any)
        .order("created_at", { ascending: false });

      if (data) {
        setJobs(
          data.map((j: any) => ({
            id: j.id,
            title: j.title,
            company: j.company,
            location: j.location,
            salary: j.salary,
            type: j.type,
            posted: formatPosted(j.created_at),
            description: j.description,
            requirements: j.requirements ?? [],
            benefits: j.benefits ?? [],
          }))
        );
      }
      setLoading(false);
    };
    fetchJobs();
  }, []);

  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      const q = searchQuery.toLowerCase();
      const loc = searchLocation.toLowerCase();
      const matchesQuery =
        !q ||
        job.title.toLowerCase().includes(q) ||
        job.company.toLowerCase().includes(q) ||
        job.description.toLowerCase().includes(q);
      const matchesLocation =
        !loc || job.location.toLowerCase().includes(loc);
      return matchesQuery && matchesLocation;
    });
  }, [jobs, searchQuery, searchLocation]);

  const selectedJob = filteredJobs.find((j) => j.id === selectedJobId) ?? filteredJobs[0];

  const handleSearch = (query: string, location: string) => {
    setSearchQuery(query);
    setSearchLocation(location);
    setSelectedJobId("");
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <HeroSearch onSearch={handleSearch} />

      <main className="container mx-auto flex-1 px-4 py-6">
        {loading ? (
          <p className="text-center text-muted-foreground py-16">Loading jobs...</p>
        ) : (
          <>
            <p className="mb-4 text-sm text-muted-foreground">
              {filteredJobs.length} jobs found
              {searchQuery && <> for <strong className="text-foreground">"{searchQuery}"</strong></>}
              {searchLocation && <> in <strong className="text-foreground">"{searchLocation}"</strong></>}
            </p>

            {filteredJobs.length === 0 ? (
              <div className="py-16 text-center">
                <p className="text-lg font-medium text-foreground">No jobs found</p>
                <p className="mt-1 text-sm text-muted-foreground">Try adjusting your search criteria</p>
              </div>
            ) : (
              <div className="grid gap-6 lg:grid-cols-5">
                <div className="space-y-3 lg:col-span-2 max-h-[calc(100vh-280px)] overflow-y-auto pr-1">
                  {filteredJobs.map((job) => (
                    <JobCard
                      key={job.id}
                      job={job}
                      isSelected={selectedJob?.id === job.id}
                      onClick={() => setSelectedJobId(job.id)}
                    />
                  ))}
                </div>
                <div className="hidden lg:col-span-3 lg:block max-h-[calc(100vh-280px)] overflow-y-auto">
                  {selectedJob && <JobDetail job={selectedJob} />}
                </div>
              </div>
            )}
          </>
        )}
      </main>

      <Footer />
    </div>
  );
};

function formatPosted(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return "Just posted";
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days === 1) return "1 day ago";
  if (days < 7) return `${days} days ago`;
  const weeks = Math.floor(days / 7);
  return weeks === 1 ? "1 week ago" : `${weeks} weeks ago`;
}

export default Index;

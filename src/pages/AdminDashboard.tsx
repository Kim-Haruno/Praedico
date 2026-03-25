import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle, XCircle, Trash2 } from "lucide-react";

interface PendingEmployer {
  id: string;
  user_id: string;
  full_name: string;
  role: string;
  employer_approved: boolean;
  created_at: string;
}

interface JobListing {
  id: string;
  title: string;
  company: string;
  location: string;
  salary: string;
  type: string;
  status: string;
  created_at: string;
  description: string;
}

const AdminDashboard = () => {
  const { user, userRole, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [employers, setEmployers] = useState<PendingEmployer[]>([]);
  const [jobs, setJobs] = useState<JobListing[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && userRole !== "admin") {
      navigate("/");
    }
  }, [authLoading, userRole, navigate]);

  useEffect(() => {
    if (userRole === "admin") {
      fetchData();
    }
  }, [userRole]);

  const fetchData = async () => {
    setLoading(true);
    const [employerRes, jobRes] = await Promise.all([
      supabase
        .from("profiles")
        .select("*")
        .eq("role", "employer" as any)
        .order("created_at", { ascending: false }),
      supabase
        .from("jobs")
        .select("*")
        .order("created_at", { ascending: false }),
    ]);
    setEmployers((employerRes.data as any) ?? []);
    setJobs((jobRes.data as any) ?? []);
    setLoading(false);
  };

  const approveEmployer = async (profileId: string) => {
    const { error } = await supabase
      .from("profiles")
      .update({ employer_approved: true })
      .eq("id", profileId);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Employer approved" });
      fetchData();
    }
  };

  const declineEmployer = async (profileId: string) => {
    const { error } = await supabase
      .from("profiles")
      .update({ employer_approved: false })
      .eq("id", profileId);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Employer declined" });
      fetchData();
    }
  };

  const approveJob = async (jobId: string) => {
    const { error } = await supabase
      .from("jobs")
      .update({ status: "approved" as any })
      .eq("id", jobId);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Job approved" });
      fetchData();
    }
  };

  const rejectJob = async (jobId: string) => {
    const { error } = await supabase
      .from("jobs")
      .update({ status: "rejected" as any })
      .eq("id", jobId);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Job rejected" });
      fetchData();
    }
  };

  const deleteJob = async (jobId: string) => {
    const { error } = await supabase.from("jobs").delete().eq("id", jobId);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Job deleted" });
      fetchData();
    }
  };

  if (authLoading || loading) {
    return (
      <div className="flex min-h-screen flex-col bg-background">
        <Header />
        <main className="flex flex-1 items-center justify-center">
          <p className="text-muted-foreground">Loading...</p>
        </main>
        <Footer />
      </div>
    );
  }

  if (userRole !== "admin") return null;

  const pendingEmployers = employers.filter((e) => !e.employer_approved);
  const approvedEmployers = employers.filter((e) => e.employer_approved);
  const pendingJobs = jobs.filter((j) => j.status === "pending");
  const approvedJobs = jobs.filter((j) => j.status === "approved");

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="container mx-auto flex-1 px-4 py-8">
        <h1 className="mb-6 text-2xl font-bold text-foreground">Admin Dashboard</h1>

        <Tabs defaultValue="employers">
          <TabsList className="mb-6">
            <TabsTrigger value="employers">
              Employers {pendingEmployers.length > 0 && <span className="ml-1.5 rounded-full bg-destructive px-2 py-0.5 text-xs text-destructive-foreground">{pendingEmployers.length}</span>}
            </TabsTrigger>
            <TabsTrigger value="jobs">
              Job Listings {pendingJobs.length > 0 && <span className="ml-1.5 rounded-full bg-destructive px-2 py-0.5 text-xs text-destructive-foreground">{pendingJobs.length}</span>}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="employers">
            <h2 className="mb-3 text-lg font-semibold text-foreground">Pending Approval</h2>
            {pendingEmployers.length === 0 ? (
              <p className="text-sm text-muted-foreground">No pending employer requests.</p>
            ) : (
              <div className="space-y-3 mb-8">
                {pendingEmployers.map((emp) => (
                  <div key={emp.id} className="flex items-center justify-between rounded-lg border bg-card p-4">
                    <div>
                      <p className="font-medium text-foreground">{emp.full_name || "Unnamed"}</p>
                      <p className="text-xs text-muted-foreground">Joined {new Date(emp.created_at).toLocaleDateString()}</p>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => approveEmployer(emp.id)} className="flex items-center gap-1 rounded-lg bg-success px-3 py-1.5 text-xs font-medium text-success-foreground hover:opacity-90 transition-opacity">
                        <CheckCircle className="h-3.5 w-3.5" /> Approve
                      </button>
                      <button onClick={() => declineEmployer(emp.id)} className="flex items-center gap-1 rounded-lg bg-destructive px-3 py-1.5 text-xs font-medium text-destructive-foreground hover:opacity-90 transition-opacity">
                        <XCircle className="h-3.5 w-3.5" /> Decline
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <h2 className="mb-3 text-lg font-semibold text-foreground">Approved Employers</h2>
            {approvedEmployers.length === 0 ? (
              <p className="text-sm text-muted-foreground">No approved employers yet.</p>
            ) : (
              <div className="space-y-3">
                {approvedEmployers.map((emp) => (
                  <div key={emp.id} className="flex items-center justify-between rounded-lg border bg-card p-4">
                    <div>
                      <p className="font-medium text-foreground">{emp.full_name || "Unnamed"}</p>
                      <p className="text-xs text-muted-foreground">Joined {new Date(emp.created_at).toLocaleDateString()}</p>
                    </div>
                    <span className="rounded-md bg-success/10 px-2.5 py-1 text-xs font-medium text-success">Approved</span>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="jobs">
            <h2 className="mb-3 text-lg font-semibold text-foreground">Pending Jobs</h2>
            {pendingJobs.length === 0 ? (
              <p className="text-sm text-muted-foreground">No pending job listings.</p>
            ) : (
              <div className="space-y-3 mb-8">
                {pendingJobs.map((job) => (
                  <div key={job.id} className="rounded-lg border bg-card p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-medium text-foreground">{job.title}</p>
                        <p className="text-sm text-muted-foreground">{job.company} · {job.location}</p>
                        <p className="text-sm text-muted-foreground">{job.salary} · {job.type}</p>
                        <p className="mt-1 text-xs text-muted-foreground line-clamp-2">{job.description}</p>
                      </div>
                      <div className="flex gap-2 shrink-0 ml-4">
                        <button onClick={() => approveJob(job.id)} className="flex items-center gap-1 rounded-lg bg-success px-3 py-1.5 text-xs font-medium text-success-foreground hover:opacity-90 transition-opacity">
                          <CheckCircle className="h-3.5 w-3.5" /> Approve
                        </button>
                        <button onClick={() => rejectJob(job.id)} className="flex items-center gap-1 rounded-lg bg-destructive px-3 py-1.5 text-xs font-medium text-destructive-foreground hover:opacity-90 transition-opacity">
                          <XCircle className="h-3.5 w-3.5" /> Reject
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <h2 className="mb-3 text-lg font-semibold text-foreground">Approved Jobs</h2>
            {approvedJobs.length === 0 ? (
              <p className="text-sm text-muted-foreground">No approved job listings.</p>
            ) : (
              <div className="space-y-3">
                {approvedJobs.map((job) => (
                  <div key={job.id} className="flex items-start justify-between rounded-lg border bg-card p-4">
                    <div>
                      <p className="font-medium text-foreground">{job.title}</p>
                      <p className="text-sm text-muted-foreground">{job.company} · {job.location}</p>
                      <p className="text-sm text-muted-foreground">{job.salary} · {job.type}</p>
                    </div>
                    <button onClick={() => deleteJob(job.id)} className="flex items-center gap-1 rounded-lg border border-destructive/30 px-3 py-1.5 text-xs font-medium text-destructive hover:bg-destructive hover:text-destructive-foreground transition-colors">
                      <Trash2 className="h-3.5 w-3.5" /> Delete
                    </button>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>
      <Footer />
    </div>
  );
};

export default AdminDashboard;

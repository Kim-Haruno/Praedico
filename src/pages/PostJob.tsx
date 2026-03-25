import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

const PostJob = () => {
  const { user, userRole } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const [title, setTitle] = useState("");
  const [company, setCompany] = useState("");
  const [city, setCity] = useState("");
  const [location, setLocation] = useState("");
  const [salary, setSalary] = useState("");
  const [type, setType] = useState<"Full-time" | "Part-time" | "Hybrid">("Full-time");
  const [description, setDescription] = useState("");
  const [requirements, setRequirements] = useState("");
  const [benefits, setBenefits] = useState("");

  if (!user || userRole !== "employer") {
    return (
      <div className="flex min-h-screen flex-col bg-background">
        <Header />
        <main className="flex flex-1 items-center justify-center">
          <p className="text-muted-foreground">Only approved employers can post jobs.</p>
        </main>
        <Footer />
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.from("jobs").insert({
        employer_id: user.id,
        title,
        company,
        location: location === "Remote (SA)" ? location : `${city}, ${location.match(/\(([^)]+)\)/)?.[1] || location}`,
        salary: `R${salary}`,
        type,
        description,
        requirements: requirements.split("\n").filter(Boolean),
        benefits: benefits.split("\n").filter(Boolean),
      });

      if (error) throw error;

      toast({
        title: "Job submitted",
        description: "Your listing is pending admin approval.",
      });
      navigate("/");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="container mx-auto flex-1 px-4 py-8">
        <div className="mx-auto max-w-2xl">
          <h1 className="mb-2 text-2xl font-bold text-foreground">Post a Job</h1>
          <p className="mb-6 text-sm text-muted-foreground">
            Fill in the details below. Your listing will be reviewed by an admin before going live.
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="title">Position Title *</Label>
              <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Senior Frontend Developer" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="company">Company Name *</Label>
              <Input id="company" value={company} onChange={(e) => setCompany(e.target.value)} placeholder="e.g. TechFlow Inc." required />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="city">City / Town *</Label>
                  <Input id="city" value={city} onChange={(e) => setCity(e.target.value)} placeholder="e.g. Cape Town" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Province *</Label>
                  <Select value={location} onValueChange={(v) => setLocation(v)} required>
                    <SelectTrigger id="location">
                      <SelectValue placeholder="Select a province" />
                    </SelectTrigger>
                    <SelectContent>
                    <SelectItem value="Eastern Cape (EC)">Eastern Cape (EC)</SelectItem>
                    <SelectItem value="Free State (FS)">Free State (FS)</SelectItem>
                    <SelectItem value="Gauteng (GP)">Gauteng (GP)</SelectItem>
                    <SelectItem value="KwaZulu-Natal (KZN)">KwaZulu-Natal (KZN)</SelectItem>
                    <SelectItem value="Limpopo (LP)">Limpopo (LP)</SelectItem>
                    <SelectItem value="Mpumalanga (MP)">Mpumalanga (MP)</SelectItem>
                    <SelectItem value="Northern Cape (NC)">Northern Cape (NC)</SelectItem>
                    <SelectItem value="North West (NW)">North West (NW)</SelectItem>
                    <SelectItem value="Western Cape (WC)">Western Cape (WC)</SelectItem>
                    <SelectItem value="Remote (SA)">Remote (SA)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="salary">Expected Salary (Rands) *</Label>
                <Input id="salary" value={salary} onChange={(e) => setSalary(e.target.value)} placeholder="e.g. 30,000 - 50,000 per month" required />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Job Type *</Label>
              <Select value={type} onValueChange={(v) => setType(v as any)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Full-time">Full-time</SelectItem>
                  <SelectItem value="Part-time">Part-time</SelectItem>
                  <SelectItem value="Hybrid">Hybrid</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Job Description *</Label>
              <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Describe the role, responsibilities, and what makes it great..." rows={5} required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="requirements">Requirements (one per line)</Label>
              <Textarea id="requirements" value={requirements} onChange={(e) => setRequirements(e.target.value)} placeholder={"5+ years React experience\nStrong TypeScript skills\nExcellent communication"} rows={4} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="benefits">Benefits (one per line)</Label>
              <Textarea id="benefits" value={benefits} onChange={(e) => setBenefits(e.target.value)} placeholder={"Medical aid\nRemote work options\nAnnual bonus"} rows={4} />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {loading ? "Submitting..." : "Submit for approval"}
            </button>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PostJob;

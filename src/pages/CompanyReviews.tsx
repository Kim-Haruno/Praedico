import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useToast } from "@/hooks/use-toast";
import { Star, Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface CompanyReview {
  id: string;
  company_name: string;
  job_title: string;
  employment_status: string;
  overall_rating: number;
  culture_rating: number;
  salary_rating: number;
  management_rating: number;
  work_life_balance_rating: number;
  pros: string;
  cons: string;
  created_at: string;
  user_id: string;
}

const StarRating = ({
  value,
  onChange,
  readonly = false,
  size = "h-5 w-5",
}: {
  value: number;
  onChange?: (v: number) => void;
  readonly?: boolean;
  size?: string;
}) => (
  <div className="flex gap-0.5">
    {[1, 2, 3, 4, 5].map((star) => (
      <Star
        key={star}
        className={`${size} ${
          star <= value
            ? "fill-primary text-primary"
            : "fill-muted text-muted-foreground/30"
        } ${!readonly ? "cursor-pointer hover:scale-110 transition-transform" : ""}`}
        onClick={() => !readonly && onChange?.(star)}
      />
    ))}
  </div>
);

const RatingBar = ({ label, value }: { label: string; value: number }) => (
  <div className="flex items-center justify-between gap-3">
    <span className="text-xs text-muted-foreground w-28 shrink-0">{label}</span>
    <StarRating value={value} readonly size="h-3.5 w-3.5" />
    <span className="text-xs font-medium text-foreground w-6 text-right">
      {value.toFixed(1)}
    </span>
  </div>
);

const CompanyReviews = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [reviews, setReviews] = useState<CompanyReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    company_name: "",
    job_title: "",
    employment_status: "Current",
    overall_rating: 0,
    culture_rating: 0,
    salary_rating: 0,
    management_rating: 0,
    work_life_balance_rating: 0,
    pros: "",
    cons: "",
  });

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    const { data, error } = await supabase
      .from("company_reviews")
      .select("*")
      .order("created_at", { ascending: false });
    if (!error) setReviews(data ?? []);
    setLoading(false);
  };

  const handleSubmit = async () => {
    if (!user) {
      toast({ title: "Please sign in to submit a review", variant: "destructive" });
      return;
    }
    if (
      !form.company_name.trim() ||
      !form.job_title.trim() ||
      !form.pros.trim() ||
      !form.cons.trim() ||
      form.overall_rating === 0 ||
      form.culture_rating === 0 ||
      form.salary_rating === 0 ||
      form.management_rating === 0 ||
      form.work_life_balance_rating === 0
    ) {
      toast({ title: "Please fill in all fields and ratings", variant: "destructive" });
      return;
    }
    setSubmitting(true);
    const { error } = await supabase.from("company_reviews").insert({
      user_id: user.id,
      company_name: form.company_name.trim(),
      job_title: form.job_title.trim(),
      employment_status: form.employment_status,
      overall_rating: form.overall_rating,
      culture_rating: form.culture_rating,
      salary_rating: form.salary_rating,
      management_rating: form.management_rating,
      work_life_balance_rating: form.work_life_balance_rating,
      pros: form.pros.trim(),
      cons: form.cons.trim(),
    });
    setSubmitting(false);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Review submitted!" });
      setDialogOpen(false);
      setForm({
        company_name: "",
        job_title: "",
        employment_status: "Current",
        overall_rating: 0,
        culture_rating: 0,
        salary_rating: 0,
        management_rating: 0,
        work_life_balance_rating: 0,
        pros: "",
        cons: "",
      });
      fetchReviews();
    }
  };

  // Group reviews by company
  const filtered = reviews.filter((r) =>
    r.company_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const grouped = filtered.reduce<Record<string, CompanyReview[]>>((acc, r) => {
    const key = r.company_name.toLowerCase();
    if (!acc[key]) acc[key] = [];
    acc[key].push(r);
    return acc;
  }, {});

  const companies = Object.entries(grouped).map(([, revs]) => {
    const avg = (field: keyof CompanyReview) =>
      revs.reduce((s, r) => s + (r[field] as number), 0) / revs.length;
    return {
      name: revs[0].company_name,
      reviews: revs,
      overall: avg("overall_rating"),
      culture: avg("culture_rating"),
      salary: avg("salary_rating"),
      management: avg("management_rating"),
      workLife: avg("work_life_balance_rating"),
    };
  });

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="container mx-auto flex-1 px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-foreground">Company Reviews</h1>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <button className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90 transition-opacity">
                <Plus className="h-4 w-4" /> Write a Review
              </button>
            </DialogTrigger>
            <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Write a Company Review</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 mt-2">
                <div>
                  <Label>Company Name</Label>
                  <Input
                    value={form.company_name}
                    onChange={(e) => setForm({ ...form, company_name: e.target.value })}
                    maxLength={100}
                    placeholder="e.g. Acme Corp"
                  />
                </div>
                <div>
                  <Label>Your Job Title</Label>
                  <Input
                    value={form.job_title}
                    onChange={(e) => setForm({ ...form, job_title: e.target.value })}
                    maxLength={100}
                    placeholder="e.g. Software Engineer"
                  />
                </div>
                <div>
                  <Label>Employment Status</Label>
                  <Select
                    value={form.employment_status}
                    onValueChange={(v) => setForm({ ...form, employment_status: v })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Current">Current Employee</SelectItem>
                      <SelectItem value="Former">Former Employee</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Overall Rating</Label>
                  <StarRating value={form.overall_rating} onChange={(v) => setForm({ ...form, overall_rating: v })} />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label className="text-xs">Culture</Label>
                    <StarRating value={form.culture_rating} onChange={(v) => setForm({ ...form, culture_rating: v })} size="h-4 w-4" />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Salary & Benefits</Label>
                    <StarRating value={form.salary_rating} onChange={(v) => setForm({ ...form, salary_rating: v })} size="h-4 w-4" />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Management</Label>
                    <StarRating value={form.management_rating} onChange={(v) => setForm({ ...form, management_rating: v })} size="h-4 w-4" />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Work-Life Balance</Label>
                    <StarRating value={form.work_life_balance_rating} onChange={(v) => setForm({ ...form, work_life_balance_rating: v })} size="h-4 w-4" />
                  </div>
                </div>
                <div>
                  <Label>Pros</Label>
                  <Textarea
                    value={form.pros}
                    onChange={(e) => setForm({ ...form, pros: e.target.value })}
                    maxLength={1000}
                    placeholder="What do you like about this company?"
                    rows={3}
                  />
                </div>
                <div>
                  <Label>Cons</Label>
                  <Textarea
                    value={form.cons}
                    onChange={(e) => setForm({ ...form, cons: e.target.value })}
                    maxLength={1000}
                    placeholder="What could be improved?"
                    rows={3}
                  />
                </div>
                <button
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="w-full rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                  {submitting ? "Submitting..." : "Submit Review"}
                </button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <Input
          placeholder="Search companies..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="mb-6 max-w-sm"
        />

        {loading ? (
          <p className="text-muted-foreground">Loading reviews...</p>
        ) : companies.length === 0 ? (
          <p className="text-muted-foreground">No reviews yet. Be the first to write one!</p>
        ) : (
          <div className="space-y-6">
            {companies.map((company) => (
              <div key={company.name} className="rounded-lg border bg-card p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h2 className="text-lg font-semibold text-foreground">{company.name}</h2>
                    <div className="flex items-center gap-2 mt-1">
                      <StarRating value={Math.round(company.overall)} readonly size="h-4 w-4" />
                      <span className="text-sm font-medium text-foreground">
                        {company.overall.toFixed(1)}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        ({company.reviews.length} review{company.reviews.length !== 1 ? "s" : ""})
                      </span>
                    </div>
                  </div>
                  <div className="space-y-1 hidden sm:block">
                    <RatingBar label="Culture" value={company.culture} />
                    <RatingBar label="Salary & Benefits" value={company.salary} />
                    <RatingBar label="Management" value={company.management} />
                    <RatingBar label="Work-Life Balance" value={company.workLife} />
                  </div>
                </div>

                <div className="space-y-4">
                  {company.reviews.map((review) => (
                    <div key={review.id} className="border-t pt-4">
                      <div className="flex items-center gap-2 mb-2">
                        <StarRating value={review.overall_rating} readonly size="h-3.5 w-3.5" />
                        <span className="text-sm font-medium text-foreground">{review.job_title}</span>
                        <span className="text-xs text-muted-foreground">
                          · {review.employment_status} Employee ·{" "}
                          {new Date(review.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="grid gap-2 sm:grid-cols-2">
                        <div>
                          <p className="text-xs font-medium text-success mb-1">Pros</p>
                          <p className="text-sm text-foreground">{review.pros}</p>
                        </div>
                        <div>
                          <p className="text-xs font-medium text-destructive mb-1">Cons</p>
                          <p className="text-sm text-foreground">{review.cons}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default CompanyReviews;

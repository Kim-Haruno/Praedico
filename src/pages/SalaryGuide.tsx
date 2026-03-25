import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Banknote } from "lucide-react";

interface SalaryEntry {
  title: string;
  category: string;
  minSalary: number;
  maxSalary: number;
  median: number;
}

const salaryData: SalaryEntry[] = [
  // Technology
  { title: "Junior Software Engineer (0-2 yrs)", category: "Technology", minSalary: 240000, maxSalary: 420000, median: 300000 },
  { title: "Software Engineer (3-5 yrs)", category: "Technology", minSalary: 420000, maxSalary: 850000, median: 600000 },
  { title: "Senior Software Engineer (5+ yrs)", category: "Technology", minSalary: 850000, maxSalary: 1800000, median: 1200000 },
  
  { title: "Junior Frontend Developer (0-2 yrs)", category: "Technology", minSalary: 220000, maxSalary: 400000, median: 280000 },
  { title: "Frontend Developer (3-5 yrs)", category: "Technology", minSalary: 400000, maxSalary: 800000, median: 550000 },
  { title: "Senior Frontend Developer (5+ yrs)", category: "Technology", minSalary: 800000, maxSalary: 1600000, median: 1100000 },
  
  { title: "Junior Backend Developer (0-2 yrs)", category: "Technology", minSalary: 240000, maxSalary: 420000, median: 300000 },
  { title: "Backend Developer (3-5 yrs)", category: "Technology", minSalary: 450000, maxSalary: 900000, median: 650000 },
  { title: "Senior Backend Developer (5+ yrs)", category: "Technology", minSalary: 900000, maxSalary: 1900000, median: 1250000 },
  
  { title: "Data Scientist (0-2 yrs)", category: "Technology", minSalary: 360000, maxSalary: 600000, median: 450000 },
  { title: "Senior Data Scientist (5+ yrs)", category: "Technology", minSalary: 800000, maxSalary: 1800000, median: 1200000 },

  { title: "DevOps Engineer (0-2 yrs)", category: "Technology", minSalary: 300000, maxSalary: 600000, median: 450000 },
  { title: "Senior DevOps Engineer (5+ yrs)", category: "Technology", minSalary: 850000, maxSalary: 1800000, median: 1300000 },

  { title: "Product Manager (3-5 yrs)", category: "Technology", minSalary: 500000, maxSalary: 950000, median: 700000 },
  { title: "Senior Product Manager (5+ yrs)", category: "Technology", minSalary: 950000, maxSalary: 1800000, median: 1300000 },

  { title: "UX Designer (0-2 yrs)", category: "Technology", minSalary: 200000, maxSalary: 400000, median: 280000 },
  { title: "Senior UX Designer (5+ yrs)", category: "Technology", minSalary: 600000, maxSalary: 1200000, median: 850000 },

  // Finance
  { title: "Financial Analyst (0-2 yrs)", category: "Finance", minSalary: 240000, maxSalary: 420000, median: 300000 },
  { title: "Senior Financial Analyst (5+ yrs)", category: "Finance", minSalary: 600000, maxSalary: 1200000, median: 850000 },
  
  { title: "Accountant (0-2 yrs)", category: "Finance", minSalary: 200000, maxSalary: 350000, median: 240000 },
  { title: "Senior Accountant (5+ yrs)", category: "Finance", minSalary: 500000, maxSalary: 900000, median: 650000 },
  
  { title: "Investment Banker (1-3 yrs)", category: "Finance", minSalary: 600000, maxSalary: 1200000, median: 850000 },
  { title: "VP Investment Banking (5+ yrs)", category: "Finance", minSalary: 1500000, maxSalary: 3500000, median: 2200000 },
  { title: "Risk Analyst (3-5 yrs)", category: "Finance", minSalary: 400000, maxSalary: 900000, median: 650000 },
  
  // Marketing
  { title: "Marketing Manager (3-5 yrs)", category: "Marketing", minSalary: 350000, maxSalary: 750000, median: 500000 },
  { title: "Senior Marketing Manager (5+ yrs)", category: "Marketing", minSalary: 700000, maxSalary: 1400000, median: 950000 },
  { title: "Content Strategist (0-2 yrs)", category: "Marketing", minSalary: 180000, maxSalary: 360000, median: 240000 },
  { title: "Content Strategist (5+ yrs)", category: "Marketing", minSalary: 450000, maxSalary: 900000, median: 650000 },
  { title: "SEO Specialist (0-3 yrs)", category: "Marketing", minSalary: 180000, maxSalary: 350000, median: 240000 },
  
  // Healthcare
  { title: "Registered Nurse (0-2 yrs)", category: "Healthcare", minSalary: 200000, maxSalary: 320000, median: 260000 },
  { title: "Registered Nurse (5+ yrs)", category: "Healthcare", minSalary: 350000, maxSalary: 600000, median: 450000 },
  { title: "Physician Assistant", category: "Healthcare", minSalary: 300000, maxSalary: 600000, median: 450000 },
  { title: "Medical Lab Technician", category: "Healthcare", minSalary: 200000, maxSalary: 450000, median: 300000 },
  
  // Engineering
  { title: "Junior Mechanical Engineer (0-2 yrs)", category: "Engineering", minSalary: 250000, maxSalary: 450000, median: 320000 },
  { title: "Mechanical Engineer (5+ yrs)", category: "Engineering", minSalary: 600000, maxSalary: 1200000, median: 850000 },
  { title: "Junior Civil Engineer (0-2 yrs)", category: "Engineering", minSalary: 250000, maxSalary: 450000, median: 320000 },
  { title: "Civil Engineer (5+ yrs)", category: "Engineering", minSalary: 600000, maxSalary: 1200000, median: 850000 },
  { title: "Junior Electrical Engineer (0-2 yrs)", category: "Engineering", minSalary: 280000, maxSalary: 480000, median: 340000 },
  { title: "Electrical Engineer (5+ yrs)", category: "Engineering", minSalary: 650000, maxSalary: 1400000, median: 900000 },
];

const categories = [...new Set(salaryData.map((s) => s.category))];

const fmt = (n: number) =>
  "R" + n.toLocaleString("en-US");

const SalaryGuide = () => {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filtered = salaryData.filter((s) => {
    const matchesSearch = s.title.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = !selectedCategory || s.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="container mx-auto flex-1 px-4 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-foreground">Salary Guide</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Explore salary ranges across industries and roles to help you negotiate better.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <Input
            placeholder="Search job titles..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-sm"
          />
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                !selectedCategory
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground hover:bg-accent"
              }`}
            >
              All
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat === selectedCategory ? null : cat)}
                className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                  selectedCategory === cat
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-secondary-foreground hover:bg-accent"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {filtered.length === 0 ? (
          <p className="text-muted-foreground">No results found.</p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((entry) => (
              <div
                key={entry.title}
                className="rounded-lg border bg-card p-5 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent">
                    <Banknote className="h-4 w-4 text-accent-foreground" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-semibold text-foreground truncate">{entry.title}</h3>
                    <p className="text-xs text-muted-foreground">{entry.category}</p>
                  </div>
                </div>
                <div className="mt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Median</span>
                    <span className="font-semibold text-primary">{fmt(entry.median)}</span>
                  </div>
                  <div className="relative h-2 rounded-full bg-muted">
                    <div
                      className="absolute h-2 rounded-full bg-primary/30"
                      style={{
                        left: "0%",
                        width: "100%",
                      }}
                    />
                    <div
                      className="absolute top-1/2 -translate-y-1/2 h-3 w-3 rounded-full bg-primary border-2 border-card"
                      style={{
                        left: `${((entry.median - entry.minSalary) / (entry.maxSalary - entry.minSalary)) * 100}%`,
                      }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{fmt(entry.minSalary)}</span>
                    <span>{fmt(entry.maxSalary)}</span>
                  </div>
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

export default SalaryGuide;

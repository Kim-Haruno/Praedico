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

export const mockJobs: Job[] = [
  {
    id: "1",
    title: "Senior Frontend Developer",
    company: "TechFlow Inc.",
    location: "Cape Town, WC",
    salary: "R130,000 - R170,000 a year",
    type: "Full-time",
    posted: "Just posted",
    description:
      "We are looking for a Senior Frontend Developer to join our growing team. You will be responsible for building and maintaining our web applications using React and TypeScript.",
    requirements: [
      "5+ years of experience with React",
      "Strong TypeScript skills",
      "Experience with modern CSS frameworks",
      "Excellent communication skills",
    ],
    benefits: [
      "Health insurance",
      "401(k) matching",
      "Remote work options",
      "Unlimited PTO",
    ],
  },
  {
    id: "2",
    title: "Product Manager",
    company: "InnovateCo",
    location: "Johannesburg, GP",
    salary: "R110,000 - R145,000 a year",
    type: "Full-time",
    posted: "1 day ago",
    description:
      "InnovateCo is seeking an experienced Product Manager to lead our flagship product. You'll work closely with engineering, design, and marketing teams.",
    requirements: [
      "3+ years of product management experience",
      "Strong analytical skills",
      "Experience with agile methodologies",
      "MBA preferred",
    ],
    benefits: [
      "Competitive salary",
      "Stock options",
      "Health & dental",
      "Gym membership",
    ],
  },
  {
    id: "3",
    title: "UX Designer",
    company: "DesignHub",
    location: "Remote (SA)",
    salary: "R90,000 - R120,000 a year",
    type: "Full-time",
    posted: "2 days ago",
    description:
      "Join DesignHub as a UX Designer and help shape the future of our design platform. You'll conduct user research, create wireframes, and deliver pixel-perfect designs.",
    requirements: [
      "Portfolio demonstrating UX expertise",
      "Proficiency in Figma",
      "Experience with user research",
      "Strong visual design skills",
    ],
    benefits: [
      "Fully remote",
      "Creative freedom",
      "Learning budget",
      "Flexible hours",
    ],
  },
  {
    id: "4",
    title: "Data Analyst",
    company: "DataDriven LLC",
    location: "Pretoria, GP",
    salary: "R75,000 - R95,000 a year",
    type: "Full-time",
    posted: "3 days ago",
    description:
      "DataDriven LLC is looking for a Data Analyst to help transform raw data into actionable business insights. You'll work with SQL, Python, and visualization tools.",
    requirements: [
      "Proficiency in SQL and Python",
      "Experience with Tableau or Power BI",
      "Strong statistical knowledge",
      "Attention to detail",
    ],
    benefits: [
      "Hybrid schedule",
      "Professional development",
      "Health insurance",
      "Annual bonus",
    ],
  },
  {
    id: "5",
    title: "Marketing Coordinator",
    company: "BrightBrand Agency",
    location: "Durban, KZN",
    salary: "R50,000 - R65,000 a year",
    type: "Full-time",
    posted: "5 days ago",
    description:
      "BrightBrand Agency seeks a Marketing Coordinator to support our digital marketing campaigns. You'll manage social media, email campaigns, and content creation.",
    requirements: [
      "1-2 years marketing experience",
      "Familiarity with social media platforms",
      "Strong writing skills",
      "Experience with email marketing tools",
    ],
    benefits: [
      "Creative environment",
      "Growth opportunities",
      "Team outings",
      "Health coverage",
    ],
  },
  {
    id: "6",
    title: "DevOps Engineer",
    company: "CloudScale Systems",
    location: "Stellenbosch, WC",
    salary: "R140,000 - R180,000 a year",
    type: "Full-time",
    posted: "1 week ago",
    description:
      "CloudScale Systems needs a DevOps Engineer to manage and improve our cloud infrastructure. Experience with AWS, Docker, and Kubernetes is essential.",
    requirements: [
      "Experience with AWS/GCP/Azure",
      "Docker and Kubernetes expertise",
      "CI/CD pipeline management",
      "Scripting in Bash/Python",
    ],
    benefits: [
      "Top-tier salary",
      "Stock options",
      "Remote-first",
      "Conference budget",
    ],
  },
];

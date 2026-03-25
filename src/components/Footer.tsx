import { Briefcase } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="border-t bg-card py-8">
      <div className="container mx-auto px-4">
        <div className="grid gap-8 md:grid-cols-4">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Briefcase className="h-5 w-5 text-primary" />
              <span className="font-bold text-foreground">​PRÆDICŌ</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Connecting talent with opportunity. Find your dream job today.
            </p>
          </div>
          <div>
            <h4 className="mb-3 text-sm font-semibold text-foreground">For Job Seekers</h4>
            <ul className="space-y-2 text-sm text-muted-foreground flex flex-col">
              <li><Link to="/" className="hover:text-foreground transition-colors">Browse Jobs</Link></li>
              <li><Link to="/salary-guide" className="hover:text-foreground transition-colors">Salary Tools</Link></li>
              <li><Link to="/career-advice" className="hover:text-foreground transition-colors">Career Advice</Link></li>
              <li><Link to="/resume-help" className="hover:text-foreground transition-colors">Resume Help</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="mb-3 text-sm font-semibold text-foreground">For Employers</h4>
            <ul className="space-y-2 text-sm text-muted-foreground flex flex-col">
              <li><Link to="/post-job" className="hover:text-foreground transition-colors">Post a Job</Link></li>
              <li><Link to="/pricing" className="hover:text-foreground transition-colors">Pricing</Link></li>
              <li><Link to="/products" className="hover:text-foreground transition-colors">Products</Link></li>
              <li><Link to="/resources" className="hover:text-foreground transition-colors">Resources</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="mb-3 text-sm font-semibold text-foreground">Company</h4>
            <ul className="space-y-2 text-sm text-muted-foreground flex flex-col">
              <li><Link to="/about" className="hover:text-foreground transition-colors">About</Link></li>
              <li><Link to="/contact" className="hover:text-foreground transition-colors">Contact</Link></li>
              <li><Link to="/privacy" className="hover:text-foreground transition-colors">Privacy</Link></li>
              <li><Link to="/terms" className="hover:text-foreground transition-colors">Terms</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t pt-4 text-center text-xs text-muted-foreground">
          © 2026 Website. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
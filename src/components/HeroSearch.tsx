import { Search, MapPin } from "lucide-react";
import { useState } from "react";

interface HeroSearchProps {
  onSearch: (query: string, location: string) => void;
}

const HeroSearch = ({ onSearch }: HeroSearchProps) => {
  const [query, setQuery] = useState("");
  const [location, setLocation] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query, location);
  };

  return (
    <div className="py-12 px-4 bg-primary">
      <div className="container mx-auto max-w-4xl">
        <h1 className="mb-6 text-center text-3xl font-bold text-hero-foreground md:text-4xl">
          Find your next opportunity
        </h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3 md:flex-row">
          <div className="flex flex-1 items-center gap-2 rounded-lg bg-card px-4 py-3 shadow-sm">
            <Search className="h-5 w-5 text-muted-foreground shrink-0" />
            <input
              type="text"
              placeholder="Job title, keywords, or company"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none" />

          </div>
          <div className="flex flex-1 items-center gap-2 rounded-lg bg-card px-4 py-3 shadow-sm">
            <MapPin className="h-5 w-5 text-muted-foreground shrink-0" />
            <input
              type="text"
              placeholder="City, province, or remote"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none" />

          </div>
          <button
            type="submit"
            className="rounded-lg bg-card px-8 py-3 text-sm font-semibold shadow-sm hover:bg-secondary transition-colors md:w-auto text-primary">
            Find jobs
          </button>
        </form>
      </div>
    </div>);

};

export default HeroSearch;
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

const Header = () => {
  const { user, userRole, signOut, loading } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="border-b bg-card">
      <div className="container mx-auto flex items-center justify-between px-4 py-3">
        <Link to="/" className="flex items-center gap-2">
          <img
            src="/logo.png"
            alt="PRÆDICŌ logo"
            className="h-8 w-8 object-contain"
            onError={(e) => {
              e.currentTarget.style.display = "none";
            }}
          />
          <span className="text-xl font-bold text-foreground">PRÆDICŌ</span>
        </Link>
        <nav className="hidden items-center gap-6 md:flex">
          <Link to="/" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            Find Jobs
          </Link>
          <Link to="/reviews" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            Company Reviews
          </Link>
          <Link to="/salary-guide" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            Salary Guide
          </Link>
        </nav>
        <div className="flex items-center gap-3">
          {user ? (
            <>
              {userRole === "admin" && (
                <button onClick={() => navigate("/admin")} className="text-sm font-medium text-primary hover:underline">
                  Admin
                </button>
              )}
              {userRole === "employer" && (
                <button onClick={() => navigate("/post-job")} className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90 transition-opacity">
                  Post a job
                </button>
              )}
              <button
                onClick={async () => {
                  try {
                    await signOut();
                    navigate("/auth", { replace: true });
                  } catch (e) {
                    console.error(e);
                  }
                }}
                className="text-sm font-medium text-primary hover:underline"
              >
                Sign out
              </button>
            </>
          ) : (
            <>
              <button onClick={() => navigate("/auth")} className="text-sm font-medium hover:underline text-primary">
                Sign in
              </button>
              <button onClick={() => navigate("/auth")} className="rounded-lg px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90 transition-opacity bg-primary">
                Post a job
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
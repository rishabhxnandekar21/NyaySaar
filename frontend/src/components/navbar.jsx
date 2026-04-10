import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Scale } from "lucide-react";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Better active route handling
  const isActive = (path) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  return (
    <nav
      data-testid="navbar"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/70 backdrop-blur-xl border-b border-black/5 saturate-150 shadow-[0_1px_3px_rgba(0,0,0,0.04)]"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="flex items-center justify-between h-16 sm:h-18">
          {/* Logo */}
          <Link
            to="/"
            data-testid="navbar-logo"
            className="flex items-center gap-2.5 group"
          >
            <div className="w-8 h-8 bg-zinc-900 rounded-lg flex items-center justify-center group-hover:bg-zinc-700 transition-colors">
              <Scale className="w-4 h-4 text-white" strokeWidth={1.5} />
            </div>
            <span
              className="text-xl font-bold tracking-tight text-zinc-900"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Nyay Saar
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center gap-1">
            <Link
              to="/"
              data-testid="nav-home"
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                isActive("/")
                  ? "text-zinc-900 bg-zinc-100"
                  : "text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50"
              }`}
            >
              Home
            </Link>

            <Link
              to="/dashboard"
              data-testid="nav-dashboard"
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                isActive("/dashboard")
                  ? "text-zinc-900 bg-zinc-100"
                  : "text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50"
              }`}
            >
              Dashboard
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

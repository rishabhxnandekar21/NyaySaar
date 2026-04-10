import { Scale } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      data-testid="footer"
      className="border-t border-zinc-100 py-12 sm:py-16"
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          {/* Brand */}
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 bg-zinc-900 rounded-lg flex items-center justify-center">
              <Scale className="w-3.5 h-3.5 text-white" strokeWidth={1.5} />
            </div>
            <span
              className="text-lg font-bold tracking-tight text-zinc-900"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Nyay Saar
            </span>
          </div>

          {/* Links */}
          <nav
            className="flex items-center gap-6 sm:gap-8"
            aria-label="Footer Navigation"
          >
            <a
              href="#about"
              data-testid="footer-about"
              className="text-sm text-zinc-500 hover:text-zinc-900 transition-colors"
            >
              About
            </a>
            <a
              href="#privacy"
              data-testid="footer-privacy"
              className="text-sm text-zinc-500 hover:text-zinc-900 transition-colors"
            >
              Privacy
            </a>
            <a
              href="#contact"
              data-testid="footer-contact"
              className="text-sm text-zinc-500 hover:text-zinc-900 transition-colors"
            >
              Contact
            </a>
          </nav>

          {/* Copyright */}
          <p className="text-xs text-zinc-400 text-center sm:text-right">
            © {currentYear} Nyay Saar. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

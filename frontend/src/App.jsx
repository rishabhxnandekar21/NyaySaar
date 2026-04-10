import { useRef, useEffect } from "react";
import "@/App.css";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import ProblemSection from "@/components/ProblemSection";
import SolutionSection from "@/components/SolutionSection";
import BenefitsSection from "@/components/BenefitsSection";
import InteractiveToolSection from "@/components/InteractiveToolSection";
import SocialProofSection from "@/components/SocialProofSection";
import Footer from "@/components/Footer";
import DashboardPage from "@/components/DashboardPage";

// Scrolls to top on every route change
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [pathname]);
  return null;
}

function NotFoundPage() {
  return (
    <div style={{ padding: "4rem", textAlign: "center" }}>
      <h1>404 — Page Not Found</h1>
    </div>
  );
}

function HomePage() {
  const toolRef = useRef(null);

  const scrollToTool = () => {
    toolRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div data-testid="home-page">
      <HeroSection onUploadClick={scrollToTool} />
      <ProblemSection />
      <SolutionSection />
      <BenefitsSection />
      <div ref={toolRef}>
        <InteractiveToolSection />
      </div>
      <SocialProofSection />
      <Footer />
    </div>
  );
}

// Layout wraps Navbar + page content so you can control spacing/offset in one place
function Layout({ children }) {
  return (
    <>
      <Navbar />
      <main>{children}</main>
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;

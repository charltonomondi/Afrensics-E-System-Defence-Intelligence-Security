import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import Analytics from "@/components/Analytics";
import TawkChat from "@/components/TawkChat";
import PenetrationTestingPopup from "@/components/PenetrationTestingPopup";
import SnowOverlay from "@/components/SnowOverlay";
import CookieConsent from "@/components/CookieConsent";
import { usePenetrationTestingPopup } from "@/hooks/usePenetrationTestingPopup";
import { Component, ReactNode } from "react";

import './i18n';
import Index from "./pages/Index";
import Services from "./pages/Services";
import About from "./pages/About";
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';
import CheckBreach from "./pages/CheckBreach";
import CheckBreachWithPayment from "./pages/CheckBreachWithPayment";
import MalwareScanner from "./pages/MalwareScanner";
import Contact from "./pages/Contact";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import NotFound from "./pages/NotFound";

// Error Boundary Component
class ErrorBoundary extends Component<{children: ReactNode}, {hasError: boolean, error?: Error}> {
  constructor(props: {children: ReactNode}) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error('React Error Boundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          padding: '20px',
          fontFamily: 'Arial, sans-serif',
          textAlign: 'center',
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <h1 style={{ color: '#dc2626', marginBottom: '20px' }}>Application Error</h1>
          <p style={{ marginBottom: '20px' }}>Sorry, something went wrong while loading the application.</p>
          <button
            onClick={() => window.location.reload()}
            style={{
              padding: '10px 20px',
              backgroundColor: '#1e40af',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            Reload Page
          </button>
          <details style={{ marginTop: '20px', textAlign: 'left' }}>
            <summary style={{ cursor: 'pointer', marginBottom: '10px' }}>Error Details</summary>
            <pre style={{
              background: '#f5f5f5',
              padding: '10px',
              borderRadius: '5px',
              overflow: 'auto',
              maxWidth: '600px'
            }}>
              {this.state.error?.message || 'Unknown error'}
            </pre>
          </details>
        </div>
      );
    }

    return this.props.children;
  }
}

const queryClient = new QueryClient();

const App = () => {
  const { isPopupOpen, closePopup } = usePenetrationTestingPopup();

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Analytics />
            <TawkChat />
            <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/services" element={<Services />} />
            <Route path="/about" element={<About />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:slug" element={<BlogPost />} />
            <Route path="/check-breach" element={<CheckBreach />} />
            <Route path="/check-breach/malware-scanner" element={<MalwareScanner />} />
            <Route path="/check-breach-payment" element={<CheckBreachWithPayment />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="*" element={<NotFound />} />
          </Routes>

          {/* Cookie Consent Banner */}
          <CookieConsent />

          {/* Penetration Testing Popup */}
          <PenetrationTestingPopup
            isOpen={isPopupOpen}
            onClose={closePopup}
          />

          {/* Christmas Snow Animation */}
          <SnowOverlay />

            </BrowserRouter>
          </TooltipProvider>
        </QueryClientProvider>
      </ErrorBoundary>
  );
};

export default App;

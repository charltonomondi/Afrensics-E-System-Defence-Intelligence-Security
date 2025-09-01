import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import Analytics from "@/components/Analytics";
import TawkChat from "@/components/TawkChat";
import PenetrationTestingPopup from "@/components/PenetrationTestingPopup";
import { usePenetrationTestingPopup } from "@/hooks/usePenetrationTestingPopup";

import './i18n';
import Index from "./pages/Index";
import Services from "./pages/Services";
import About from "./pages/About";
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';
import CheckBreach from "./pages/CheckBreach";
import CheckBreachWithPayment from "./pages/CheckBreachWithPayment";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  const { isPopupOpen, closePopup } = usePenetrationTestingPopup();

  return (
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
            <Route path="/check-breach-payment" element={<CheckBreachWithPayment />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="*" element={<NotFound />} />
          </Routes>

          {/* Penetration Testing Popup */}
          <PenetrationTestingPopup
            isOpen={isPopupOpen}
            onClose={closePopup}
          />
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;

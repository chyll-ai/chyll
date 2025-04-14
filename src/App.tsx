
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import CookieConsent from "./components/CookieConsent";
import Index from "./pages/Index";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import Cookies from "./pages/Cookies";
import Company from "./pages/Company";
import AboutUs from "./pages/AboutUs";
import Careers from "./pages/Careers";
import Contact from "./pages/Contact";
import Blog from "./pages/Blog";
import FAQ from "./pages/FAQ";
import Support from "./pages/Support";
import Documentation from "./pages/Documentation";
import NotFound from "./pages/NotFound";

// Documentation Pages
import GettingStarted from "./pages/docs/GettingStarted";
import QuickStart from "./pages/docs/QuickStart";
import PlatformOverview from "./pages/docs/PlatformOverview";
import AccountSetup from "./pages/docs/AccountSetup";
import FirstAutomation from "./pages/docs/FirstAutomation";
import ApiDocumentation from "./pages/docs/ApiDocumentation";
import ApiReference from "./pages/docs/ApiReference";
import VideoTutorials from "./pages/docs/VideoTutorials";

// Best Practices Pages
import BestPractices from "./pages/docs/BestPractices";
import Performance from "./pages/docs/best-practices/Performance";

// Resources Pages
import ResourcesPage from "./pages/docs/ResourcesPage";
import WorkflowTemplates from "./pages/docs/resources/WorkflowTemplates";

// User Management Pages
import UserManagement from "./pages/docs/UserManagement";
import Roles from "./pages/docs/user-management/Roles";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <CookieConsent />
        <Routes>
          <Route path="/" element={<Index />} />
          
          {/* Section anchor redirects */}
          <Route path="/features" element={<Navigate to="/#features" replace />} />
          <Route path="/how-it-works" element={<Navigate to="/#how-it-works" replace />} />
          <Route path="/pricing" element={<Navigate to="/#pricing" replace />} />
          
          <Route path="/terms" element={<Terms />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/cookies" element={<Cookies />} />
          <Route path="/company" element={<Company />} />
          <Route path="/about-us" element={<AboutUs />} />
          <Route path="/careers" element={<Careers />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/support" element={<Support />} />
          
          {/* Documentation Pages */}
          <Route path="/documentation" element={<Documentation />} />
          
          {/* Getting Started Section */}
          <Route path="/documentation/getting-started" element={<GettingStarted />} />
          <Route path="/documentation/getting-started/quick-start" element={<QuickStart />} />
          <Route path="/documentation/getting-started/platform-overview" element={<PlatformOverview />} />
          <Route path="/documentation/getting-started/account-setup" element={<AccountSetup />} />
          <Route path="/documentation/getting-started/first-automation" element={<FirstAutomation />} />
          
          {/* API Documentation Section */}
          <Route path="/documentation/api" element={<ApiDocumentation />} />
          <Route path="/documentation/api/reference" element={<ApiReference />} />
          
          {/* Videos Section */}
          <Route path="/documentation/videos" element={<VideoTutorials />} />
          
          {/* Best Practices Section */}
          <Route path="/documentation/best-practices" element={<BestPractices />} />
          <Route path="/documentation/best-practices/performance" element={<Performance />} />
          
          {/* Resources Section */}
          <Route path="/documentation/resources" element={<ResourcesPage />} />
          <Route path="/documentation/resources/workflow-templates" element={<WorkflowTemplates />} />
          
          {/* User Management Section */}
          <Route path="/documentation/user-management" element={<UserManagement />} />
          <Route path="/documentation/user-management/roles" element={<Roles />} />
          
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

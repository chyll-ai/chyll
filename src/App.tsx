import React from 'react';
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
import BlogPostPage from "./components/blog/blog-post-page";
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

// API Documentation Pages
import Authentication from "./pages/docs/api/Authentication";
import RateLimits from "./pages/docs/api/RateLimits";
import Webhooks from "./pages/docs/api/Webhooks";

// Best Practices Pages
import BestPractices from "./pages/docs/BestPractices";
import Performance from "./pages/docs/best-practices/Performance";
import Security from "./pages/docs/best-practices/Security";
import Scalability from "./pages/docs/best-practices/Scalability";
import DataManagement from "./pages/docs/best-practices/DataManagement";

// Resources Pages
import ResourcesPage from "./pages/docs/ResourcesPage";
import WorkflowTemplates from "./pages/docs/resources/WorkflowTemplates";
import SampleDataSets from "./pages/docs/resources/SampleDataSets";
import AutomationChecklists from "./pages/docs/resources/AutomationChecklists";
import IntegrationExamples from "./pages/docs/resources/IntegrationExamples";

// User Management Pages
import UserManagement from "./pages/docs/UserManagement";
import Roles from "./pages/docs/user-management/Roles";
import Collaboration from "./pages/docs/user-management/Collaboration";
import AccessControl from "./pages/docs/user-management/AccessControl";
import AuditLogs from "./pages/docs/user-management/AuditLogs";

// Video Tutorial Categories Pages
import AIWorkflows from "./pages/docs/videos/AIWorkflows";
import AdvancedAutomation from "./pages/docs/videos/AdvancedAutomation";
import CustomIntegrations from "./pages/docs/videos/CustomIntegrations";
import DataAnalysis from "./pages/docs/videos/DataAnalysis";

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
          <Route path="/blog/:id" element={<BlogPostPage />} />
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
          <Route path="/documentation/api/authentication" element={<Authentication />} />
          <Route path="/documentation/api/rate-limits" element={<RateLimits />} />
          <Route path="/documentation/api/webhooks" element={<Webhooks />} />
          
          {/* Videos Section */}
          <Route path="/documentation/videos" element={<VideoTutorials />} />
          <Route path="/documentation/videos/ai-workflows" element={<AIWorkflows />} />
          <Route path="/documentation/videos/advanced-automation" element={<AdvancedAutomation />} />
          <Route path="/documentation/videos/custom-integrations" element={<CustomIntegrations />} />
          <Route path="/documentation/videos/data-analysis" element={<DataAnalysis />} />
          
          {/* Best Practices Section */}
          <Route path="/documentation/best-practices" element={<BestPractices />} />
          <Route path="/documentation/best-practices/performance" element={<Performance />} />
          <Route path="/documentation/best-practices/security" element={<Security />} />
          <Route path="/documentation/best-practices/scalability" element={<Scalability />} />
          <Route path="/documentation/best-practices/data-management" element={<DataManagement />} />
          
          {/* Resources Section */}
          <Route path="/documentation/resources" element={<ResourcesPage />} />
          <Route path="/documentation/resources/workflow-templates" element={<WorkflowTemplates />} />
          <Route path="/documentation/resources/sample-data" element={<SampleDataSets />} />
          <Route path="/documentation/resources/automation-checklists" element={<AutomationChecklists />} />
          <Route path="/documentation/resources/integration-examples" element={<IntegrationExamples />} />
          
          {/* User Management Section */}
          <Route path="/documentation/user-management" element={<UserManagement />} />
          <Route path="/documentation/user-management/roles" element={<Roles />} />
          <Route path="/documentation/user-management/collaboration" element={<Collaboration />} />
          <Route path="/documentation/user-management/access-control" element={<AccessControl />} />
          <Route path="/documentation/user-management/audit-logs" element={<AuditLogs />} />
          
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

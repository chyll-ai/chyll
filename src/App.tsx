import React, { Suspense, lazy } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { HelmetProvider } from 'react-helmet-async';
import CookieConsent from "./components/CookieConsent";

// Lazy load pages for performance
const Index = lazy(() => import("./pages/Index"));
const Terms = lazy(() => import("./pages/Terms"));
const Privacy = lazy(() => import("./pages/Privacy"));
const Cookies = lazy(() => import("./pages/Cookies"));
const Company = lazy(() => import("./pages/Company"));
const AboutUs = lazy(() => import("./pages/AboutUs"));
const Careers = lazy(() => import("./pages/Careers"));
const Contact = lazy(() => import("./pages/Contact"));
const Blog = lazy(() => import("./pages/Blog"));
const BlogPostPage = lazy(() => import("./components/blog/blog-post-page"));
const FAQ = lazy(() => import("./pages/FAQ"));
const Support = lazy(() => import("./pages/Support"));
const Documentation = lazy(() => import("./pages/Documentation"));
const NotFound = lazy(() => import("./pages/NotFound"));

// Documentation Pages (lazy loaded)
const GettingStarted = lazy(() => import("./pages/docs/GettingStarted"));
const QuickStart = lazy(() => import("./pages/docs/QuickStart"));
const PlatformOverview = lazy(() => import("./pages/docs/PlatformOverview"));
const AccountSetup = lazy(() => import("./pages/docs/AccountSetup"));
const FirstAutomation = lazy(() => import("./pages/docs/FirstAutomation"));
const ApiDocumentation = lazy(() => import("./pages/docs/ApiDocumentation"));
const ApiReference = lazy(() => import("./pages/docs/ApiReference"));
const VideoTutorials = lazy(() => import("./pages/docs/VideoTutorials"));

// API Documentation Pages (lazy loaded)
const Authentication = lazy(() => import("./pages/docs/api/Authentication"));
const RateLimits = lazy(() => import("./pages/docs/api/RateLimits"));
const Webhooks = lazy(() => import("./pages/docs/api/Webhooks"));

// Best Practices Pages (lazy loaded)
const BestPractices = lazy(() => import("./pages/docs/BestPractices"));
const Performance = lazy(() => import("./pages/docs/best-practices/Performance"));
const Security = lazy(() => import("./pages/docs/best-practices/Security"));
const Scalability = lazy(() => import("./pages/docs/best-practices/Scalability"));
const DataManagement = lazy(() => import("./pages/docs/best-practices/DataManagement"));

// Resources Pages (lazy loaded)
const ResourcesPage = lazy(() => import("./pages/docs/ResourcesPage"));
const WorkflowTemplates = lazy(() => import("./pages/docs/resources/WorkflowTemplates"));
const SampleDataSets = lazy(() => import("./pages/docs/resources/SampleDataSets"));
const AutomationChecklists = lazy(() => import("./pages/docs/resources/AutomationChecklists"));
const IntegrationExamples = lazy(() => import("./pages/docs/resources/IntegrationExamples"));

// User Management Pages (lazy loaded)
const UserManagement = lazy(() => import("./pages/docs/UserManagement"));
const Roles = lazy(() => import("./pages/docs/user-management/Roles"));
const Collaboration = lazy(() => import("./pages/docs/user-management/Collaboration"));
const AccessControl = lazy(() => import("./pages/docs/user-management/AccessControl"));
const AuditLogs = lazy(() => import("./pages/docs/user-management/AuditLogs"));

// Video Tutorial Categories Pages (lazy loaded)
const AIWorkflows = lazy(() => import("./pages/docs/videos/AIWorkflows"));
const AdvancedAutomation = lazy(() => import("./pages/docs/videos/AdvancedAutomation"));
const CustomIntegrations = lazy(() => import("./pages/docs/videos/CustomIntegrations"));
const DataAnalysis = lazy(() => import("./pages/docs/videos/DataAnalysis"));

// Fallback loading component
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
  </div>
);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <HelmetProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <CookieConsent />
          <Suspense fallback={<PageLoader />}>
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
              
              {/* Demo route for 404 page */}
              <Route path="/404-demo" element={<NotFound />} />
              
              {/* Catch-all route for 404 */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </TooltipProvider>
    </HelmetProvider>
  </QueryClientProvider>
);

export default App;

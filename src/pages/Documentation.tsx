
import React from 'react';
import Navbar from '@/components/Navbar';
import { Footer2Demo } from '@/components/ui/footer2-demo';
import { Search, Book, Code, Video, DownloadCloud, Coffee, Users, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

interface DocCategory {
  icon: React.ReactNode;
  title: string;
  description: string;
  path: string;
  articles: { title: string; url: string }[];
}

const docCategories: DocCategory[] = [
  {
    icon: <Book className="w-6 h-6 text-indigo-600" />,
    title: "Getting Started",
    description: "Learn the basics of using GenerativSchool",
    path: "/documentation/getting-started",
    articles: [
      { title: "Quick Start Guide", url: "/documentation/getting-started/quick-start" },
      { title: "Platform Overview", url: "/documentation/getting-started/platform-overview" },
      { title: "Setting Up Your Account", url: "/documentation/getting-started/account-setup" },
      { title: "Creating Your First Automation", url: "/documentation/getting-started/first-automation" },
    ]
  },
  {
    icon: <Code className="w-6 h-6 text-indigo-600" />,
    title: "API Documentation",
    description: "Integrate with our API",
    path: "/documentation/api",
    articles: [
      { title: "API Reference", url: "/documentation/api/reference" },
      { title: "Authentication", url: "/documentation/api/authentication" },
      { title: "Rate Limits", url: "/documentation/api/rate-limits" },
      { title: "Webhooks", url: "/documentation/api/webhooks" },
    ]
  },
  {
    icon: <Video className="w-6 h-6 text-indigo-600" />,
    title: "Video Tutorials",
    description: "Visual guides to platform features",
    path: "/documentation/videos",
    articles: [
      { title: "Building AI Workflows", url: "/documentation/videos/ai-workflows" },
      { title: "Advanced Automation Techniques", url: "/documentation/videos/advanced-automation" },
      { title: "Custom Integrations", url: "/documentation/videos/custom-integrations" },
      { title: "Data Analysis Features", url: "/documentation/videos/data-analysis" },
    ]
  },
  {
    icon: <DownloadCloud className="w-6 h-6 text-indigo-600" />,
    title: "Resources",
    description: "Templates, samples, and downloads",
    path: "/documentation/resources",
    articles: [
      { title: "Workflow Templates", url: "/documentation/resources/workflow-templates" },
      { title: "Sample Data Sets", url: "/documentation/resources/sample-data" },
      { title: "Automation Checklists", url: "/documentation/resources/automation-checklists" },
      { title: "Integration Examples", url: "/documentation/resources/integration-examples" },
    ]
  },
  {
    icon: <Coffee className="w-6 h-6 text-indigo-600" />,
    title: "Best Practices",
    description: "Optimize your use of the platform",
    path: "/documentation/best-practices",
    articles: [
      { title: "Performance Optimization", url: "/documentation/best-practices/performance" },
      { title: "Security Guidelines", url: "/documentation/best-practices/security" },
      { title: "Scalability Planning", url: "/documentation/best-practices/scalability" },
      { title: "Data Management", url: "/documentation/best-practices/data-management" },
    ]
  },
  {
    icon: <Users className="w-6 h-6 text-indigo-600" />,
    title: "User Management",
    description: "Control access and permissions",
    path: "/documentation/user-management",
    articles: [
      { title: "User Roles and Permissions", url: "/documentation/user-management/roles" },
      { title: "Team Collaboration", url: "/documentation/user-management/collaboration" },
      { title: "Access Control", url: "/documentation/user-management/access-control" },
      { title: "Audit Logs", url: "/documentation/user-management/audit-logs" },
    ]
  },
];

const Documentation = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <section className="bg-indigo-50 py-20">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-3xl md:text-5xl font-bold mb-6">Documentation</h1>
            <p className="text-lg text-gray-700 mb-8">
              Comprehensive guides and resources to help you get the most out of GenerativSchool.
            </p>
            
            <div className="relative max-w-xl mx-auto">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md bg-white focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Search documentation..."
              />
            </div>
          </div>
        </div>
      </section>
      
      <section className="py-16">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {docCategories.map((category, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="mb-4">{category.icon}</div>
                <h2 className="text-xl font-bold mb-2">{category.title}</h2>
                <p className="text-gray-600 mb-4">{category.description}</p>
                <ul className="space-y-2">
                  {category.articles.map((article, idx) => (
                    <li key={idx}>
                      <Link 
                        to={article.url} 
                        className="text-indigo-600 hover:text-indigo-800 transition-colors"
                      >
                        {article.title}
                      </Link>
                    </li>
                  ))}
                </ul>
                <div className="mt-4">
                  <Link
                    to={category.path}
                    className="inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-800"
                  >
                    View all documentation
                    <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                    </svg>
                  </Link>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-16 bg-orange-50 border border-orange-200 p-8 rounded-lg">
            <div className="flex">
              <AlertCircle className="w-6 h-6 text-orange-500 mt-1 mr-3 flex-shrink-0" />
              <div>
                <h3 className="text-xl font-bold mb-2">Need more help?</h3>
                <p className="text-gray-700 mb-4">
                  If you can't find what you're looking for in our documentation, our support team is ready to help.
                </p>
                <Link 
                  to="/support" 
                  className="inline-flex items-center px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors"
                >
                  Contact Support
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <Footer2Demo />
    </div>
  );
};

export default Documentation;

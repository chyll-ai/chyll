
import React from 'react';
import Navbar from '@/components/Navbar';
import { Footer2Demo } from '@/components/ui/footer2-demo';
import { Search, Book, Code, Video, DownloadCloud, Coffee, Users, AlertCircle } from 'lucide-react';

interface DocCategory {
  icon: React.ReactNode;
  title: string;
  description: string;
  articles: { title: string; url: string }[];
}

const docCategories: DocCategory[] = [
  {
    icon: <Book className="w-6 h-6 text-indigo-600" />,
    title: "Getting Started",
    description: "Learn the basics of using GenerativSchool",
    articles: [
      { title: "Quick Start Guide", url: "#" },
      { title: "Platform Overview", url: "#" },
      { title: "Setting Up Your Account", url: "#" },
      { title: "Creating Your First Automation", url: "#" },
    ]
  },
  {
    icon: <Code className="w-6 h-6 text-indigo-600" />,
    title: "API Documentation",
    description: "Integrate with our API",
    articles: [
      { title: "API Reference", url: "#" },
      { title: "Authentication", url: "#" },
      { title: "Rate Limits", url: "#" },
      { title: "Webhooks", url: "#" },
    ]
  },
  {
    icon: <Video className="w-6 h-6 text-indigo-600" />,
    title: "Video Tutorials",
    description: "Visual guides to platform features",
    articles: [
      { title: "Building AI Workflows", url: "#" },
      { title: "Advanced Automation Techniques", url: "#" },
      { title: "Custom Integrations", url: "#" },
      { title: "Data Analysis Features", url: "#" },
    ]
  },
  {
    icon: <DownloadCloud className="w-6 h-6 text-indigo-600" />,
    title: "Resources",
    description: "Templates, samples, and downloads",
    articles: [
      { title: "Workflow Templates", url: "#" },
      { title: "Sample Data Sets", url: "#" },
      { title: "Automation Checklists", url: "#" },
      { title: "Integration Examples", url: "#" },
    ]
  },
  {
    icon: <Coffee className="w-6 h-6 text-indigo-600" />,
    title: "Best Practices",
    description: "Optimize your use of the platform",
    articles: [
      { title: "Performance Optimization", url: "#" },
      { title: "Security Guidelines", url: "#" },
      { title: "Scalability Planning", url: "#" },
      { title: "Data Management", url: "#" },
    ]
  },
  {
    icon: <Users className="w-6 h-6 text-indigo-600" />,
    title: "User Management",
    description: "Control access and permissions",
    articles: [
      { title: "User Roles and Permissions", url: "#" },
      { title: "Team Collaboration", url: "#" },
      { title: "Access Control", url: "#" },
      { title: "Audit Logs", url: "#" },
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
                      <a 
                        href={article.url} 
                        className="text-indigo-600 hover:text-indigo-800 transition-colors"
                      >
                        {article.title}
                      </a>
                    </li>
                  ))}
                </ul>
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
                <a 
                  href="/support" 
                  className="inline-flex items-center px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors"
                >
                  Contact Support
                </a>
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

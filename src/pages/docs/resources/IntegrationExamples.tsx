
import React from 'react';
import DocLayout from '@/components/DocLayout';
import { Code, ExternalLink, FileText, Users, Clock, Tag } from 'lucide-react';
import { Link } from 'react-router-dom';

const IntegrationExamples = () => {
  const sidebarLinks = [
    { title: 'Resources Overview', url: '/documentation/resources' },
    { title: 'Workflow Templates', url: '/documentation/resources/workflow-templates' },
    { title: 'Sample Data Sets', url: '/documentation/resources/sample-data' },
    { title: 'Automation Checklists', url: '/documentation/resources/automation-checklists' },
    { title: 'Integration Examples', url: '/documentation/resources/integration-examples', active: true },
  ];

  const integrations = [
    {
      title: "Salesforce CRM Integration",
      description: "Connect your automation workflows with Salesforce to synchronize customer data and activities.",
      category: "CRM",
      complexity: "Medium",
      contributors: 5,
      lastUpdated: "April 8, 2025"
    },
    {
      title: "Slack Notifications",
      description: "Send real-time notifications to Slack channels based on workflow events and triggers.",
      category: "Communication",
      complexity: "Low",
      contributors: 3,
      lastUpdated: "March 20, 2025"
    },
    {
      title: "Google Workspace Integration",
      description: "Automate document creation, email sending, and calendar management with Google Workspace.",
      category: "Productivity",
      complexity: "Medium",
      contributors: 4,
      lastUpdated: "April 2, 2025"
    },
    {
      title: "Shopify Order Processing",
      description: "Automate order fulfillment, inventory updates, and customer communications for Shopify stores.",
      category: "E-commerce",
      complexity: "High",
      contributors: 6,
      lastUpdated: "March 25, 2025"
    },
    {
      title: "Stripe Payment Workflows",
      description: "Create automated workflows for payment processing, subscription management, and invoicing.",
      category: "Finance",
      complexity: "Medium",
      contributors: 4,
      lastUpdated: "April 5, 2025"
    },
    {
      title: "HubSpot Marketing Automation",
      description: "Integrate with HubSpot to automate lead nurturing, campaign management, and analytics.",
      category: "Marketing",
      complexity: "Medium",
      contributors: 3,
      lastUpdated: "March 30, 2025"
    }
  ];

  const featuredIntegration = {
    title: "Salesforce CRM Integration",
    endpoints: [
      { name: "Contact Synchronization", description: "Bi-directional sync of contact information between systems" },
      { name: "Lead Processing", description: "Automated lead scoring, assignment, and follow-up" },
      { name: "Opportunity Tracking", description: "Monitor deals and trigger workflows based on stage changes" },
      { name: "Custom Object Support", description: "Integration with custom Salesforce objects and fields" },
      { name: "Task Management", description: "Create and update tasks across platforms" }
    ]
  };

  return (
    <DocLayout
      title="Integration Examples"
      description="Example configurations for connecting GenerativSchool with popular services"
      sidebarLinks={sidebarLinks}
      breadcrumbs={[
        { title: 'Resources', url: '/documentation/resources' },
        { title: 'Integration Examples', url: '/documentation/resources/integration-examples' }
      ]}
      previousLink={{ title: 'Automation Checklists', url: '/documentation/resources/automation-checklists' }}
    >
      <section className="mb-12">
        <p className="text-lg mb-6">
          Our integration examples provide ready-to-use configurations and code samples for connecting 
          GenerativSchool with popular third-party services and APIs. Use these examples as a starting 
          point to quickly build integrations for your automation workflows.
        </p>

        <div className="p-6 bg-blue-50 border border-blue-100 rounded-lg mb-10">
          <h3 className="text-lg font-semibold mb-2">How to Use Integration Examples</h3>
          <ol className="list-decimal pl-6 space-y-2">
            <li>Browse the examples below to find the service you want to integrate with</li>
            <li>Review the documentation and setup requirements for the integration</li>
            <li>Import the example configuration into your GenerativSchool workspace</li>
            <li>Configure your API credentials and connection settings</li>
            <li>Customize the integration to match your specific workflow needs</li>
            <li>Test the integration thoroughly before deploying to production</li>
          </ol>
        </div>

        <div className="mb-8">
          <div className="flex flex-wrap gap-2 mb-6">
            <button className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full hover:bg-indigo-200 transition-colors">
              All Categories
            </button>
            <button className="px-3 py-1 bg-white border border-gray-200 text-gray-700 rounded-full hover:bg-gray-50 transition-colors">
              CRM
            </button>
            <button className="px-3 py-1 bg-white border border-gray-200 text-gray-700 rounded-full hover:bg-gray-50 transition-colors">
              E-commerce
            </button>
            <button className="px-3 py-1 bg-white border border-gray-200 text-gray-700 rounded-full hover:bg-gray-50 transition-colors">
              Marketing
            </button>
            <button className="px-3 py-1 bg-white border border-gray-200 text-gray-700 rounded-full hover:bg-gray-50 transition-colors">
              Finance
            </button>
            <button className="px-3 py-1 bg-white border border-gray-200 text-gray-700 rounded-full hover:bg-gray-50 transition-colors">
              Communication
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {integrations.map((integration, index) => (
              <div key={index} className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-semibold">{integration.title}</h3>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                    {integration.category}
                  </span>
                </div>
                <p className="text-gray-700 mb-4">{integration.description}</p>
                
                <div className="flex flex-wrap gap-y-3 gap-x-6 text-sm text-gray-500 mb-4">
                  <div className="flex items-center">
                    <Tag className="h-4 w-4 text-gray-400 mr-1" />
                    <span>Complexity: {integration.complexity}</span>
                  </div>
                  <div className="flex items-center">
                    <Users className="h-4 w-4 text-gray-400 mr-1" />
                    <span>{integration.contributors} contributors</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 text-gray-400 mr-1" />
                    <span>Updated: {integration.lastUpdated}</span>
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  <a href="#" className="text-indigo-600 hover:text-indigo-800 font-medium">
                    View details
                  </a>
                  <div className="flex gap-2">
                    <button className="inline-flex items-center px-3 py-2 bg-white border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Documentation
                    </button>
                    <button className="inline-flex items-center px-3 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors">
                      <Code className="h-4 w-4 mr-2" />
                      Get Code
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Featured Integration: Salesforce CRM</h2>
        
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden mb-6">
          <div className="p-6 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-semibold">{featuredIntegration.title}</h3>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                Featured
              </span>
            </div>
            <p className="text-gray-700 mt-2">
              Our most comprehensive integration example provides a complete solution for
              connecting your GenerativSchool workflows with Salesforce CRM.
            </p>
          </div>
          
          <div className="p-6">
            <h4 className="font-medium mb-3">Supported Endpoints:</h4>
            <ul className="space-y-4">
              {featuredIntegration.endpoints.map((endpoint, index) => (
                <li key={index} className="flex items-start">
                  <Code className="h-5 w-5 text-indigo-500 mr-2 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium">{endpoint.name}</p>
                    <p className="text-sm text-gray-600">{endpoint.description}</p>
                  </div>
                </li>
              ))}
            </ul>
            
            <div className="mt-6 border border-gray-200 rounded-md overflow-hidden">
              <div className="bg-gray-50 px-4 py-2 border-b border-gray-200">
                <p className="font-mono text-sm">Example API call</p>
              </div>
              <div className="p-4 bg-gray-900 text-gray-100 font-mono text-sm overflow-x-auto">
                <pre>{`const response = await fetch('/api/v1/salesforce/contacts', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ${'{token}'}'
  },
  body: JSON.stringify({
    firstName: 'Jane',
    lastName: 'Doe',
    email: 'jane.doe@example.com',
    company: 'Acme Inc'
  })
});`}</pre>
              </div>
            </div>
            
            <div className="mt-6 flex justify-end gap-3">
              <a 
                href="https://developer.salesforce.com/docs" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Salesforce Docs
              </a>
              <button className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors">
                <FileText className="h-4 w-4 mr-2" />
                View Integration Guide
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-indigo-50 p-6 rounded-lg border border-indigo-100">
        <h2 className="text-2xl font-bold mb-4">Custom Integration Support</h2>
        <p className="mb-6">
          Need help developing a custom integration for a service not listed here? Our integration specialists 
          can assist you in building connectors for any API or service your organization uses.
        </p>
        <div className="flex flex-wrap gap-4">
          <a href="/contact" className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors">
            Request Integration Help
          </a>
          <a href="/documentation/api/custom-integrations" className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors">
            Custom Integration Guide
          </a>
        </div>
      </section>
    </DocLayout>
  );
};

export default IntegrationExamples;

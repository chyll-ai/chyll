
import React from 'react';
import DocLayout from '@/components/DocLayout';
import { FileDown, Star, Clock, Tag } from 'lucide-react';

const WorkflowTemplates = () => {
  const sidebarLinks = [
    { title: 'Resources Overview', url: '/documentation/resources' },
    { title: 'Workflow Templates', url: '/documentation/resources/workflow-templates', active: true },
    { title: 'Sample Data Sets', url: '/documentation/resources/sample-data' },
    { title: 'Automation Checklists', url: '/documentation/resources/automation-checklists' },
    { title: 'Integration Examples', url: '/documentation/resources/integration-examples' },
  ];

  const templates = [
    {
      title: "Customer Onboarding",
      description: "Automate your customer onboarding process with this comprehensive workflow template.",
      category: "Customer Success",
      popularity: 5,
      complexity: "Medium",
      lastUpdated: "April 2, 2025"
    },
    {
      title: "Lead Qualification",
      description: "Automatically score and route leads based on predefined criteria.",
      category: "Sales",
      popularity: 4,
      complexity: "Low",
      lastUpdated: "March 15, 2025"
    },
    {
      title: "Invoice Processing",
      description: "Extract data from invoices and automatically enter it into your accounting system.",
      category: "Finance",
      popularity: 5,
      complexity: "High",
      lastUpdated: "March 28, 2025"
    },
    {
      title: "Employee Onboarding",
      description: "Streamline your HR processes with this automated employee onboarding workflow.",
      category: "Human Resources",
      popularity: 4,
      complexity: "Medium",
      lastUpdated: "February 10, 2025"
    },
    {
      title: "Support Ticket Triage",
      description: "Automatically categorize and route support tickets to the right team members.",
      category: "Customer Support",
      popularity: 5,
      complexity: "Medium",
      lastUpdated: "April 5, 2025"
    },
    {
      title: "Social Media Publishing",
      description: "Schedule and publish content across multiple social media platforms.",
      category: "Marketing",
      popularity: 3,
      complexity: "Low",
      lastUpdated: "March 20, 2025"
    }
  ];

  const renderStars = (popularity: number) => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(
        <Star 
          key={i} 
          className={`h-4 w-4 ${i < popularity ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} 
        />
      );
    }
    return stars;
  };

  return (
    <DocLayout
      title="Workflow Templates"
      description="Pre-built workflow templates to jumpstart your automation projects"
      sidebarLinks={sidebarLinks}
      breadcrumbs={[
        { title: 'Resources', url: '/documentation/resources' },
        { title: 'Workflow Templates', url: '/documentation/resources/workflow-templates' }
      ]}
      previousLink={{ title: 'Resources Overview', url: '/documentation/resources' }}
      nextLink={{ title: 'Sample Data Sets', url: '/documentation/resources/sample-data' }}
    >
      <section className="mb-12">
        <p className="text-lg mb-6">
          Our workflow templates provide pre-built automations for common business processes. 
          Each template can be imported into your GenerativSchool workspace and customized to 
          fit your specific requirements, saving you time and effort.
        </p>

        <div className="p-6 bg-blue-50 border border-blue-100 rounded-lg mb-10">
          <h3 className="text-lg font-semibold mb-2">How to Use Templates</h3>
          <ol className="list-decimal pl-6 space-y-2">
            <li>Browse the templates below and find one that matches your needs</li>
            <li>Click the "Download Template" button to download the template file</li>
            <li>In your GenerativSchool workspace, go to Workflows > Import</li>
            <li>Upload the template file and follow the prompts to configure it</li>
            <li>Create a condition (e.g., &quot;Lead Score &gt; 50&quot;)</li>
            <li>Customize the workflow to match your specific processes</li>
          </ol>
        </div>

        <div className="mb-8">
          <div className="flex flex-wrap gap-2 mb-6">
            <button className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full hover:bg-indigo-200 transition-colors">
              All Categories
            </button>
            <button className="px-3 py-1 bg-white border border-gray-200 text-gray-700 rounded-full hover:bg-gray-50 transition-colors">
              Sales
            </button>
            <button className="px-3 py-1 bg-white border border-gray-200 text-gray-700 rounded-full hover:bg-gray-50 transition-colors">
              Marketing
            </button>
            <button className="px-3 py-1 bg-white border border-gray-200 text-gray-700 rounded-full hover:bg-gray-50 transition-colors">
              Customer Support
            </button>
            <button className="px-3 py-1 bg-white border border-gray-200 text-gray-700 rounded-full hover:bg-gray-50 transition-colors">
              Human Resources
            </button>
            <button className="px-3 py-1 bg-white border border-gray-200 text-gray-700 rounded-full hover:bg-gray-50 transition-colors">
              Finance
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {templates.map((template, index) => (
              <div key={index} className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-semibold">{template.title}</h3>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                    {template.category}
                  </span>
                </div>
                <p className="text-gray-700 mb-4">{template.description}</p>
                
                <div className="flex flex-wrap gap-y-3 gap-x-6 text-sm text-gray-500 mb-4">
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-gray-400 mr-1" />
                    <div className="flex">{renderStars(template.popularity)}</div>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 text-gray-400 mr-1" />
                    <span>Updated: {template.lastUpdated}</span>
                  </div>
                  <div className="flex items-center">
                    <Tag className="h-4 w-4 text-gray-400 mr-1" />
                    <span>Complexity: {template.complexity}</span>
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  <a href="#" className="text-indigo-600 hover:text-indigo-800 font-medium">
                    Preview
                  </a>
                  <button className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors">
                    <FileDown className="h-4 w-4 mr-2" />
                    Download Template
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4">Template Customization Tips</h2>
        
        <div className="space-y-4">
          <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
            <h3 className="font-semibold mb-2">1. Review All Configurations</h3>
            <p className="text-gray-700">
              After importing a template, carefully review all settings, including triggers, conditions, and actions 
              to ensure they align with your specific requirements.
            </p>
          </div>
          
          <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
            <h3 className="font-semibold mb-2">2. Update Integration Connections</h3>
            <p className="text-gray-700">
              Templates include placeholders for integration connections. Make sure to update these with your 
              own authenticated connections to third-party services.
            </p>
          </div>
          
          <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
            <h3 className="font-semibold mb-2">3. Test Before Activating</h3>
            <p className="text-gray-700">
              Always use the Test feature to run the workflow with sample data before activating it in 
              your production environment.
            </p>
          </div>
          
          <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
            <h3 className="font-semibold mb-2">4. Document Your Customizations</h3>
            <p className="text-gray-700">
              Use the workflow description field to document the changes you've made to the template for 
              future reference and team collaboration.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-indigo-50 p-6 rounded-lg border border-indigo-100">
        <h2 className="text-2xl font-bold mb-4">Submit Your Own Template</h2>
        <p className="mb-6">
          Have you created a workflow that might be useful for other GenerativSchool users? 
          Consider submitting it to our template library. Approved submissions will be featured 
          in our gallery and you'll be credited as the creator.
        </p>
        <div className="flex flex-wrap gap-4">
          <a href="/contact" className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors">
            Submit a Template
          </a>
          <a href="/documentation/resources/template-guidelines" className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors">
            View Submission Guidelines
          </a>
        </div>
      </section>
    </DocLayout>
  );
};

export default WorkflowTemplates;

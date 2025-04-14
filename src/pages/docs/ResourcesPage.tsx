
import React from 'react';
import DocLayout from '@/components/DocLayout';
import { FileText, Database, CheckSquare, Code } from 'lucide-react';
import { Link } from 'react-router-dom';

const ResourcesPage = () => {
  const sidebarLinks = [
    { title: 'Overview', url: '/documentation/resources', active: true },
    { title: 'Workflow Templates', url: '/documentation/resources/workflow-templates' },
    { title: 'Sample Data Sets', url: '/documentation/resources/sample-data' },
    { title: 'Automation Checklists', url: '/documentation/resources/automation-checklists' },
    { title: 'Integration Examples', url: '/documentation/resources/integration-examples' },
  ];

  return (
    <DocLayout
      title="Resources"
      description="Templates, samples, and downloads to help you build faster"
      sidebarLinks={sidebarLinks}
      breadcrumbs={[{ title: 'Resources', url: '/documentation/resources' }]}
      nextLink={{ title: 'Workflow Templates', url: '/documentation/resources/workflow-templates' }}
    >
      <section className="mb-12">
        <p className="text-lg mb-6">
          Our resource library provides ready-to-use assets that will help you build and deploy automation
          workflows more quickly. Use these resources as starting points or learning tools to accelerate
          your development process.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center mb-4">
              <FileText className="h-8 w-8 text-indigo-600 mr-3" />
              <h3 className="text-xl font-semibold">Workflow Templates</h3>
            </div>
            <p className="text-gray-700 mb-4">
              Pre-built workflow templates for common business processes that you can customize to fit your needs.
            </p>
            <Link to="/documentation/resources/workflow-templates" className="text-indigo-600 hover:text-indigo-800 font-medium">
              Browse templates →
            </Link>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center mb-4">
              <Database className="h-8 w-8 text-indigo-600 mr-3" />
              <h3 className="text-xl font-semibold">Sample Data Sets</h3>
            </div>
            <p className="text-gray-700 mb-4">
              Test data sets for different industries and use cases to help you develop and test your automations.
            </p>
            <Link to="/documentation/resources/sample-data" className="text-indigo-600 hover:text-indigo-800 font-medium">
              Download data sets →
            </Link>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center mb-4">
              <CheckSquare className="h-8 w-8 text-indigo-600 mr-3" />
              <h3 className="text-xl font-semibold">Automation Checklists</h3>
            </div>
            <p className="text-gray-700 mb-4">
              Step-by-step checklists to guide you through planning, building, testing, and deploying automations.
            </p>
            <Link to="/documentation/resources/automation-checklists" className="text-indigo-600 hover:text-indigo-800 font-medium">
              View checklists →
            </Link>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center mb-4">
              <Code className="h-8 w-8 text-indigo-600 mr-3" />
              <h3 className="text-xl font-semibold">Integration Examples</h3>
            </div>
            <p className="text-gray-700 mb-4">
              Example configurations for integrating GenerativSchool with popular third-party services and APIs.
            </p>
            <Link to="/documentation/resources/integration-examples" className="text-indigo-600 hover:text-indigo-800 font-medium">
              Explore integrations →
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-indigo-50 p-6 rounded-lg border border-indigo-100 mb-12">
        <h2 className="text-2xl font-bold mb-4">Resource Contributions</h2>
        <p className="mb-4">
          We welcome contributions from our community! If you've created a workflow template, integration, or other resource
          that you'd like to share with fellow GenerativSchool users, please consider submitting it to our resource library.
        </p>
        <div className="mt-4">
          <a href="/contact" className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors">
            Submit a Resource
          </a>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4">Recently Added Resources</h2>
        <ul className="space-y-4">
          <li className="border-l-4 border-indigo-500 pl-4 py-1">
            <span className="text-xs text-gray-500 block">New Template</span>
            <a href="/documentation/resources/workflow-templates" className="text-lg font-medium text-gray-900 hover:text-indigo-600">
              Customer Onboarding Automation
            </a>
          </li>
          <li className="border-l-4 border-green-500 pl-4 py-1">
            <span className="text-xs text-gray-500 block">Updated</span>
            <a href="/documentation/resources/integration-examples" className="text-lg font-medium text-gray-900 hover:text-indigo-600">
              Salesforce CRM Integration Guide
            </a>
          </li>
          <li className="border-l-4 border-indigo-500 pl-4 py-1">
            <span className="text-xs text-gray-500 block">New Checklist</span>
            <a href="/documentation/resources/automation-checklists" className="text-lg font-medium text-gray-900 hover:text-indigo-600">
              Workflow Testing Checklist
            </a>
          </li>
        </ul>
      </section>
    </DocLayout>
  );
};

export default ResourcesPage;

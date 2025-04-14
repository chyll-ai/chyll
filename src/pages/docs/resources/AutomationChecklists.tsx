
import React from 'react';
import DocLayout from '@/components/DocLayout';
import { CheckSquare, Download, AlertCircle, Clock, User } from 'lucide-react';
import { Link } from 'react-router-dom';

const AutomationChecklists = () => {
  const sidebarLinks = [
    { title: 'Resources Overview', url: '/documentation/resources' },
    { title: 'Workflow Templates', url: '/documentation/resources/workflow-templates' },
    { title: 'Sample Data Sets', url: '/documentation/resources/sample-data' },
    { title: 'Automation Checklists', url: '/documentation/resources/automation-checklists', active: true },
    { title: 'Integration Examples', url: '/documentation/resources/integration-examples' },
  ];

  const checklists = [
    {
      title: "Workflow Planning Checklist",
      description: "Ensure you've covered all the required steps before building your automation workflow.",
      category: "Planning",
      items: 18,
      lastUpdated: "April 5, 2025",
      author: "GenerativSchool Team"
    },
    {
      title: "Security & Compliance Review",
      description: "Verify that your workflow meets security requirements and compliance standards.",
      category: "Security",
      items: 22,
      lastUpdated: "March 28, 2025",
      author: "Security Team"
    },
    {
      title: "Data Validation Checklist",
      description: "Ensure your automation properly validates and handles all incoming data.",
      category: "Development",
      items: 15,
      lastUpdated: "April 10, 2025",
      author: "Data Team"
    },
    {
      title: "Workflow Testing Protocol",
      description: "Comprehensive test cases and verification procedures for automation workflows.",
      category: "Testing",
      items: 24,
      lastUpdated: "March 25, 2025",
      author: "QA Team"
    },
    {
      title: "Production Deployment Checklist",
      description: "Steps to safely deploy automation workflows to production environments.",
      category: "Deployment",
      items: 20,
      lastUpdated: "April 8, 2025",
      author: "DevOps Team"
    },
    {
      title: "Performance Optimization",
      description: "Identify opportunities to improve workflow efficiency and resource usage.",
      category: "Optimization",
      items: 16,
      lastUpdated: "March 30, 2025",
      author: "Performance Team"
    }
  ];

  return (
    <DocLayout
      title="Automation Checklists"
      description="Step-by-step guides to ensure comprehensive workflow development"
      sidebarLinks={sidebarLinks}
      breadcrumbs={[
        { title: 'Resources', url: '/documentation/resources' },
        { title: 'Automation Checklists', url: '/documentation/resources/automation-checklists' }
      ]}
      previousLink={{ title: 'Sample Data Sets', url: '/documentation/resources/sample-data' }}
      nextLink={{ title: 'Integration Examples', url: '/documentation/resources/integration-examples' }}
    >
      <section className="mb-12">
        <p className="text-lg mb-6">
          Our automation checklists provide comprehensive guidance for planning, building, testing, and 
          deploying your workflows. Use these checklists to ensure you've covered all the important 
          aspects and followed best practices at each stage of the automation lifecycle.
        </p>

        <div className="p-6 bg-amber-50 border border-amber-100 rounded-lg mb-10">
          <div className="flex items-start">
            <AlertCircle className="h-6 w-6 text-amber-500 mr-3 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="text-lg font-semibold mb-2">Why Use Checklists?</h3>
              <p className="text-gray-700">
                Research shows that even experts can miss critical steps when working on complex tasks. 
                Checklists reduce errors by up to 47% and ensure consistent quality across all your automation projects. 
                They are particularly valuable for team collaboration and knowledge transfer.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {checklists.map((checklist, index) => (
            <div key={index} className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-semibold">{checklist.title}</h3>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                  {checklist.category}
                </span>
              </div>
              <p className="text-gray-700 mb-4">{checklist.description}</p>
              
              <div className="flex flex-wrap gap-y-3 gap-x-6 text-sm text-gray-500 mb-4">
                <div className="flex items-center">
                  <CheckSquare className="h-4 w-4 text-gray-400 mr-1" />
                  <span>{checklist.items} items</span>
                </div>
                <div className="flex items-center">
                  <User className="h-4 w-4 text-gray-400 mr-1" />
                  <span>By: {checklist.author}</span>
                </div>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 text-gray-400 mr-1" />
                  <span>Updated: {checklist.lastUpdated}</span>
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <a href="#" className="text-indigo-600 hover:text-indigo-800 font-medium">
                  Preview
                </a>
                <div className="flex gap-2">
                  <button className="inline-flex items-center px-3 py-2 bg-white border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors">
                    <CheckSquare className="h-4 w-4 mr-2" />
                    View Online
                  </button>
                  <button className="inline-flex items-center px-3 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors">
                    <Download className="h-4 w-4 mr-2" />
                    Download PDF
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Featured Checklist: Workflow Testing Protocol</h2>
        
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden mb-6">
          <div className="p-6 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-semibold">Workflow Testing Protocol</h3>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Featured
              </span>
            </div>
            <p className="text-gray-700 mt-2">
              This comprehensive testing protocol ensures your automation workflows are robust, 
              reliable, and handle edge cases appropriately.
            </p>
          </div>
          
          <div className="p-6">
            <h4 className="font-medium mb-3">Preview of testing categories:</h4>
            <ul className="space-y-2">
              <li className="flex items-start">
                <CheckSquare className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium">Input Validation Testing</p>
                  <p className="text-sm text-gray-600">Verify that the workflow properly validates all input data and handles invalid inputs gracefully.</p>
                </div>
              </li>
              <li className="flex items-start">
                <CheckSquare className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium">Error Handling Verification</p>
                  <p className="text-sm text-gray-600">Ensure the workflow has appropriate error handling and recovery mechanisms in place.</p>
                </div>
              </li>
              <li className="flex items-start">
                <CheckSquare className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium">Integration Point Testing</p>
                  <p className="text-sm text-gray-600">Validate all connections to external systems and handling of API responses.</p>
                </div>
              </li>
              <li className="flex items-start">
                <CheckSquare className="h-5 w-5 text-gray-400 mr-2 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-400">Performance Benchmarking</p>
                  <p className="text-sm text-gray-400">Measure execution time and resource usage under various conditions.</p>
                </div>
              </li>
              <li className="flex items-start">
                <CheckSquare className="h-5 w-5 text-gray-400 mr-2 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-400">Security Testing</p>
                  <p className="text-sm text-gray-400">Ensure the workflow maintains data security and access controls.</p>
                </div>
              </li>
            </ul>
            
            <div className="mt-6 flex justify-end">
              <button className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors">
                <Download className="h-4 w-4 mr-2" />
                Download Full Checklist
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-indigo-50 p-6 rounded-lg border border-indigo-100">
        <h2 className="text-2xl font-bold mb-4">Customized Checklists</h2>
        <p className="mb-6">
          Need a customized checklist for your specific industry or use case? Our experts can create 
          tailored checklists that address your unique requirements and compliance standards.
        </p>
        <div className="flex flex-wrap gap-4">
          <a href="/contact" className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors">
            Request Custom Checklist
          </a>
          <a href="/documentation/resources/checklist-guidelines" className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors">
            View Guidelines
          </a>
        </div>
      </section>
    </DocLayout>
  );
};

export default AutomationChecklists;

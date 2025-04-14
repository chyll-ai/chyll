
import React from 'react';
import DocLayout from '@/components/DocLayout';
import { Database, Download, BarChart, Tag, FileText, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

const SampleDataSets = () => {
  const sidebarLinks = [
    { title: 'Resources Overview', url: '/documentation/resources' },
    { title: 'Workflow Templates', url: '/documentation/resources/workflow-templates' },
    { title: 'Sample Data Sets', url: '/documentation/resources/sample-data', active: true },
    { title: 'Automation Checklists', url: '/documentation/resources/automation-checklists' },
    { title: 'Integration Examples', url: '/documentation/resources/integration-examples' },
  ];

  const dataSets = [
    {
      title: "E-commerce Transactions",
      description: "A dataset containing sample e-commerce orders, customer data, and product information.",
      category: "Retail",
      records: 5000,
      format: "CSV, JSON",
      lastUpdated: "April 10, 2025"
    },
    {
      title: "Customer Support Tickets",
      description: "Sample support tickets with classifications, priority levels, and resolution times.",
      category: "Customer Service",
      records: 3200,
      format: "CSV, Excel",
      lastUpdated: "March 22, 2025"
    },
    {
      title: "Marketing Campaign Results",
      description: "Test data for marketing campaigns with engagement metrics and conversion rates.",
      category: "Marketing",
      records: 1800,
      format: "CSV, JSON",
      lastUpdated: "April 5, 2025"
    },
    {
      title: "HR Employee Records",
      description: "Anonymized employee data with departments, positions, and performance metrics.",
      category: "Human Resources",
      records: 2500,
      format: "CSV, Excel",
      lastUpdated: "March 15, 2025"
    },
    {
      title: "Financial Transactions",
      description: "Sample financial data including invoices, payments, and account information.",
      category: "Finance",
      records: 4200,
      format: "CSV, Excel, JSON",
      lastUpdated: "April 8, 2025"
    },
    {
      title: "IoT Sensor Readings",
      description: "Time-series data simulating readings from various industrial IoT sensors.",
      category: "Manufacturing",
      records: 10000,
      format: "CSV, JSON",
      lastUpdated: "April 1, 2025"
    }
  ];

  return (
    <DocLayout
      title="Sample Data Sets"
      description="Test data to help you develop and validate your automation workflows"
      sidebarLinks={sidebarLinks}
      breadcrumbs={[
        { title: 'Resources', url: '/documentation/resources' },
        { title: 'Sample Data Sets', url: '/documentation/resources/sample-data' }
      ]}
      previousLink={{ title: 'Workflow Templates', url: '/documentation/resources/workflow-templates' }}
      nextLink={{ title: 'Automation Checklists', url: '/documentation/resources/automation-checklists' }}
    >
      <section className="mb-12">
        <p className="text-lg mb-6">
          Our sample data sets provide realistic test data that you can use to develop and validate your automation 
          workflows. These datasets cover various industries and use cases, allowing you to test your 
          automations with data that resembles what you'll encounter in production environments.
        </p>

        <div className="p-6 bg-blue-50 border border-blue-100 rounded-lg mb-10">
          <h3 className="text-lg font-semibold mb-2">How to Use Sample Data</h3>
          <ol className="list-decimal pl-6 space-y-2">
            <li>Download the dataset in your preferred format (CSV, JSON, or Excel)</li>
            <li>Import the data into your development environment or test system</li>
            <li>Configure your workflow to process the sample data</li>
            <li>Run tests to validate your automation's behavior with realistic data</li>
            <li>Use the included documentation to understand the data schema and relationships</li>
          </ol>
        </div>

        <div className="mb-8">
          <div className="flex flex-wrap gap-2 mb-6">
            <button className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full hover:bg-indigo-200 transition-colors">
              All Categories
            </button>
            <button className="px-3 py-1 bg-white border border-gray-200 text-gray-700 rounded-full hover:bg-gray-50 transition-colors">
              Retail
            </button>
            <button className="px-3 py-1 bg-white border border-gray-200 text-gray-700 rounded-full hover:bg-gray-50 transition-colors">
              Finance
            </button>
            <button className="px-3 py-1 bg-white border border-gray-200 text-gray-700 rounded-full hover:bg-gray-50 transition-colors">
              Marketing
            </button>
            <button className="px-3 py-1 bg-white border border-gray-200 text-gray-700 rounded-full hover:bg-gray-50 transition-colors">
              Human Resources
            </button>
            <button className="px-3 py-1 bg-white border border-gray-200 text-gray-700 rounded-full hover:bg-gray-50 transition-colors">
              Manufacturing
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {dataSets.map((dataset, index) => (
              <div key={index} className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-semibold">{dataset.title}</h3>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                    {dataset.category}
                  </span>
                </div>
                <p className="text-gray-700 mb-4">{dataset.description}</p>
                
                <div className="flex flex-wrap gap-y-3 gap-x-6 text-sm text-gray-500 mb-4">
                  <div className="flex items-center">
                    <Database className="h-4 w-4 text-gray-400 mr-1" />
                    <span>{dataset.records.toLocaleString()} records</span>
                  </div>
                  <div className="flex items-center">
                    <FileText className="h-4 w-4 text-gray-400 mr-1" />
                    <span>Format: {dataset.format}</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 text-gray-400 mr-1" />
                    <span>Updated: {dataset.lastUpdated}</span>
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  <a href="#" className="text-indigo-600 hover:text-indigo-800 font-medium">
                    View schema
                  </a>
                  <button className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors">
                    <Download className="h-4 w-4 mr-2" />
                    Download Data
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Data Visualization Examples</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <div className="p-4 border-b border-gray-200">
              <h3 className="font-semibold">E-commerce Sales by Month</h3>
            </div>
            <div className="p-4 h-64 flex items-center justify-center bg-gray-50">
              <div className="text-center">
                <BarChart className="h-12 w-12 text-indigo-400 mx-auto mb-2" />
                <p className="text-gray-500">Interactive chart preview available after download</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <div className="p-4 border-b border-gray-200">
              <h3 className="font-semibold">Customer Support Response Times</h3>
            </div>
            <div className="p-4 h-64 flex items-center justify-center bg-gray-50">
              <div className="text-center">
                <BarChart className="h-12 w-12 text-indigo-400 mx-auto mb-2" />
                <p className="text-gray-500">Interactive chart preview available after download</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-indigo-50 p-6 rounded-lg border border-indigo-100">
        <h2 className="text-2xl font-bold mb-4">Custom Data Generation</h2>
        <p className="mb-6">
          Need specific data that matches your exact requirements? Our data generation services can 
          create custom datasets based on your specifications, with options for data volume, 
          formats, and specific characteristics.
        </p>
        <div className="flex flex-wrap gap-4">
          <a href="/contact" className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors">
            Request Custom Data
          </a>
          <a href="/documentation/resources/data-generation-guidelines" className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors">
            View Service Details
          </a>
        </div>
      </section>
    </DocLayout>
  );
};

export default SampleDataSets;

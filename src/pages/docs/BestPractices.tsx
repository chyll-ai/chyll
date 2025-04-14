
import React from 'react';
import DocLayout from '@/components/DocLayout';
import { Shield, Zap, LayoutGrid, Database } from 'lucide-react';
import { Link } from 'react-router-dom';

const BestPractices = () => {
  const sidebarLinks = [
    { title: 'Performance Optimization', url: '/documentation/best-practices/performance', active: true },
    { title: 'Security Guidelines', url: '/documentation/best-practices/security' },
    { title: 'Scalability Planning', url: '/documentation/best-practices/scalability' },
    { title: 'Data Management', url: '/documentation/best-practices/data-management' },
  ];

  return (
    <DocLayout
      title="Best Practices"
      description="Optimize your use of the GenerativSchool platform"
      sidebarLinks={sidebarLinks}
      breadcrumbs={[{ title: 'Best Practices', url: '/documentation/best-practices' }]}
      nextLink={{ title: 'Security Guidelines', url: '/documentation/best-practices/security' }}
    >
      <section className="mb-12">
        <p className="text-lg mb-6">
          Following these best practices will help you get the most out of GenerativSchool while 
          ensuring your automations are efficient, secure, and scalable.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center mb-4">
              <Zap className="h-8 w-8 text-indigo-600 mr-3" />
              <h3 className="text-xl font-semibold">Performance Optimization</h3>
            </div>
            <p className="text-gray-700 mb-4">
              Learn how to optimize your workflows for maximum speed and efficiency, reducing execution times and resource usage.
            </p>
            <Link to="/documentation/best-practices/performance" className="text-indigo-600 hover:text-indigo-800 font-medium">
              Learn more →
            </Link>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center mb-4">
              <Shield className="h-8 w-8 text-indigo-600 mr-3" />
              <h3 className="text-xl font-semibold">Security Guidelines</h3>
            </div>
            <p className="text-gray-700 mb-4">
              Ensure your automations and data remain secure with our comprehensive security best practices.
            </p>
            <Link to="/documentation/best-practices/security" className="text-indigo-600 hover:text-indigo-800 font-medium">
              Learn more →
            </Link>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center mb-4">
              <LayoutGrid className="h-8 w-8 text-indigo-600 mr-3" />
              <h3 className="text-xl font-semibold">Scalability Planning</h3>
            </div>
            <p className="text-gray-700 mb-4">
              Prepare your automations to scale as your business grows, handling increasing workloads without performance degradation.
            </p>
            <Link to="/documentation/best-practices/scalability" className="text-indigo-600 hover:text-indigo-800 font-medium">
              Learn more →
            </Link>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center mb-4">
              <Database className="h-8 w-8 text-indigo-600 mr-3" />
              <h3 className="text-xl font-semibold">Data Management</h3>
            </div>
            <p className="text-gray-700 mb-4">
              Best practices for organizing, storing, and processing data within your workflows.
            </p>
            <Link to="/documentation/best-practices/data-management" className="text-indigo-600 hover:text-indigo-800 font-medium">
              Learn more →
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-gray-50 p-6 rounded-lg border border-gray-200 mb-12">
        <h2 className="text-2xl font-bold mb-4">Why Best Practices Matter</h2>
        <p className="mb-4">
          Following established best practices helps you avoid common pitfalls and ensures that your automation 
          workflows remain:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Efficient and performant even as you scale</li>
          <li>Secure against potential vulnerabilities</li>
          <li>Maintainable by your team over time</li>
          <li>Resilient to errors and unexpected conditions</li>
          <li>Adaptable to changing business requirements</li>
        </ul>
      </section>
    </DocLayout>
  );
};

export default BestPractices;


import React from 'react';
import DocLayout from '@/components/DocLayout';

const DataManagement = () => {
  const sidebarLinks = [
    { title: 'Best Practices Overview', url: '/documentation/best-practices' },
    { title: 'Performance Optimization', url: '/documentation/best-practices/performance' },
    { title: 'Security Guidelines', url: '/documentation/best-practices/security' },
    { title: 'Scalability Planning', url: '/documentation/best-practices/scalability' },
    { title: 'Data Management', url: '/documentation/best-practices/data-management', active: true },
  ];

  return (
    <DocLayout
      title="Data Management"
      description="Best practices for handling and processing data in workflows"
      sidebarLinks={sidebarLinks}
      breadcrumbs={[
        { title: 'Best Practices', url: '/documentation/best-practices' },
        { title: 'Data Management', url: '/documentation/best-practices/data-management' }
      ]}
      previousLink={{ title: 'Scalability Planning', url: '/documentation/best-practices/scalability' }}
    >
      <section className="mb-12">
        <p className="text-lg mb-6">
          Learn how to effectively organize, store, and process data within your automations.
        </p>
        {/* Data Management content will be added here */}
      </section>
    </DocLayout>
  );
};

export default DataManagement;

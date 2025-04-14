
import React from 'react';
import DocLayout from '@/components/DocLayout';

const Scalability = () => {
  const sidebarLinks = [
    { title: 'Best Practices Overview', url: '/documentation/best-practices' },
    { title: 'Performance Optimization', url: '/documentation/best-practices/performance' },
    { title: 'Security Guidelines', url: '/documentation/best-practices/security' },
    { title: 'Scalability Planning', url: '/documentation/best-practices/scalability', active: true },
    { title: 'Data Management', url: '/documentation/best-practices/data-management' },
  ];

  return (
    <DocLayout
      title="Scalability Planning"
      description="Design workflows that grow with your business needs"
      sidebarLinks={sidebarLinks}
      breadcrumbs={[
        { title: 'Best Practices', url: '/documentation/best-practices' },
        { title: 'Scalability Planning', url: '/documentation/best-practices/scalability' }
      ]}
      previousLink={{ title: 'Security Guidelines', url: '/documentation/best-practices/security' }}
      nextLink={{ title: 'Data Management', url: '/documentation/best-practices/data-management' }}
    >
      <section className="mb-12">
        <p className="text-lg mb-6">
          Learn how to build automations that can handle growing workloads efficiently.
        </p>
        {/* Scalability content will be added here */}
      </section>
    </DocLayout>
  );
};

export default Scalability;

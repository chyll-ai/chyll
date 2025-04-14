import React from 'react';
import DocLayout from '@/components/DocLayout';

const Performance = () => {
  const sidebarLinks = [
    { title: 'Best Practices Overview', url: '/documentation/best-practices' },
    { title: 'Performance Optimization', url: '/documentation/best-practices/performance', active: true },
    { title: 'Security Guidelines', url: '/documentation/best-practices/security' },
    { title: 'Scalability Planning', url: '/documentation/best-practices/scalability' },
    { title: 'Data Management', url: '/documentation/best-practices/data-management' },
  ];

  return (
    <DocLayout
      title="Performance Optimization"
      description="Strategies to maximize the speed and efficiency of your workflows"
      sidebarLinks={sidebarLinks}
      breadcrumbs={[
        { title: 'Best Practices', url: '/documentation/best-practices' },
        { title: 'Performance Optimization', url: '/documentation/best-practices/performance' }
      ]}
      previousLink={{ title: 'Best Practices Overview', url: '/documentation/best-practices' }}
      nextLink={{ title: 'Security Guidelines', url: '/documentation/best-practices/security' }}
    >
      <section className="mb-12">
        <p className="text-lg mb-6">
          Learn how to optimize your GenerativSchool workflows for maximum performance and efficiency.
        </p>
        {/* Performance content will be added here */}
      </section>
    </DocLayout>
  );
};

export default Performance;

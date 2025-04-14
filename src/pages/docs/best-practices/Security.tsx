
import React from 'react';
import DocLayout from '@/components/DocLayout';

const Security = () => {
  const sidebarLinks = [
    { title: 'Best Practices Overview', url: '/documentation/best-practices' },
    { title: 'Performance Optimization', url: '/documentation/best-practices/performance' },
    { title: 'Security Guidelines', url: '/documentation/best-practices/security', active: true },
    { title: 'Scalability Planning', url: '/documentation/best-practices/scalability' },
    { title: 'Data Management', url: '/documentation/best-practices/data-management' },
  ];

  return (
    <DocLayout
      title="Security Guidelines"
      description="Best practices for maintaining security in your workflows"
      sidebarLinks={sidebarLinks}
      breadcrumbs={[
        { title: 'Best Practices', url: '/documentation/best-practices' },
        { title: 'Security Guidelines', url: '/documentation/best-practices/security' }
      ]}
      previousLink={{ title: 'Performance Optimization', url: '/documentation/best-practices/performance' }}
      nextLink={{ title: 'Scalability Planning', url: '/documentation/best-practices/scalability' }}
    >
      <section className="mb-12">
        <p className="text-lg mb-6">
          Implement robust security measures to protect your automations and data.
        </p>
        {/* Security content will be added here */}
      </section>
    </DocLayout>
  );
};

export default Security;

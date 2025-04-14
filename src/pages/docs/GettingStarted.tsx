
import React from 'react';
import DocLayout from '@/components/DocLayout';
import { Link } from 'react-router-dom';
import { RocketIcon, LayoutDashboard, Settings, Zap } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const GettingStarted = () => {
  const sidebarLinks = [
    { title: 'Overview', url: '/documentation/getting-started', active: true },
    { title: 'Quick Start Guide', url: '/documentation/getting-started/quick-start' },
    { title: 'Platform Overview', url: '/documentation/getting-started/platform-overview' },
    { title: 'Setting Up Your Account', url: '/documentation/getting-started/account-setup' },
    { title: 'Creating Your First Automation', url: '/documentation/getting-started/first-automation' },
  ];

  return (
    <DocLayout
      title="Getting Started"
      description="Learn the basics of using GenerativSchool to automate your workflows and processes."
      sidebarLinks={sidebarLinks}
      breadcrumbs={[{ title: 'Getting Started', url: '/documentation/getting-started' }]}
      nextLink={{ title: 'Quick Start Guide', url: '/documentation/getting-started/quick-start' }}
    >
      <section className="mb-12">
        <p className="text-lg">
          Welcome to GenerativSchool! Our platform provides intuitive tools for creating automated workflows, 
          integrating with your existing systems, and deploying AI solutions without extensive coding knowledge.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          <Card>
            <CardHeader className="flex flex-row items-center gap-4">
              <RocketIcon className="h-8 w-8 text-indigo-600" />
              <div>
                <CardTitle>Quick Start Guide</CardTitle>
                <CardDescription>Get up and running in minutes</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <p className="mb-4">Learn the essentials to get started with GenerativSchool quickly.</p>
              <Link 
                to="/documentation/getting-started/quick-start"
                className="text-indigo-600 hover:text-indigo-800 font-medium"
              >
                Read the guide →
              </Link>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center gap-4">
              <LayoutDashboard className="h-8 w-8 text-indigo-600" />
              <div>
                <CardTitle>Platform Overview</CardTitle>
                <CardDescription>Understand the platform architecture</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <p className="mb-4">Get a comprehensive overview of the GenerativSchool platform.</p>
              <Link 
                to="/documentation/getting-started/platform-overview"
                className="text-indigo-600 hover:text-indigo-800 font-medium"
              >
                Learn about the platform →
              </Link>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center gap-4">
              <Settings className="h-8 w-8 text-indigo-600" />
              <div>
                <CardTitle>Setting Up Your Account</CardTitle>
                <CardDescription>Configure your workspace</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <p className="mb-4">Learn how to configure your account settings for optimal use.</p>
              <Link 
                to="/documentation/getting-started/account-setup"
                className="text-indigo-600 hover:text-indigo-800 font-medium"
              >
                Set up your account →
              </Link>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center gap-4">
              <Zap className="h-8 w-8 text-indigo-600" />
              <div>
                <CardTitle>Creating Your First Automation</CardTitle>
                <CardDescription>Build a workflow in minutes</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <p className="mb-4">Follow this step-by-step guide to create your first automation.</p>
              <Link 
                to="/documentation/getting-started/first-automation"
                className="text-indigo-600 hover:text-indigo-800 font-medium"
              >
                Create an automation →
              </Link>
            </CardContent>
          </Card>
        </div>
      </section>
    </DocLayout>
  );
};

export default GettingStarted;

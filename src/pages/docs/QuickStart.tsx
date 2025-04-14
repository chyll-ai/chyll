
import React from 'react';
import DocLayout from '@/components/DocLayout';
import { ArrowRight } from 'lucide-react';

const QuickStart = () => {
  const sidebarLinks = [
    { title: 'Overview', url: '/documentation/getting-started' },
    { title: 'Quick Start Guide', url: '/documentation/getting-started/quick-start', active: true },
    { title: 'Platform Overview', url: '/documentation/getting-started/platform-overview' },
    { title: 'Setting Up Your Account', url: '/documentation/getting-started/account-setup' },
    { title: 'Creating Your First Automation', url: '/documentation/getting-started/first-automation' },
  ];

  const breadcrumbs = [
    { title: 'Getting Started', url: '/documentation/getting-started' },
    { title: 'Quick Start Guide', url: '/documentation/getting-started/quick-start' },
  ];

  return (
    <DocLayout
      title="Quick Start Guide"
      description="Get up and running with GenerativSchool in just a few minutes"
      sidebarLinks={sidebarLinks}
      breadcrumbs={breadcrumbs}
      previousLink={{ title: 'Getting Started', url: '/documentation/getting-started' }}
      nextLink={{ title: 'Platform Overview', url: '/documentation/getting-started/platform-overview' }}
    >
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Quick Start Guide</h2>
        <p className="mb-4">
          This guide will help you quickly get started with GenerativSchool. Follow these steps to set up your account
          and create your first automation.
        </p>
      </div>

      <div className="space-y-12">
        <section>
          <h3 className="text-xl font-semibold mb-4 flex items-center">
            <span className="bg-indigo-100 text-indigo-700 rounded-full w-8 h-8 flex items-center justify-center mr-3">1</span>
            Create Your Account
          </h3>
          <div className="ml-11">
            <p className="mb-4">
              Sign up for a GenerativSchool account by visiting our homepage and clicking the "Sign Up" button.
              You can use your email or sign in with Google, Microsoft, or Apple accounts.
            </p>
            <ol className="list-decimal pl-6 space-y-2 mb-4">
              <li>Navigate to the GenerativSchool homepage</li>
              <li>Click the "Sign Up" button in the top right corner</li>
              <li>Enter your email address and create a password, or use a social login</li>
              <li>Check your email to verify your account</li>
            </ol>
            <div className="bg-indigo-50 p-4 rounded-md mb-4">
              <p className="text-sm text-indigo-800">
                <strong>Pro Tip:</strong> Use a work email to easily collaborate with your team members later.
              </p>
            </div>
          </div>
        </section>

        <section>
          <h3 className="text-xl font-semibold mb-4 flex items-center">
            <span className="bg-indigo-100 text-indigo-700 rounded-full w-8 h-8 flex items-center justify-center mr-3">2</span>
            Set Up Your Workspace
          </h3>
          <div className="ml-11">
            <p className="mb-4">
              After verifying your email, you'll be prompted to set up your workspace. This is where you'll manage all your automations and workflows.
            </p>
            <ol className="list-decimal pl-6 space-y-2 mb-4">
              <li>Give your workspace a name (e.g., "Marketing Automation" or your company name)</li>
              <li>Choose your industry to get tailored templates</li>
              <li>Invite team members if you'd like to collaborate right away</li>
              <li>Select the plan that best fits your needs</li>
            </ol>
          </div>
        </section>

        <section>
          <h3 className="text-xl font-semibold mb-4 flex items-center">
            <span className="bg-indigo-100 text-indigo-700 rounded-full w-8 h-8 flex items-center justify-center mr-3">3</span>
            Explore the Dashboard
          </h3>
          <div className="ml-11">
            <p className="mb-4">
              Once your workspace is set up, you'll be taken to the main dashboard. Take a few minutes to explore the interface and get familiar with the main sections:
            </p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li><strong>Workflows:</strong> Create and manage your automated processes</li>
              <li><strong>Integrations:</strong> Connect to third-party services and APIs</li>
              <li><strong>Templates:</strong> Pre-built workflows to get started quickly</li>
              <li><strong>Reports:</strong> Track the performance of your automations</li>
              <li><strong>Settings:</strong> Configure your account and workspace preferences</li>
            </ul>
            <div className="bg-yellow-50 p-4 rounded-md mb-4">
              <p className="text-sm text-yellow-800">
                <strong>Note:</strong> If you're not seeing all these sections, you might need to upgrade your plan for full access.
              </p>
            </div>
          </div>
        </section>

        <section>
          <h3 className="text-xl font-semibold mb-4 flex items-center">
            <span className="bg-indigo-100 text-indigo-700 rounded-full w-8 h-8 flex items-center justify-center mr-3">4</span>
            Create Your First Automation
          </h3>
          <div className="ml-11">
            <p className="mb-4">
              Now it's time to create your first automation. Let's start with something simple:
            </p>
            <ol className="list-decimal pl-6 space-y-2 mb-4">
              <li>Click on "Workflows" in the left sidebar</li>
              <li>Click the "Create Workflow" button</li>
              <li>Select "Blank Workflow" or choose from one of our templates</li>
              <li>Give your workflow a name</li>
              <li>Use our visual editor to add and connect workflow steps</li>
              <li>Save and activate your workflow</li>
            </ol>
            <div className="bg-indigo-50 p-4 rounded-md mb-4">
              <p className="text-sm text-indigo-800">
                <strong>Pro Tip:</strong> Start with our "Email on Form Submission" template for a quick win.
              </p>
            </div>
          </div>
        </section>

        <section>
          <h3 className="text-xl font-semibold mb-4 flex items-center">
            <span className="bg-indigo-100 text-indigo-700 rounded-full w-8 h-8 flex items-center justify-center mr-3">5</span>
            Next Steps
          </h3>
          <div className="ml-11">
            <p className="mb-4">
              Congratulations on creating your first automation! Here are some next steps to explore:
            </p>
            <ul className="space-y-3 mb-6">
              <li className="flex">
                <ArrowRight className="h-5 w-5 text-indigo-600 mr-2 flex-shrink-0 mt-0.5" />
                <span><strong>Explore Integrations</strong> - Connect your favorite tools and services</span>
              </li>
              <li className="flex">
                <ArrowRight className="h-5 w-5 text-indigo-600 mr-2 flex-shrink-0 mt-0.5" />
                <span><strong>Try Advanced Features</strong> - Experiment with conditional logic and branching</span>
              </li>
              <li className="flex">
                <ArrowRight className="h-5 w-5 text-indigo-600 mr-2 flex-shrink-0 mt-0.5" />
                <span><strong>Join Our Community</strong> - Connect with other users in our forum</span>
              </li>
              <li className="flex">
                <ArrowRight className="h-5 w-5 text-indigo-600 mr-2 flex-shrink-0 mt-0.5" />
                <span><strong>Schedule a Demo</strong> - Get a personalized walkthrough from our team</span>
              </li>
            </ul>
          </div>
        </section>
      </div>

      <div className="mt-12 p-6 bg-gray-50 rounded-lg border border-gray-200">
        <h3 className="text-lg font-semibold mb-3">Need Help?</h3>
        <p className="mb-4">
          If you're having trouble getting started, don't hesitate to reach out. Our support team is here to help.
        </p>
        <div className="flex flex-wrap gap-4">
          <a href="/support" className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors">
            Contact Support
          </a>
          <a href="/documentation/videos" className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors">
            Watch Tutorial Videos
          </a>
        </div>
      </div>
    </DocLayout>
  );
};

export default QuickStart;

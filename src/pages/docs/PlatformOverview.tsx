
import React from 'react';
import DocLayout from '@/components/DocLayout';

const PlatformOverview = () => {
  const sidebarLinks = [
    { title: 'Overview', url: '/documentation/getting-started' },
    { title: 'Quick Start Guide', url: '/documentation/getting-started/quick-start' },
    { title: 'Platform Overview', url: '/documentation/getting-started/platform-overview', active: true },
    { title: 'Setting Up Your Account', url: '/documentation/getting-started/account-setup' },
    { title: 'Creating Your First Automation', url: '/documentation/getting-started/first-automation' },
  ];

  const breadcrumbs = [
    { title: 'Getting Started', url: '/documentation/getting-started' },
    { title: 'Platform Overview', url: '/documentation/getting-started/platform-overview' },
  ];

  return (
    <DocLayout
      title="Platform Overview"
      description="Understanding the GenerativSchool platform architecture and components"
      sidebarLinks={sidebarLinks}
      breadcrumbs={breadcrumbs}
      previousLink={{ title: 'Quick Start Guide', url: '/documentation/getting-started/quick-start' }}
      nextLink={{ title: 'Setting Up Your Account', url: '/documentation/getting-started/account-setup' }}
    >
      <div className="space-y-8">
        <section>
          <h2 className="text-2xl font-bold mb-4">Platform Architecture</h2>
          <p className="mb-4">
            GenerativSchool is built on a modern, scalable architecture that enables powerful automation while 
            maintaining ease of use. Our platform consists of several core components that work together seamlessly.
          </p>
          
          <div className="bg-indigo-50 p-6 rounded-lg mb-8">
            <h3 className="text-lg font-semibold mb-3">Core Components</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <div className="bg-indigo-100 rounded-full p-1 mr-3 mt-1">
                  <div className="bg-indigo-600 w-2 h-2 rounded-full"></div>
                </div>
                <div>
                  <strong className="block text-gray-900">Workflow Engine</strong>
                  <p className="text-gray-700">Handles the execution of your automated processes with enterprise-grade reliability.</p>
                </div>
              </li>
              <li className="flex items-start">
                <div className="bg-indigo-100 rounded-full p-1 mr-3 mt-1">
                  <div className="bg-indigo-600 w-2 h-2 rounded-full"></div>
                </div>
                <div>
                  <strong className="block text-gray-900">Integration Hub</strong>
                  <p className="text-gray-700">Connects to thousands of external services and APIs securely.</p>
                </div>
              </li>
              <li className="flex items-start">
                <div className="bg-indigo-100 rounded-full p-1 mr-3 mt-1">
                  <div className="bg-indigo-600 w-2 h-2 rounded-full"></div>
                </div>
                <div>
                  <strong className="block text-gray-900">AI Processing Layer</strong>
                  <p className="text-gray-700">Applies intelligent decision-making to your workflows using our proprietary algorithms.</p>
                </div>
              </li>
              <li className="flex items-start">
                <div className="bg-indigo-100 rounded-full p-1 mr-3 mt-1">
                  <div className="bg-indigo-600 w-2 h-2 rounded-full"></div>
                </div>
                <div>
                  <strong className="block text-gray-900">Data Storage</strong>
                  <p className="text-gray-700">Securely stores your workflow data with enterprise-grade encryption.</p>
                </div>
              </li>
              <li className="flex items-start">
                <div className="bg-indigo-100 rounded-full p-1 mr-3 mt-1">
                  <div className="bg-indigo-600 w-2 h-2 rounded-full"></div>
                </div>
                <div>
                  <strong className="block text-gray-900">Visual Designer</strong>
                  <p className="text-gray-700">Our intuitive interface for building and editing workflows without code.</p>
                </div>
              </li>
            </ul>
          </div>
        </section>
        
        <section>
          <h2 className="text-2xl font-bold mb-4">Key Features</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="border border-gray-200 rounded-lg p-5">
              <h3 className="text-lg font-semibold mb-2">Visual Workflow Builder</h3>
              <p className="text-gray-700">
                Drag-and-drop interface for creating complex workflows without coding. Connect actions, conditions, and 
                triggers using our intuitive visual canvas.
              </p>
            </div>
            
            <div className="border border-gray-200 rounded-lg p-5">
              <h3 className="text-lg font-semibold mb-2">Intelligent Automation</h3>
              <p className="text-gray-700">
                AI-powered decision making that can learn from your data patterns to optimize workflows and suggest improvements.
              </p>
            </div>
            
            <div className="border border-gray-200 rounded-lg p-5">
              <h3 className="text-lg font-semibold mb-2">Enterprise Integrations</h3>
              <p className="text-gray-700">
                Connect to over 1,000+ services and apps through our extensive integration library. Custom API support for proprietary systems.
              </p>
            </div>
            
            <div className="border border-gray-200 rounded-lg p-5">
              <h3 className="text-lg font-semibold mb-2">Data Processing</h3>
              <p className="text-gray-700">
                Transform, filter, and route data between systems with powerful mapping tools and conditional logic.
              </p>
            </div>
            
            <div className="border border-gray-200 rounded-lg p-5">
              <h3 className="text-lg font-semibold mb-2">Real-time Monitoring</h3>
              <p className="text-gray-700">
                Track the execution of your workflows with detailed logs and receive alerts for any issues that arise.
              </p>
            </div>
            
            <div className="border border-gray-200 rounded-lg p-5">
              <h3 className="text-lg font-semibold mb-2">Multi-environment Support</h3>
              <p className="text-gray-700">
                Develop and test workflows in isolated environments before deploying to production.
              </p>
            </div>
          </div>
        </section>
        
        <section>
          <h2 className="text-2xl font-bold mb-4">User Interface Overview</h2>
          
          <p className="mb-6">
            The GenerativSchool interface is designed to be intuitive and powerful, providing all the tools you need to 
            create, manage, and monitor your automations.
          </p>
          
          <div className="space-y-6 mb-8">
            <div>
              <h3 className="text-lg font-semibold mb-2">Dashboard</h3>
              <p className="text-gray-700 mb-3">
                Your central command center for monitoring all activity across your automations. View execution statistics, 
                recent logs, and system health at a glance.
              </p>
              <div className="border border-gray-200 rounded-lg p-4 bg-gray-50 text-sm">
                Key elements: Executive summary, workflow status cards, activity feed, health metrics
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-2">Workflow Designer</h3>
              <p className="text-gray-700 mb-3">
                Our visual canvas where you build automations by adding and connecting steps. Includes a comprehensive 
                library of actions, triggers, and logic controls.
              </p>
              <div className="border border-gray-200 rounded-lg p-4 bg-gray-50 text-sm">
                Key elements: Canvas, step library, connection lines, property panel, testing tools
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-2">Integration Marketplace</h3>
              <p className="text-gray-700 mb-3">
                Browse and install connections to external services and APIs. Manage authentication and configuration 
                for all your integrated services.
              </p>
              <div className="border border-gray-200 rounded-lg p-4 bg-gray-50 text-sm">
                Key elements: Service catalog, connection manager, authentication profiles, API credentials
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-2">Execution Logs</h3>
              <p className="text-gray-700 mb-3">
                Detailed records of all workflow executions, including inputs, outputs, and any errors encountered. 
                Essential for debugging and auditing.
              </p>
              <div className="border border-gray-200 rounded-lg p-4 bg-gray-50 text-sm">
                Key elements: Log browser, execution details, error information, data inspector
              </div>
            </div>
          </div>
        </section>
        
        <section>
          <h2 className="text-2xl font-bold mb-4">Underlying Technology</h2>
          
          <p className="mb-6">
            GenerativSchool is built on modern, enterprise-grade technology that ensures reliability, security, and performance.
          </p>
          
          <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
            <p className="text-gray-700 mb-4">
              Our platform leverages a proprietary blend of technologies optimized for automation workflows:
            </p>
            
            <ul className="space-y-2">
              <li className="flex items-center">
                <span className="text-indigo-600 mr-2">✓</span>
                <span>Distributed execution engine for maximum reliability</span>
              </li>
              <li className="flex items-center">
                <span className="text-indigo-600 mr-2">✓</span>
                <span>Cloud-native architecture with auto-scaling capabilities</span>
              </li>
              <li className="flex items-center">
                <span className="text-indigo-600 mr-2">✓</span>
                <span>Advanced AI algorithms for predictive workflow optimization</span>
              </li>
              <li className="flex items-center">
                <span className="text-indigo-600 mr-2">✓</span>
                <span>Enterprise-grade security with SOC 2 and GDPR compliance</span>
              </li>
              <li className="flex items-center">
                <span className="text-indigo-600 mr-2">✓</span>
                <span>Real-time monitoring and alerting infrastructure</span>
              </li>
            </ul>
          </div>
        </section>
      </div>
    </DocLayout>
  );
};

export default PlatformOverview;

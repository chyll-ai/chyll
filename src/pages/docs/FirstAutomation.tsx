
import React from 'react';
import DocLayout from '@/components/DocLayout';
import { Zap, FileSearch, GitBranch, Play, Save, Clock } from 'lucide-react';

const FirstAutomation = () => {
  const sidebarLinks = [
    { title: 'Overview', url: '/documentation/getting-started' },
    { title: 'Quick Start Guide', url: '/documentation/getting-started/quick-start' },
    { title: 'Platform Overview', url: '/documentation/getting-started/platform-overview' },
    { title: 'Setting Up Your Account', url: '/documentation/getting-started/account-setup' },
    { title: 'Creating Your First Automation', url: '/documentation/getting-started/first-automation', active: true },
  ];

  return (
    <DocLayout
      title="Creating Your First Automation"
      description="Build a powerful workflow in minutes with GenerativSchool"
      sidebarLinks={sidebarLinks}
      breadcrumbs={[
        { title: 'Getting Started', url: '/documentation/getting-started' },
        { title: 'Creating Your First Automation', url: '/documentation/getting-started/first-automation' }
      ]}
      previousLink={{ title: 'Setting Up Your Account', url: '/documentation/getting-started/account-setup' }}
    >
      <section className="mb-12">
        <p className="text-lg mb-6">
          In this guide, we'll walk through creating a simple but powerful automation that triggers an email 
          notification when a new lead is added to your CRM. This practical example will demonstrate the core 
          concepts of building workflows in GenerativSchool.
        </p>

        <div className="p-6 bg-orange-50 border border-orange-100 rounded-lg mb-10">
          <h3 className="text-lg font-semibold mb-2">Before You Begin</h3>
          <p>
            Make sure you have completed your account setup and have access to the 
            automation builder. You should also have your email service connected to your workspace.
          </p>
        </div>

        <div className="space-y-12">
          <div className="relative pl-10 pb-12 border-l-2 border-indigo-200">
            <div className="absolute left-[-18px] bg-indigo-600 text-white w-9 h-9 rounded-full flex items-center justify-center font-bold">1</div>
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <FileSearch className="h-6 w-6 text-indigo-600" />
              Create a New Workflow
            </h3>
            <p className="mb-4">
              Start by creating a new workflow in the automation builder:
            </p>
            <ol className="list-decimal pl-6 space-y-2 mb-6">
              <li>From your dashboard, click the <strong>Create</strong> button in the top right</li>
              <li>Select <strong>New Workflow</strong> from the dropdown menu</li>
              <li>Name your workflow (e.g., "New Lead Notification")</li>
              <li>Add a brief description to help your team understand its purpose</li>
              <li>Click <strong>Create</strong> to open the workflow builder</li>
            </ol>
            <div className="bg-gray-50 p-4 rounded border border-gray-200">
              <p className="text-sm text-gray-700">
                <strong>Pro Tip:</strong> Use descriptive names for your workflows so that team members can 
                easily understand their purpose. Consider including the trigger and action in the name.
              </p>
            </div>
          </div>

          <div className="relative pl-10 pb-12 border-l-2 border-indigo-200">
            <div className="absolute left-[-18px] bg-indigo-600 text-white w-9 h-9 rounded-full flex items-center justify-center font-bold">2</div>
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Zap className="h-6 w-6 text-indigo-600" />
              Configure the Trigger
            </h3>
            <p className="mb-4">
              Set up what will start your workflow:
            </p>
            <ol className="list-decimal pl-6 space-y-2 mb-6">
              <li>In the workflow builder, click on the <strong>+ Add Trigger</strong> button</li>
              <li>Select <strong>CRM</strong> from the category list</li>
              <li>Choose <strong>New Lead Created</strong> as your trigger</li>
              <li>Configure any trigger settings (such as specific lead sources to monitor)</li>
              <li>Click <strong>Save Trigger</strong> to confirm</li>
            </ol>
            <div className="bg-gray-50 p-4 rounded border border-gray-200">
              <p className="text-sm text-gray-700">
                <strong>Pro Tip:</strong> You can add filter conditions to your trigger to only run the workflow for 
                specific types of leads, such as those from a particular campaign or with a certain score range.
              </p>
            </div>
          </div>

          <div className="relative pl-10 pb-12 border-l-2 border-indigo-200">
            <div className="absolute left-[-18px] bg-indigo-600 text-white w-9 h-9 rounded-full flex items-center justify-center font-bold">3</div>
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <GitBranch className="h-6 w-6 text-indigo-600" />
              Add Conditional Logic (Optional)
            </h3>
            <p className="mb-4">
              Add decision points to make your workflow smarter:
            </p>
            <ol className="list-decimal pl-6 space-y-2 mb-6">
              <li>Click <strong>+ Add Step</strong> after your trigger</li>
              <li>Select <strong>Conditional</strong> from the step types</li>
              <li>Create a condition (e.g., "Lead Score &gt; 50")</li>
              <li>Configure the paths for when the condition is true or false</li>
              <li>Click <strong>Save</strong> to confirm your condition</li>
            </ol>
            <div className="bg-gray-50 p-4 rounded border border-gray-200">
              <p className="text-sm text-gray-700">
                <strong>Pro Tip:</strong> You can add multiple conditions and nest them to create complex decision trees. 
                This allows you to send different notifications based on lead characteristics.
              </p>
            </div>
          </div>

          <div className="relative pl-10 pb-12 border-l-2 border-indigo-200">
            <div className="absolute left-[-18px] bg-indigo-600 text-white w-9 h-9 rounded-full flex items-center justify-center font-bold">4</div>
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Play className="h-6 w-6 text-indigo-600" />
              Add an Action
            </h3>
            <p className="mb-4">
              Configure what happens when the workflow runs:
            </p>
            <ol className="list-decimal pl-6 space-y-2 mb-6">
              <li>Click <strong>+ Add Step</strong> (or add to a specific condition branch)</li>
              <li>Select <strong>Email</strong> from the action categories</li>
              <li>Choose <strong>Send Email Notification</strong> as your action</li>
              <li>Configure the email details:
                <ul className="list-disc pl-6 space-y-2 mt-2">
                  <li>Recipients (team members or dynamic recipients)</li>
                  <li>Subject line (e.g., "New Lead: {"{"}{"{"}"lead.name"{"}"}{"}"}")</li>
                  <li>Email body with dynamic content from the lead record</li>
                  <li>Add any attachments or formatting options</li>
                </ul>
              </li>
              <li>Click <strong>Save Action</strong> to confirm</li>
            </ol>
            <div className="bg-gray-50 p-4 rounded border border-gray-200">
              <p className="text-sm text-gray-700">
                <strong>Pro Tip:</strong> Use dynamic placeholders (indicated by {"{"}{"{"} {"}"}{"}"}{"}"}) to personalize your emails 
                with data from the lead record. This makes your notifications more informative and actionable.
              </p>
            </div>
          </div>

          <div className="relative pl-10 pb-12 border-l-2 border-indigo-200">
            <div className="absolute left-[-18px] bg-indigo-600 text-white w-9 h-9 rounded-full flex items-center justify-center font-bold">5</div>
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Save className="h-6 w-6 text-indigo-600" />
              Save and Activate Your Workflow
            </h3>
            <p className="mb-4">
              Finalize and activate your automation:
            </p>
            <ol className="list-decimal pl-6 space-y-2 mb-6">
              <li>Review your entire workflow to ensure it's configured correctly</li>
              <li>Click the <strong>Save</strong> button in the top right of the builder</li>
              <li>Toggle the <strong>Active</strong> switch to enable your workflow</li>
              <li>Confirm that you want to activate the workflow</li>
            </ol>
            <div className="bg-gray-50 p-4 rounded border border-gray-200">
              <p className="text-sm text-gray-700">
                <strong>Pro Tip:</strong> You can use the "Test" feature to run your workflow with sample data before activating 
                it in production. This helps catch any issues before they affect your team.
              </p>
            </div>
          </div>

          <div className="relative pl-10">
            <div className="absolute left-[-18px] bg-indigo-600 text-white w-9 h-9 rounded-full flex items-center justify-center font-bold">6</div>
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Clock className="h-6 w-6 text-indigo-600" />
              Monitor and Optimize
            </h3>
            <p className="mb-4">
              Track your workflow's performance and make improvements:
            </p>
            <ol className="list-decimal pl-6 space-y-2 mb-6">
              <li>Go to the <strong>Monitoring</strong> tab on your workflow page</li>
              <li>Review execution history and success rates</li>
              <li>Check for any errors or warnings</li>
              <li>Analyze performance metrics like average execution time</li>
              <li>Make adjustments to improve effectiveness or efficiency</li>
            </ol>
            <div className="bg-gray-50 p-4 rounded border border-gray-200">
              <p className="text-sm text-gray-700">
                <strong>Pro Tip:</strong> Set up alert notifications for workflow failures so you can quickly address 
                any issues that arise. This ensures your automations remain reliable.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4">What You've Learned</h2>
        
        <p className="mb-6">
          By creating this workflow, you've learned the fundamental concepts of automating processes in GenerativSchool:
        </p>
        
        <ul className="space-y-4">
          <li className="flex gap-3">
            <div className="flex-shrink-0 h-6 w-6 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center font-semibold">✓</div>
            <div>
              <strong className="text-lg">Triggers:</strong> 
              <p className="text-gray-700">Events that start your workflow automation</p>
            </div>
          </li>
          <li className="flex gap-3">
            <div className="flex-shrink-0 h-6 w-6 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center font-semibold">✓</div>
            <div>
              <strong className="text-lg">Conditions:</strong> 
              <p className="text-gray-700">Decision points that create different paths in your workflow</p>
            </div>
          </li>
          <li className="flex gap-3">
            <div className="flex-shrink-0 h-6 w-6 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center font-semibold">✓</div>
            <div>
              <strong className="text-lg">Actions:</strong> 
              <p className="text-gray-700">Tasks that your workflow performs automatically</p>
            </div>
          </li>
          <li className="flex gap-3">
            <div className="flex-shrink-0 h-6 w-6 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center font-semibold">✓</div>
            <div>
              <strong className="text-lg">Dynamic Data:</strong> 
              <p className="text-gray-700">Using information from your systems within your workflows</p>
            </div>
          </li>
        </ul>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4">Next Steps</h2>
        
        <p className="mb-6">
          Now that you've created your first automation, here are some ways to expand your skills:
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gradient-to-r from-purple-50 to-indigo-50 p-6 rounded-lg border border-indigo-100">
            <h3 className="text-xl font-semibold mb-3">Explore Advanced Triggers</h3>
            <p className="mb-3">
              Learn about webhook triggers, scheduled triggers, and custom event triggers to automate more complex scenarios.
            </p>
          </div>
          
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-6 rounded-lg border border-indigo-100">
            <h3 className="text-xl font-semibold mb-3">Multi-step Workflows</h3>
            <p className="mb-3">
              Create sequences of actions with dependencies and time delays between steps.
            </p>
          </div>
          
          <div className="bg-gradient-to-r from-purple-50 to-indigo-50 p-6 rounded-lg border border-indigo-100">
            <h3 className="text-xl font-semibold mb-3">Data Transformations</h3>
            <p className="mb-3">
              Learn to manipulate and format data between systems using our transformation tools.
            </p>
          </div>
          
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-6 rounded-lg border border-indigo-100">
            <h3 className="text-xl font-semibold mb-3">Template Library</h3>
            <p className="mb-3">
              Browse our template library for pre-built workflows that you can customize for your needs.
            </p>
          </div>
        </div>
      </section>
    </DocLayout>
  );
};

export default FirstAutomation;

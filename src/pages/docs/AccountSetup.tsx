
import React from 'react';
import DocLayout from '@/components/DocLayout';
import { Link } from 'react-router-dom';
import { User, Lock, Shield, Bell, Key, Settings } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const AccountSetup = () => {
  const sidebarLinks = [
    { title: 'Overview', url: '/documentation/getting-started', },
    { title: 'Quick Start Guide', url: '/documentation/getting-started/quick-start' },
    { title: 'Platform Overview', url: '/documentation/getting-started/platform-overview' },
    { title: 'Setting Up Your Account', url: '/documentation/getting-started/account-setup', active: true },
    { title: 'Creating Your First Automation', url: '/documentation/getting-started/first-automation' },
  ];

  return (
    <DocLayout
      title="Setting Up Your Account"
      description="Configure your GenerativSchool account for optimal use and security"
      sidebarLinks={sidebarLinks}
      breadcrumbs={[
        { title: 'Getting Started', url: '/documentation/getting-started' },
        { title: 'Setting Up Your Account', url: '/documentation/getting-started/account-setup' }
      ]}
      previousLink={{ title: 'Platform Overview', url: '/documentation/getting-started/platform-overview' }}
      nextLink={{ title: 'Creating Your First Automation', url: '/documentation/getting-started/first-automation' }}
    >
      <section className="mb-12">
        <p className="text-lg mb-6">
          Properly setting up your GenerativSchool account is essential for getting the most out of our platform. 
          This guide will walk you through configuring your profile, security settings, notification preferences, 
          and team access to ensure a smooth and secure experience.
        </p>

        <div className="space-y-8">
          <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-6">
            <h3 className="flex items-center gap-2 text-xl font-semibold mb-4">
              <User className="h-6 w-6 text-indigo-600" />
              Complete Your Profile
            </h3>
            <p className="mb-4">
              A complete profile helps your team identify you and ensures you receive relevant updates and resources.
            </p>
            <ol className="list-decimal pl-6 space-y-2">
              <li>Navigate to <strong>Settings &gt; Profile</strong> in the top-right menu</li>
              <li>Upload a profile picture</li>
              <li>Add your job title and department</li>
              <li>Set your timezone for accurate scheduling</li>
              <li>Include your contact information</li>
            </ol>
          </div>

          <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-6">
            <h3 className="flex items-center gap-2 text-xl font-semibold mb-4">
              <Lock className="h-6 w-6 text-indigo-600" />
              Security Settings
            </h3>
            <p className="mb-4">
              Secure your account to protect your automations and sensitive data.
            </p>
            <ol className="list-decimal pl-6 space-y-2">
              <li>Enable two-factor authentication (2FA)</li>
              <li>Set a strong, unique password</li>
              <li>Configure trusted devices</li>
              <li>Review and manage connected applications</li>
              <li>Set up recovery methods</li>
            </ol>
          </div>

          <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-6">
            <h3 className="flex items-center gap-2 text-xl font-semibold mb-4">
              <Bell className="h-6 w-6 text-indigo-600" />
              Notification Preferences
            </h3>
            <p className="mb-4">
              Configure how and when you receive notifications from GenerativSchool.
            </p>
            <ol className="list-decimal pl-6 space-y-2">
              <li>Navigate to <strong>Settings &gt; Notifications</strong></li>
              <li>Choose your preferred notification channels (email, in-app, mobile)</li>
              <li>Set notification priorities for different event types</li>
              <li>Configure quiet hours</li>
              <li>Create custom notification rules for critical automations</li>
            </ol>
          </div>

          <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-6">
            <h3 className="flex items-center gap-2 text-xl font-semibold mb-4">
              <Key className="h-6 w-6 text-indigo-600" />
              API Keys
            </h3>
            <p className="mb-4">
              Generate and manage API keys to integrate with external systems.
            </p>
            <ol className="list-decimal pl-6 space-y-2">
              <li>Go to <strong>Settings &gt; API Keys</strong></li>
              <li>Click "Create New API Key"</li>
              <li>Provide a descriptive name for the key</li>
              <li>Select appropriate scopes and permissions</li>
              <li>Set expiration dates for enhanced security</li>
              <li>Store the key securely - it will only be shown once</li>
            </ol>
          </div>

          <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-6">
            <h3 className="flex items-center gap-2 text-xl font-semibold mb-4">
              <Shield className="h-6 w-6 text-indigo-600" />
              Team Access Management
            </h3>
            <p className="mb-4">
              If you're a team admin, configure access for your team members.
            </p>
            <ol className="list-decimal pl-6 space-y-2">
              <li>Navigate to <strong>Settings &gt; Team Members</strong></li>
              <li>Invite new team members via email</li>
              <li>Assign appropriate roles and permissions</li>
              <li>Create custom roles if needed</li>
              <li>Set up access groups for different departments</li>
              <li>Configure resource sharing permissions</li>
            </ol>
          </div>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4">Workspace Configuration</h2>
        
        <p className="mb-6">
          After setting up your personal account, configure your workspace to match your team's workflow and branding.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center gap-4">
              <Settings className="h-8 w-8 text-indigo-600" />
              <div>
                <CardTitle>Workspace Settings</CardTitle>
                <CardDescription>Configure your environment</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-indigo-600"></span>
                  Set workspace name and logo
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-indigo-600"></span>
                  Configure default language and region
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-indigo-600"></span>
                  Set billing information and plan
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-indigo-600"></span>
                  Configure data retention policies
                </li>
              </ul>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center gap-4">
              <Lock className="h-8 w-8 text-indigo-600" />
              <div>
                <CardTitle>Security Policies</CardTitle>
                <CardDescription>Manage organization security</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-indigo-600"></span>
                  Set password requirements
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-indigo-600"></span>
                  Enable SSO integration
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-indigo-600"></span>
                  Configure IP restrictions
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-indigo-600"></span>
                  Enable audit logging
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4">What's Next?</h2>
        
        <p className="mb-6">
          Now that your account is fully configured, you're ready to start creating your first automation.
        </p>
        
        <div className="bg-gradient-to-r from-indigo-100 to-purple-100 p-6 rounded-lg border border-indigo-200">
          <h3 className="text-xl font-semibold mb-3">Ready to build your first workflow?</h3>
          <p className="mb-4">
            Follow our step-by-step guide to create your first automation and see the power of GenerativSchool in action.
          </p>
          <Link 
            to="/documentation/getting-started/first-automation"
            className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
          >
            Create Your First Automation
          </Link>
        </div>
      </section>
    </DocLayout>
  );
};

export default AccountSetup;

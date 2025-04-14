
import React from 'react';
import DocLayout from '@/components/DocLayout';
import { Key, ShieldCheck, Lock, FileKey } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const Authentication = () => {
  const sidebarLinks = [
    { title: 'Overview', url: '/documentation/api' },
    { title: 'API Reference', url: '/documentation/api/reference' },
    { title: 'Authentication', url: '/documentation/api/authentication', active: true },
    { title: 'Rate Limits', url: '/documentation/api/rate-limits' },
    { title: 'Webhooks', url: '/documentation/api/webhooks' },
  ];

  return (
    <DocLayout
      title="API Authentication"
      description="Secure your API requests with proper authentication"
      sidebarLinks={sidebarLinks}
      breadcrumbs={[
        { title: 'API Documentation', url: '/documentation/api' },
        { title: 'Authentication', url: '/documentation/api/authentication' }
      ]}
      previousLink={{ title: 'API Reference', url: '/documentation/api/reference' }}
      nextLink={{ title: 'Rate Limits', url: '/documentation/api/rate-limits' }}
    >
      <section className="mb-12">
        <p className="text-lg mb-6">
          All requests to the GenerativSchool API must be authenticated using API keys.
          This guide explains how to create, manage, and use API keys securely in your applications.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          <Card>
            <CardHeader className="flex flex-row items-center gap-4">
              <Key className="h-6 w-6 text-indigo-600" />
              <div>
                <CardTitle>API Keys</CardTitle>
                <CardDescription>Authenticate your API requests</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <p>
                API keys are long, unique strings that identify your application when making API requests.
                Each API key is associated with your account and has specific permissions.
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center gap-4">
              <ShieldCheck className="h-6 w-6 text-indigo-600" />
              <div>
                <CardTitle>Security Best Practices</CardTitle>
                <CardDescription>Keep your API keys safe</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <p>
                Treat your API keys like passwords. Never expose them in client-side code,
                public repositories, or share them with unauthorized users.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
      
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Creating API Keys</h2>
        
        <p className="mb-6">
          You can create API keys from your GenerativSchool dashboard. Each key can have different
          scopes to limit what actions it can perform.
        </p>
        
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-6">
          <h3 className="text-lg font-semibold mb-3">Steps to create an API key</h3>
          <ol className="list-decimal pl-6 space-y-3">
            <li>Log in to your GenerativSchool account</li>
            <li>Navigate to <strong>Settings → API Keys</strong></li>
            <li>Click <strong>Create New API Key</strong></li>
            <li>Give your key a descriptive name (e.g., "Production Server", "Testing Environment")</li>
            <li>Select the appropriate permissions for this key</li>
            <li>Click <strong>Create Key</strong></li>
          </ol>
          <div className="bg-amber-50 border border-amber-200 rounded p-3 mt-4">
            <div className="flex gap-2">
              <Lock className="h-5 w-5 text-amber-600 flex-shrink-0" />
              <p className="text-sm text-amber-800">
                Important: Your API key will only be shown once. Make sure to copy it and store it
                in a secure location. If you lose it, you'll need to create a new key.
              </p>
            </div>
          </div>
        </div>
        
        <h3 className="text-xl font-semibold mb-4">API Key Permissions</h3>
        
        <p className="mb-4">
          When creating an API key, you can assign specific permissions to limit what the key can do.
          This follows the principle of least privilege - only grant the permissions necessary for the
          intended use case.
        </p>
        
        <div className="overflow-x-auto mb-6">
          <table className="min-w-full border border-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Permission</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Recommended for</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              <tr>
                <td className="px-4 py-3 text-sm font-medium">Read-only</td>
                <td className="px-4 py-3 text-sm">Can only retrieve data, cannot make changes</td>
                <td className="px-4 py-3 text-sm">Dashboards, reporting tools</td>
              </tr>
              <tr>
                <td className="px-4 py-3 text-sm font-medium">Workflow Management</td>
                <td className="px-4 py-3 text-sm">Can create, update, and delete workflows</td>
                <td className="px-4 py-3 text-sm">Workflow builders, admin tools</td>
              </tr>
              <tr>
                <td className="px-4 py-3 text-sm font-medium">Execution</td>
                <td className="px-4 py-3 text-sm">Can execute workflows but not modify them</td>
                <td className="px-4 py-3 text-sm">Production systems triggering automations</td>
              </tr>
              <tr>
                <td className="px-4 py-3 text-sm font-medium">Full Access</td>
                <td className="px-4 py-3 text-sm">Can perform all API operations</td>
                <td className="px-4 py-3 text-sm">Internal admin systems (use with caution)</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
      
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Using API Keys in Requests</h2>
        
        <p className="mb-6">
          To authenticate your API requests, include your API key in the Authorization header
          using the Bearer authentication scheme.
        </p>
        
        <div className="bg-gray-900 text-white p-4 rounded-lg font-mono text-sm mb-6 overflow-x-auto">
{`curl -X GET "https://api.generativschool.com/v1/workflows" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json"`}
        </div>
        
        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-semibold mb-3">Client Libraries</h3>
            <p className="mb-4">
              Our official client libraries handle authentication automatically once configured with your API key.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <h4 className="font-semibold mb-2">JavaScript / TypeScript</h4>
                <pre className="bg-gray-900 text-white p-3 rounded text-sm mb-2 overflow-x-auto">
{`import { GenerativClient } from '@generativschool/api-client';

const client = new GenerativClient({
  apiKey: 'YOUR_API_KEY'
});

// Now use the client
const workflows = await client.workflows.list();`}
                </pre>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <h4 className="font-semibold mb-2">Python</h4>
                <pre className="bg-gray-900 text-white p-3 rounded text-sm mb-2 overflow-x-auto">
{`from generativschool import Client

client = Client(api_key='YOUR_API_KEY')

# Now use the client
workflows = client.workflows.list()`}
                </pre>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <section>
        <h2 className="text-2xl font-bold mb-6">API Key Security</h2>
        
        <div className="space-y-6">
          <div className="flex gap-4">
            <div className="flex-shrink-0">
              <FileKey className="h-6 w-6 text-indigo-600" />
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">Never expose API keys in client-side code</h3>
              <p>
                API keys should never be included in frontend code, mobile apps, or any other client-side 
                code that can be accessed by users. Instead, make API calls from your backend servers.
              </p>
            </div>
          </div>
          
          <div className="flex gap-4">
            <div className="flex-shrink-0">
              <Lock className="h-6 w-6 text-indigo-600" />
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">Store API keys securely</h3>
              <p>
                Store your API keys in environment variables or a secure key management system,
                not in your application code or version control systems.
              </p>
            </div>
          </div>
          
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mt-4">
            <h3 className="text-lg font-semibold mb-4">API Key Rotation</h3>
            <p className="mb-4">
              Regularly rotating your API keys is a security best practice. It minimizes the impact
              of a potential key exposure and ensures that old or unused keys are not active indefinitely.
            </p>
            <ol className="list-decimal pl-6 space-y-2">
              <li>Create a new API key with the same permissions as the one you want to rotate</li>
              <li>Update your applications to use the new key</li>
              <li>Verify that everything works with the new key</li>
              <li>Delete the old API key</li>
            </ol>
          </div>
        </div>
      </section>
    </DocLayout>
  );
};

export default Authentication;


import React from 'react';
import DocLayout from '@/components/DocLayout';
import { Link } from 'react-router-dom';
import { Code, Key, Activity, Webhook } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const ApiDocumentation = () => {
  const sidebarLinks = [
    { title: 'Overview', url: '/documentation/api', active: true },
    { title: 'API Reference', url: '/documentation/api/reference' },
    { title: 'Authentication', url: '/documentation/api/authentication' },
    { title: 'Rate Limits', url: '/documentation/api/rate-limits' },
    { title: 'Webhooks', url: '/documentation/api/webhooks' },
  ];

  return (
    <DocLayout
      title="API Documentation"
      description="Integrate with our API to extend and automate your GenerativSchool experience"
      sidebarLinks={sidebarLinks}
      breadcrumbs={[{ title: 'API Documentation', url: '/documentation/api' }]}
      nextLink={{ title: 'API Reference', url: '/documentation/api/reference' }}
    >
      <section className="mb-12">
        <p className="text-lg mb-6">
          GenerativSchool provides a powerful API that allows you to integrate our automation platform into your existing systems.
          With our API, you can programmatically create and manage workflows, trigger automations, access data, and more.
        </p>
        
        <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 mb-8">
          <h3 className="text-lg font-semibold mb-3">API Base URL</h3>
          <div className="bg-gray-900 text-white p-3 rounded font-mono text-sm mb-3">
            https://api.generativschool.com/v1
          </div>
          <p className="text-sm text-gray-600">
            All API requests should be made to this base URL, followed by the specific endpoint path.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          <Card>
            <CardHeader className="flex flex-row items-center gap-4">
              <Code className="h-8 w-8 text-indigo-600" />
              <div>
                <CardTitle>API Reference</CardTitle>
                <CardDescription>Complete endpoints documentation</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <p className="mb-4">Browse our comprehensive API reference documentation for all available endpoints.</p>
              <Link 
                to="/documentation/api/reference"
                className="text-indigo-600 hover:text-indigo-800 font-medium"
              >
                View API Reference →
              </Link>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center gap-4">
              <Key className="h-8 w-8 text-indigo-600" />
              <div>
                <CardTitle>Authentication</CardTitle>
                <CardDescription>Secure your API requests</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <p className="mb-4">Learn how to authenticate your API requests and manage API keys securely.</p>
              <Link 
                to="/documentation/api/authentication"
                className="text-indigo-600 hover:text-indigo-800 font-medium"
              >
                Learn about authentication →
              </Link>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center gap-4">
              <Activity className="h-8 w-8 text-indigo-600" />
              <div>
                <CardTitle>Rate Limits</CardTitle>
                <CardDescription>Understanding API constraints</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <p className="mb-4">Understand the rate limits for our API and best practices for efficient usage.</p>
              <Link 
                to="/documentation/api/rate-limits"
                className="text-indigo-600 hover:text-indigo-800 font-medium"
              >
                View rate limits →
              </Link>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center gap-4">
              <Webhook className="h-8 w-8 text-indigo-600" />
              <div>
                <CardTitle>Webhooks</CardTitle>
                <CardDescription>Receive event notifications</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <p className="mb-4">Set up webhooks to receive real-time notifications about events in your account.</p>
              <Link 
                to="/documentation/api/webhooks"
                className="text-indigo-600 hover:text-indigo-800 font-medium"
              >
                Configure webhooks →
              </Link>
            </CardContent>
          </Card>
        </div>
      </section>
      
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4">Getting Started with the API</h2>
        
        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-semibold mb-3">1. Generate API Keys</h3>
            <p className="mb-3">
              Before making API requests, you'll need to generate API keys in your GenerativSchool dashboard:
            </p>
            <ol className="list-decimal pl-6 space-y-2">
              <li>Log in to your GenerativSchool account</li>
              <li>Navigate to Settings &gt; API Keys</li>
              <li>Click "Create New API Key"</li>
              <li>Name your key and select the appropriate permissions</li>
              <li>Store your API key securely - it won't be shown again</li>
            </ol>
          </div>
          
          <div>
            <h3 className="text-xl font-semibold mb-3">2. Make Your First API Call</h3>
            <p className="mb-3">
              Let's make a simple API call to get a list of your workflows:
            </p>
            <div className="bg-gray-900 text-white p-4 rounded font-mono text-sm mb-3 overflow-x-auto">
              <pre>curl -X GET "https://api.generativschool.com/v1/workflows" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json"</pre>
            </div>
            <p className="text-sm text-gray-600">
              Replace YOUR_API_KEY with the actual API key you generated in step 1.
            </p>
          </div>
          
          <div>
            <h3 className="text-xl font-semibold mb-3">3. Explore the API</h3>
            <p className="mb-3">
              With your API key in hand, you can now explore the full capabilities of our API:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Create and manage workflows programmatically</li>
              <li>Trigger workflow executions from your applications</li>
              <li>Retrieve execution results and logs</li>
              <li>Manage integrations and connections</li>
              <li>Access and manipulate data stored in GenerativSchool</li>
            </ul>
          </div>
        </div>
      </section>
      
      <section>
        <h2 className="text-2xl font-bold mb-4">API Client Libraries</h2>
        
        <p className="mb-6">
          We provide official client libraries in several programming languages to make it easier to integrate with our API:
        </p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          <div className="border border-gray-200 rounded p-4">
            <h3 className="font-semibold mb-2">JavaScript / TypeScript</h3>
            <div className="bg-gray-50 p-2 rounded font-mono text-sm mb-3">
              npm install @generativschool/api-client
            </div>
            <a href="#" className="text-indigo-600 hover:text-indigo-800 text-sm">View on GitHub</a>
          </div>
          
          <div className="border border-gray-200 rounded p-4">
            <h3 className="font-semibold mb-2">Python</h3>
            <div className="bg-gray-50 p-2 rounded font-mono text-sm mb-3">
              pip install generativschool-api
            </div>
            <a href="#" className="text-indigo-600 hover:text-indigo-800 text-sm">View on GitHub</a>
          </div>
          
          <div className="border border-gray-200 rounded p-4">
            <h3 className="font-semibold mb-2">Java</h3>
            <div className="bg-gray-50 p-2 rounded font-mono text-sm mb-3">
              &lt;dependency&gt;
  &lt;groupId&gt;com.generativschool&lt;/groupId&gt;
  &lt;artifactId&gt;api-client&lt;/artifactId&gt;
  &lt;version&gt;1.0.0&lt;/version&gt;
&lt;/dependency&gt;
            </div>
            <a href="#" className="text-indigo-600 hover:text-indigo-800 text-sm">View on GitHub</a>
          </div>
          
          <div className="border border-gray-200 rounded p-4">
            <h3 className="font-semibold mb-2">Ruby</h3>
            <div className="bg-gray-50 p-2 rounded font-mono text-sm mb-3">
              gem install generativschool-api
            </div>
            <a href="#" className="text-indigo-600 hover:text-indigo-800 text-sm">View on GitHub</a>
          </div>
        </div>
        
        <div className="bg-yellow-50 p-4 rounded-md border border-yellow-200">
          <h3 className="font-semibold text-yellow-800 mb-2">Don't see your language?</h3>
          <p className="text-yellow-800 text-sm">
            Our API uses standard REST conventions and JSON, so you can use any HTTP client in your language of choice.
            Check out our <a href="#" className="underline">API examples</a> for code samples in various languages.
          </p>
        </div>
      </section>
    </DocLayout>
  );
};

export default ApiDocumentation;

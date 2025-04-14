
import React from 'react';
import DocLayout from '@/components/DocLayout';
import { Code, Database, Users, Calendar, File, MessageSquare } from 'lucide-react';

const ApiReference = () => {
  const sidebarLinks = [
    { title: 'Overview', url: '/documentation/api' },
    { title: 'API Reference', url: '/documentation/api/reference', active: true },
    { title: 'Authentication', url: '/documentation/api/authentication' },
    { title: 'Rate Limits', url: '/documentation/api/rate-limits' },
    { title: 'Webhooks', url: '/documentation/api/webhooks' },
  ];

  return (
    <DocLayout
      title="API Reference"
      description="Complete documentation of all available API endpoints"
      sidebarLinks={sidebarLinks}
      breadcrumbs={[
        { title: 'API Documentation', url: '/documentation/api' },
        { title: 'API Reference', url: '/documentation/api/reference' }
      ]}
      previousLink={{ title: 'API Overview', url: '/documentation/api' }}
      nextLink={{ title: 'Authentication', url: '/documentation/api/authentication' }}
    >
      <section className="mb-12">
        <p className="text-lg mb-6">
          This reference documents all available endpoints in the GenerativSchool API. Each endpoint includes 
          information about parameters, request examples, and response formats.
        </p>

        <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 mb-8">
          <h3 className="text-lg font-semibold mb-3">API Version</h3>
          <p className="mb-2">
            Current API version: <code className="bg-gray-200 px-2 py-1 rounded text-indigo-700">v1</code>
          </p>
          <p className="text-sm text-gray-700">
            All API requests must include the version in the URL: <code className="bg-gray-200 px-2 py-1 rounded">https://api.generativschool.com/v1/...</code>
          </p>
        </div>
        
        <h2 className="text-2xl font-bold mb-6 mt-12">Available Endpoints</h2>
        
        <div className="space-y-12">
          {/* Workflows Section */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-indigo-100 p-2 rounded-md">
                <Code className="h-6 w-6 text-indigo-700" />
              </div>
              <h3 className="text-xl font-bold">Workflows</h3>
            </div>
            
            <div className="space-y-6">
              <div className="border border-gray-200 rounded-md overflow-hidden">
                <div className="bg-indigo-50 px-4 py-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="bg-green-500 text-white text-xs font-bold px-2 py-1 rounded">GET</span>
                    <code className="font-mono text-sm">/workflows</code>
                  </div>
                  <span className="text-sm text-gray-600">List all workflows</span>
                </div>
                <div className="p-4">
                  <p className="mb-4">Returns a paginated list of all workflows in your account.</p>
                  
                  <div className="mb-4">
                    <h4 className="font-semibold mb-2">Query Parameters</h4>
                    <table className="min-w-full border border-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Parameter</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Required</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200 bg-white">
                        <tr>
                          <td className="px-4 py-2 text-sm font-mono">page</td>
                          <td className="px-4 py-2 text-sm">Integer</td>
                          <td className="px-4 py-2 text-sm">No</td>
                          <td className="px-4 py-2 text-sm">Page number (default: 1)</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-2 text-sm font-mono">limit</td>
                          <td className="px-4 py-2 text-sm">Integer</td>
                          <td className="px-4 py-2 text-sm">No</td>
                          <td className="px-4 py-2 text-sm">Items per page (default: 20, max: 100)</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-2 text-sm font-mono">status</td>
                          <td className="px-4 py-2 text-sm">String</td>
                          <td className="px-4 py-2 text-sm">No</td>
                          <td className="px-4 py-2 text-sm">Filter by status (active, inactive, draft)</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  
                  <div className="mb-4">
                    <h4 className="font-semibold mb-2">Response</h4>
                    <pre className="bg-gray-900 text-gray-100 p-4 rounded overflow-x-auto text-sm">
{`{
  "data": [
    {
      "id": "wf_123456789",
      "name": "New Lead Notification",
      "description": "Sends email when new lead is created",
      "status": "active",
      "created_at": "2024-01-15T14:30:45Z",
      "updated_at": "2024-02-01T09:12:30Z"
    },
    // ... more workflows
  ],
  "pagination": {
    "total": 42,
    "page": 1,
    "limit": 20,
    "pages": 3
  }
}`}
                    </pre>
                  </div>
                </div>
              </div>
              
              <div className="border border-gray-200 rounded-md overflow-hidden">
                <div className="bg-indigo-50 px-4 py-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="bg-green-500 text-white text-xs font-bold px-2 py-1 rounded">GET</span>
                    <code className="font-mono text-sm">/workflows/:id</code>
                  </div>
                  <span className="text-sm text-gray-600">Get workflow details</span>
                </div>
                <div className="p-4">
                  <p className="mb-4">Returns detailed information about a specific workflow.</p>
                  
                  <div className="mb-4">
                    <h4 className="font-semibold mb-2">Path Parameters</h4>
                    <table className="min-w-full border border-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Parameter</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Required</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200 bg-white">
                        <tr>
                          <td className="px-4 py-2 text-sm font-mono">id</td>
                          <td className="px-4 py-2 text-sm">String</td>
                          <td className="px-4 py-2 text-sm">Yes</td>
                          <td className="px-4 py-2 text-sm">Workflow ID</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Automations Section */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-indigo-100 p-2 rounded-md">
                <Database className="h-6 w-6 text-indigo-700" />
              </div>
              <h3 className="text-xl font-bold">Automations</h3>
            </div>
            
            <div className="space-y-6">
              <div className="border border-gray-200 rounded-md overflow-hidden">
                <div className="bg-indigo-50 px-4 py-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded">POST</span>
                    <code className="font-mono text-sm">/automations/execute/:id</code>
                  </div>
                  <span className="text-sm text-gray-600">Trigger automation execution</span>
                </div>
                <div className="p-4">
                  <p className="mb-4">Triggers a manual execution of an automation workflow with optional payload data.</p>
                  
                  <div className="mb-4">
                    <h4 className="font-semibold mb-2">Path Parameters</h4>
                    <table className="min-w-full border border-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Parameter</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Required</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200 bg-white">
                        <tr>
                          <td className="px-4 py-2 text-sm font-mono">id</td>
                          <td className="px-4 py-2 text-sm">String</td>
                          <td className="px-4 py-2 text-sm">Yes</td>
                          <td className="px-4 py-2 text-sm">Automation workflow ID</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  
                  <div className="mb-4">
                    <h4 className="font-semibold mb-2">Request Body</h4>
                    <pre className="bg-gray-900 text-gray-100 p-4 rounded overflow-x-auto text-sm">
{`{
  "data": {
    // Optional payload to pass to the automation
    "customer_id": "cus_12345",
    "action": "renewal",
    "custom_fields": {
      "priority": "high"
    }
  }
}`}
                    </pre>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* More endpoint categories would go here */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-indigo-100 p-2 rounded-md">
                <Users className="h-6 w-6 text-indigo-700" />
              </div>
              <h3 className="text-xl font-bold">Users & Teams</h3>
            </div>
            <p className="text-gray-600 italic">Endpoints related to user management and team collaboration</p>
          </div>
          
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-indigo-100 p-2 rounded-md">
                <Calendar className="h-6 w-6 text-indigo-700" />
              </div>
              <h3 className="text-xl font-bold">Schedules</h3>
            </div>
            <p className="text-gray-600 italic">Endpoints for managing scheduled tasks and recurring automations</p>
          </div>
          
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-indigo-100 p-2 rounded-md">
                <File className="h-6 w-6 text-indigo-700" />
              </div>
              <h3 className="text-xl font-bold">Templates</h3>
            </div>
            <p className="text-gray-600 italic">Endpoints for managing workflow and document templates</p>
          </div>
          
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-indigo-100 p-2 rounded-md">
                <MessageSquare className="h-6 w-6 text-indigo-700" />
              </div>
              <h3 className="text-xl font-bold">Notifications</h3>
            </div>
            <p className="text-gray-600 italic">Endpoints for managing system and user notifications</p>
          </div>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4">Response Formats</h2>
        
        <p className="mb-6">
          All API responses follow a consistent format to make integration easier.
        </p>

        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-3">Successful Responses</h3>
            <p className="mb-3">Successful API calls return a 2xx status code with a JSON response body.</p>
            <pre className="bg-gray-900 text-gray-100 p-4 rounded overflow-x-auto text-sm">
{`{
  "data": {
    // The response data, structure varies by endpoint
  },
  "meta": {
    // Optional metadata about the response
    "processing_time": "0.236s"
  }
}`}
            </pre>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-3">Error Responses</h3>
            <p className="mb-3">Error responses use appropriate HTTP status codes (4xx or 5xx) with a consistent error format.</p>
            <pre className="bg-gray-900 text-gray-100 p-4 rounded overflow-x-auto text-sm">
{`{
  "error": {
    "code": "invalid_parameter",
    "message": "The provided workflow ID is invalid",
    "details": {
      "parameter": "id",
      "reason": "Format must be wf_followed by alphanumeric characters"
    }
  }
}`}
            </pre>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-3">Pagination</h3>
            <p className="mb-3">Endpoints that return collections support pagination through standardized parameters and response format.</p>
            <pre className="bg-gray-900 text-gray-100 p-4 rounded overflow-x-auto text-sm">
{`{
  "data": [
    // Array of items
  ],
  "pagination": {
    "total": 42,    // Total number of items
    "page": 2,      // Current page
    "limit": 20,    // Items per page
    "pages": 3      // Total number of pages
  }
}`}
            </pre>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4">Next Steps</h2>
        
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-6 rounded-lg border border-indigo-100">
          <h3 className="text-xl font-semibold mb-3">Authentication</h3>
          <p className="mb-4">
            Now that you understand the available endpoints, learn how to authenticate your API requests.
          </p>
          <a 
            href="/documentation/api/authentication"
            className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
          >
            Learn About Authentication
          </a>
        </div>
      </section>
    </DocLayout>
  );
};

export default ApiReference;

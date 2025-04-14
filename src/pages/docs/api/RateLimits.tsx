
import React from 'react';
import DocLayout from '@/components/DocLayout';
import { Clock, Activity, AlertTriangle, BarChart4 } from 'lucide-react';

const RateLimits = () => {
  const sidebarLinks = [
    { title: 'Overview', url: '/documentation/api' },
    { title: 'API Reference', url: '/documentation/api/reference' },
    { title: 'Authentication', url: '/documentation/api/authentication' },
    { title: 'Rate Limits', url: '/documentation/api/rate-limits', active: true },
    { title: 'Webhooks', url: '/documentation/api/webhooks' },
  ];

  return (
    <DocLayout
      title="API Rate Limits"
      description="Understanding and working with GenerativSchool API rate limits"
      sidebarLinks={sidebarLinks}
      breadcrumbs={[
        { title: 'API Documentation', url: '/documentation/api' },
        { title: 'Rate Limits', url: '/documentation/api/rate-limits' }
      ]}
      previousLink={{ title: 'Authentication', url: '/documentation/api/authentication' }}
      nextLink={{ title: 'Webhooks', url: '/documentation/api/webhooks' }}
    >
      <section className="mb-12">
        <p className="text-lg mb-6">
          To ensure service stability and fair usage for all users, the GenerativSchool API implements rate limiting.
          This page explains our rate limits and how to work within them effectively.
        </p>
        
        <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-6 mb-8">
          <div className="flex items-start gap-4">
            <Clock className="h-6 w-6 text-indigo-600 mt-1 flex-shrink-0" />
            <div>
              <h3 className="text-lg font-semibold mb-2">Why do we have rate limits?</h3>
              <p>
                Rate limits help us maintain the reliability and availability of our API for all users.
                They protect our systems from excessive traffic that could degrade performance for everyone,
                whether caused accidentally or intentionally.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Rate Limit Structure</h2>
        
        <p className="mb-6">
          Our rate limits are based on the number of requests made within specific time windows.
          These limits vary based on your subscription plan and the specific API endpoints you're accessing.
        </p>
        
        <div className="overflow-x-auto mb-8">
          <table className="min-w-full border border-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Plan</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Requests per minute</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Requests per hour</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Requests per day</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              <tr>
                <td className="px-4 py-3 text-sm font-medium">Free</td>
                <td className="px-4 py-3 text-sm">30</td>
                <td className="px-4 py-3 text-sm">600</td>
                <td className="px-4 py-3 text-sm">5,000</td>
              </tr>
              <tr>
                <td className="px-4 py-3 text-sm font-medium">Basic</td>
                <td className="px-4 py-3 text-sm">60</td>
                <td className="px-4 py-3 text-sm">1,800</td>
                <td className="px-4 py-3 text-sm">15,000</td>
              </tr>
              <tr>
                <td className="px-4 py-3 text-sm font-medium">Professional</td>
                <td className="px-4 py-3 text-sm">300</td>
                <td className="px-4 py-3 text-sm">9,000</td>
                <td className="px-4 py-3 text-sm">100,000</td>
              </tr>
              <tr>
                <td className="px-4 py-3 text-sm font-medium">Enterprise</td>
                <td className="px-4 py-3 text-sm">1,000+</td>
                <td className="px-4 py-3 text-sm">30,000+</td>
                <td className="px-4 py-3 text-sm">Custom</td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-8">
          <div className="flex items-start gap-4">
            <AlertTriangle className="h-6 w-6 text-yellow-600 mt-1 flex-shrink-0" />
            <div>
              <h3 className="text-lg font-semibold mb-2">Special Rate Limits</h3>
              <p className="mb-3">
                Some API endpoints have their own specific rate limits, regardless of your plan:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Workflow Execution</strong>: 10 concurrent executions per account</li>
                <li><strong>AI Operations</strong>: 5 requests per minute for free plans, higher for paid plans</li>
                <li><strong>Bulk Operations</strong>: 3 requests per hour for imports/exports</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
      
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Rate Limit Headers</h2>
        
        <p className="mb-6">
          To help you manage your API usage, we include rate limit information in the response headers
          for all API requests.
        </p>
        
        <div className="bg-gray-900 text-white p-4 rounded-lg font-mono text-sm mb-6 overflow-x-auto">
{`HTTP/1.1 200 OK
Content-Type: application/json
X-RateLimit-Limit: 60
X-RateLimit-Remaining: 56
X-RateLimit-Reset: 1680312600
...`}
        </div>
        
        <div className="space-y-4 mb-8">
          <div>
            <h3 className="text-lg font-semibold mb-2">Header Definitions</h3>
            <ul className="space-y-3">
              <li className="flex gap-2">
                <code className="bg-gray-100 px-2 py-1 rounded text-indigo-700 flex-shrink-0">X-RateLimit-Limit</code>
                <span>The maximum number of requests allowed in the current time window</span>
              </li>
              <li className="flex gap-2">
                <code className="bg-gray-100 px-2 py-1 rounded text-indigo-700 flex-shrink-0">X-RateLimit-Remaining</code>
                <span>The number of requests remaining in the current time window</span>
              </li>
              <li className="flex gap-2">
                <code className="bg-gray-100 px-2 py-1 rounded text-indigo-700 flex-shrink-0">X-RateLimit-Reset</code>
                <span>The time at which the rate limit window resets, in Unix time (seconds)</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div>
          <h3 className="text-xl font-semibold mb-4">Rate Limit Exceeded</h3>
          
          <p className="mb-4">
            If you exceed the rate limit, you'll receive a <code className="bg-gray-100 px-2 py-1 rounded text-indigo-700">429 Too Many Requests</code> response
            with information about when you can resume making requests.
          </p>
          
          <div className="bg-gray-900 text-white p-4 rounded-lg font-mono text-sm mb-6 overflow-x-auto">
{`HTTP/1.1 429 Too Many Requests
Content-Type: application/json
X-RateLimit-Limit: 60
X-RateLimit-Remaining: 0
X-RateLimit-Reset: 1680312600
Retry-After: 30

{
  "error": {
    "code": "rate_limit_exceeded",
    "message": "Rate limit exceeded. Please try again in 30 seconds.",
    "retry_after": 30
  }
}`}
          </div>
          
          <p>
            The <code className="bg-gray-100 px-2 py-1 rounded text-indigo-700">Retry-After</code> header tells you how many seconds to wait before making another request.
          </p>
        </div>
      </section>
      
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Best Practices for Managing Rate Limits</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-start gap-3 mb-4">
              <Activity className="h-6 w-6 text-indigo-600 mt-1" />
              <h3 className="text-xl font-semibold">Implement Retry Logic</h3>
            </div>
            <p>
              Design your application to handle 429 responses gracefully. Implement exponential backoff
              logic that respects the Retry-After header for automated retries.
            </p>
          </div>
          
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-start gap-3 mb-4">
              <BarChart4 className="h-6 w-6 text-indigo-600 mt-1" />
              <h3 className="text-xl font-semibold">Monitor Your Usage</h3>
            </div>
            <p>
              Keep track of your API usage and plan accordingly. Use the rate limit headers
              to adjust your request rate dynamically based on your remaining quota.
            </p>
          </div>
        </div>
        
        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-semibold mb-3">Code Example: Handling Rate Limits</h3>
            
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <h4 className="font-semibold mb-2">JavaScript / TypeScript</h4>
              <pre className="bg-gray-900 text-white p-3 rounded text-sm mb-2 overflow-x-auto">
{`async function makeApiRequestWithRetry(url, options, maxRetries = 3) {
  let retries = 0;
  
  while (retries < maxRetries) {
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          ...options.headers,
          'Authorization': 'Bearer YOUR_API_KEY'
        }
      });
      
      if (response.status === 429) {
        // Rate limit exceeded
        const retryAfter = response.headers.get('Retry-After') || 30;
        const waitTime = parseInt(retryAfter, 10) * 1000;
        
        console.log(\`Rate limit exceeded. Waiting \${retryAfter} seconds...\`);
        await new Promise(resolve => setTimeout(resolve, waitTime));
        retries++;
        continue;
      }
      
      return response;
    } catch (error) {
      console.error('API request failed:', error);
      retries++;
      
      if (retries >= maxRetries) {
        throw error;
      }
      
      // Exponential backoff
      await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, retries)));
    }
  }
}`}
              </pre>
            </div>
          </div>
          
          <div>
            <h3 className="text-xl font-semibold mb-3">Tips for Optimizing API Usage</h3>
            
            <ul className="space-y-4">
              <li className="flex gap-3">
                <div className="flex-shrink-0 h-6 w-6 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-semibold">1</div>
                <div>
                  <h4 className="font-semibold mb-1">Batch Operations</h4>
                  <p>
                    Whenever possible, use batch endpoints to perform multiple operations in a single
                    request instead of making many individual requests.
                  </p>
                </div>
              </li>
              
              <li className="flex gap-3">
                <div className="flex-shrink-0 h-6 w-6 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-semibold">2</div>
                <div>
                  <h4 className="font-semibold mb-1">Implement Caching</h4>
                  <p>
                    Cache API responses that don't change frequently to reduce the number of API calls.
                    Check response headers for caching directives.
                  </p>
                </div>
              </li>
              
              <li className="flex gap-3">
                <div className="flex-shrink-0 h-6 w-6 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-semibold">3</div>
                <div>
                  <h4 className="font-semibold mb-1">Use Webhooks</h4>
                  <p>
                    Instead of polling for updates, use webhooks to receive notifications when data changes,
                    significantly reducing the number of API calls needed.
                  </p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </section>
      
      <section>
        <h2 className="text-2xl font-bold mb-6">Rate Limit Increases</h2>
        
        <p className="mb-6">
          If you need higher rate limits than what your current plan allows, consider upgrading to a
          higher tier plan or contacting us for custom rate limit options.
        </p>
        
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-6 rounded-lg border border-indigo-100">
          <h3 className="text-xl font-semibold mb-3">Need Higher Limits?</h3>
          <p className="mb-4">
            Enterprise customers can request custom rate limits tailored to their specific needs.
            Contact our sales team to discuss your requirements.
          </p>
          <a 
            href="/contact"
            className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
          >
            Contact Sales
          </a>
        </div>
      </section>
    </DocLayout>
  );
};

export default RateLimits;


import React from 'react';
import DocLayout from '@/components/DocLayout';
import { Webhook, Bell, Shield, Code, CheckCircle2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const Webhooks = () => {
  const sidebarLinks = [
    { title: 'Overview', url: '/documentation/api' },
    { title: 'API Reference', url: '/documentation/api/reference' },
    { title: 'Authentication', url: '/documentation/api/authentication' },
    { title: 'Rate Limits', url: '/documentation/api/rate-limits' },
    { title: 'Webhooks', url: '/documentation/api/webhooks', active: true },
  ];

  return (
    <DocLayout
      title="Webhooks"
      description="Receive real-time notifications when events occur in your GenerativSchool account"
      sidebarLinks={sidebarLinks}
      breadcrumbs={[
        { title: 'API Documentation', url: '/documentation/api' },
        { title: 'Webhooks', url: '/documentation/api/webhooks' }
      ]}
      previousLink={{ title: 'Rate Limits', url: '/documentation/api/rate-limits' }}
    >
      <section className="mb-12">
        <p className="text-lg mb-6">
          Webhooks allow your application to receive real-time notifications when specific events occur in your
          GenerativSchool account. This guide explains how to configure, secure, and handle webhook notifications.
        </p>
        
        <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-6 mb-8">
          <div className="flex items-start gap-4">
            <Bell className="h-6 w-6 text-indigo-600 mt-1 flex-shrink-0" />
            <div>
              <h3 className="text-lg font-semibold mb-2">What are webhooks?</h3>
              <p>
                Webhooks are HTTP callbacks that are triggered by specific events in your GenerativSchool account.
                When an event occurs, we send an HTTP POST request to the URL you've configured, containing details
                about the event. This allows your systems to react immediately to changes without polling our API.
              </p>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-indigo-600" />
                <span>Event-Based</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm">
                Receive notifications only when specific events occur, such as workflow completions or data changes.
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-indigo-600" />
                <span>Secure</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm">
                All webhook payloads are signed, allowing you to verify they came from GenerativSchool.
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-indigo-600" />
                <span>Reliable</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm">
                Our system retries failed webhook deliveries to ensure you don't miss important events.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
      
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Available Webhook Events</h2>
        
        <p className="mb-6">
          You can subscribe to various event types when configuring your webhooks. Each event type corresponds
          to a specific action or change in your GenerativSchool account.
        </p>
        
        <div className="overflow-x-auto mb-8">
          <table className="min-w-full border border-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Event Type</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Example Use Case</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              <tr>
                <td className="px-4 py-3 text-sm font-mono font-medium">workflow.created</td>
                <td className="px-4 py-3 text-sm">Triggered when a new workflow is created</td>
                <td className="px-4 py-3 text-sm">Update internal systems with new workflow data</td>
              </tr>
              <tr>
                <td className="px-4 py-3 text-sm font-mono font-medium">workflow.updated</td>
                <td className="px-4 py-3 text-sm">Triggered when a workflow is modified</td>
                <td className="px-4 py-3 text-sm">Sync workflow changes to external systems</td>
              </tr>
              <tr>
                <td className="px-4 py-3 text-sm font-mono font-medium">workflow.deleted</td>
                <td className="px-4 py-3 text-sm">Triggered when a workflow is deleted</td>
                <td className="px-4 py-3 text-sm">Remove workflow from connected systems</td>
              </tr>
              <tr>
                <td className="px-4 py-3 text-sm font-mono font-medium">execution.started</td>
                <td className="px-4 py-3 text-sm">Triggered when a workflow execution begins</td>
                <td className="px-4 py-3 text-sm">Track execution start times for monitoring</td>
              </tr>
              <tr>
                <td className="px-4 py-3 text-sm font-mono font-medium">execution.completed</td>
                <td className="px-4 py-3 text-sm">Triggered when a workflow execution completes successfully</td>
                <td className="px-4 py-3 text-sm">Process workflow results in your systems</td>
              </tr>
              <tr>
                <td className="px-4 py-3 text-sm font-mono font-medium">execution.failed</td>
                <td className="px-4 py-3 text-sm">Triggered when a workflow execution fails</td>
                <td className="px-4 py-3 text-sm">Alert team members about failures</td>
              </tr>
              <tr>
                <td className="px-4 py-3 text-sm font-mono font-medium">user.created</td>
                <td className="px-4 py-3 text-sm">Triggered when a new user is added to your account</td>
                <td className="px-4 py-3 text-sm">Provision resources for new users</td>
              </tr>
              <tr>
                <td className="px-4 py-3 text-sm font-mono font-medium">data.updated</td>
                <td className="px-4 py-3 text-sm">Triggered when data in your account is modified</td>
                <td className="px-4 py-3 text-sm">Sync data changes to external systems</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
      
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Setting Up Webhooks</h2>
        
        <p className="mb-6">
          You can configure webhooks through the GenerativSchool dashboard or via the API. Each webhook requires a URL
          where notifications will be sent and the event types you want to subscribe to.
        </p>
        
        <div className="space-y-8">
          <div>
            <h3 className="text-xl font-semibold mb-3">Creating a Webhook via Dashboard</h3>
            
            <ol className="list-decimal pl-6 space-y-3">
              <li>Log in to your GenerativSchool account</li>
              <li>Navigate to <strong>Settings → Webhooks</strong></li>
              <li>Click <strong>Add Webhook</strong></li>
              <li>Enter your webhook URL (must be HTTPS)</li>
              <li>Select the events you want to subscribe to</li>
              <li>Optionally, add a description to identify the webhook's purpose</li>
              <li>Click <strong>Create Webhook</strong></li>
            </ol>
          </div>
          
          <div>
            <h3 className="text-xl font-semibold mb-3">Creating a Webhook via API</h3>
            
            <pre className="bg-gray-900 text-white p-4 rounded-lg font-mono text-sm mb-4 overflow-x-auto">
{`curl -X POST "https://api.generativschool.com/v1/webhooks" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "url": "https://your-server.com/webhooks/generativschool",
    "events": ["workflow.created", "execution.completed", "execution.failed"],
    "description": "Production workflow monitoring",
    "active": true
  }'`}
            </pre>
          </div>
        </div>
      </section>
      
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Webhook Payloads</h2>
        
        <p className="mb-6">
          When an event is triggered, we'll send an HTTP POST request to your webhook URL with a JSON payload
          containing details about the event.
        </p>
        
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-3">Example Payload</h3>
          
          <pre className="bg-gray-900 text-white p-4 rounded-lg font-mono text-sm mb-4 overflow-x-auto">
{`{
  "id": "evt_123456789",
  "type": "execution.completed",
  "created": "2024-04-15T18:30:45Z",
  "data": {
    "execution_id": "exec_987654321",
    "workflow_id": "wf_123456",
    "workflow_name": "Customer Onboarding",
    "status": "completed",
    "start_time": "2024-04-15T18:29:30Z",
    "end_time": "2024-04-15T18:30:45Z",
    "duration_seconds": 75,
    "result": {
      "success": true,
      "customer_id": "cus_12345",
      "actions_performed": ["email_sent", "account_provisioned", "welcome_call_scheduled"]
    }
  }
}`}
          </pre>
          
          <p className="text-sm text-gray-600 mb-4">
            All webhook payloads include a common structure:
          </p>
          
          <ul className="list-disc pl-6 space-y-2 text-sm">
            <li><strong>id</strong>: A unique identifier for the event</li>
            <li><strong>type</strong>: The type of event (e.g., execution.completed, workflow.created)</li>
            <li><strong>created</strong>: When the event occurred (ISO 8601 format)</li>
            <li><strong>data</strong>: Event-specific data with details relevant to the event type</li>
          </ul>
        </div>
      </section>
      
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Webhook Security</h2>
        
        <p className="mb-6">
          To ensure the webhooks you receive are genuinely from GenerativSchool and haven't been tampered with,
          we sign all webhook payloads.
        </p>
        
        <div className="space-y-8">
          <div>
            <h3 className="text-xl font-semibold mb-3">Verifying Webhook Signatures</h3>
            
            <p className="mb-4">
              Each webhook request includes a <code className="bg-gray-100 px-2 py-1 rounded text-indigo-700">Generativ-Signature</code> header.
              This header contains a timestamp and a signature that you can use to verify the webhook's authenticity.
            </p>
            
            <pre className="bg-gray-100 p-3 rounded font-mono text-sm mb-4">
              Generativ-Signature: t=1683561789,v1=5257a869e7ecebeda32affa62cdca3fa51cad7e77a0e56ff536d0ce8e108d8bd
            </pre>
            
            <p className="mb-4">
              To verify the signature:
            </p>
            
            <ol className="list-decimal pl-6 space-y-2">
              <li>Extract the timestamp (t) and signature (v1) from the header</li>
              <li>Verify that the timestamp is not too old (to prevent replay attacks)</li>
              <li>Compute an HMAC with SHA-256 using your webhook secret and the raw request payload</li>
              <li>Compare your computed signature with the one in the header</li>
            </ol>
          </div>
          
          <div>
            <h3 className="text-xl font-semibold mb-3">Code Example: Verifying Webhook Signatures</h3>
            
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <h4 className="font-semibold mb-2">Node.js</h4>
              <pre className="bg-gray-900 text-white p-3 rounded text-sm mb-2 overflow-x-auto">
{`const crypto = require('crypto');
const express = require('express');
const app = express();

// Parse raw body for signature verification
app.use('/webhooks/generativschool', 
  express.raw({ type: 'application/json' }),
  (req, res, next) => {
    const signature = req.headers['generativ-signature'];
    const webhookSecret = process.env.GENERATIV_WEBHOOK_SECRET;
    
    if (!signature) {
      return res.status(400).send('Missing signature header');
    }
    
    // Parse signature header
    const [timestamp, signatureHash] = signature.split(',')
      .reduce((acc, item) => {
        const [key, value] = item.split('=');
        acc[key] = value;
        return acc;
      }, {});
    
    // Verify timestamp is not too old (5 minute tolerance)
    const timestampNum = parseInt(timestamp.replace('t=', ''), 10);
    const currentTimestamp = Math.floor(Date.now() / 1000);
    if (currentTimestamp - timestampNum > 300) {
      return res.status(400).send('Webhook timestamp is too old');
    }
    
    // Verify signature
    const hmac = crypto.createHmac('sha256', webhookSecret);
    const calculatedSignature = hmac.update(req.body).digest('hex');
    const providedSignature = signatureHash.replace('v1=', '');
    
    if (calculatedSignature !== providedSignature) {
      return res.status(403).send('Invalid signature');
    }
    
    // Signature is valid, parse the JSON body and proceed
    req.body = JSON.parse(req.body);
    next();
  }
);

app.post('/webhooks/generativschool', (req, res) => {
  const event = req.body;
  
  // Handle the webhook event
  switch (event.type) {
    case 'execution.completed':
      handleExecutionCompleted(event.data);
      break;
    case 'workflow.created':
      handleWorkflowCreated(event.data);
      break;
    // Handle other event types
    default:
      console.log(\`Unhandled event type: \${event.type}\`);
  }
  
  // Respond with 200 to acknowledge receipt
  res.status(200).send('Webhook received');
});

function handleExecutionCompleted(data) {
  console.log(\`Workflow execution completed: \${data.workflow_name}\`);
  // Process the completed execution
}

function handleWorkflowCreated(data) {
  console.log(\`New workflow created: \${data.workflow_name}\`);
  // Process the new workflow
}

app.listen(3000, () => {
  console.log('Webhook server running on port 3000');
});`}
              </pre>
            </div>
          </div>
        </div>
      </section>
      
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Best Practices for Handling Webhooks</h2>
        
        <div className="space-y-6">
          <div className="flex gap-4">
            <div className="flex-shrink-0">
              <CheckCircle2 className="h-6 w-6 text-indigo-600" />
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">Respond Quickly</h3>
              <p>
                Your webhook endpoint should acknowledge receipt of the webhook by returning a 2xx status code as quickly as possible.
                Process the webhook asynchronously to avoid timeouts.
              </p>
            </div>
          </div>
          
          <div className="flex gap-4">
            <div className="flex-shrink-0">
              <CheckCircle2 className="h-6 w-6 text-indigo-600" />
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">Implement Idempotency</h3>
              <p>
                Design your webhook handler to be idempotent, as the same webhook might be delivered multiple times
                in rare cases (e.g., during retries). Use the event ID to deduplicate events.
              </p>
            </div>
          </div>
          
          <div className="flex gap-4">
            <div className="flex-shrink-0">
              <CheckCircle2 className="h-6 w-6 text-indigo-600" />
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">Verify Signatures</h3>
              <p>
                Always verify webhook signatures to ensure the requests are coming from GenerativSchool and
                haven't been tampered with.
              </p>
            </div>
          </div>
          
          <div className="flex gap-4">
            <div className="flex-shrink-0">
              <CheckCircle2 className="h-6 w-6 text-indigo-600" />
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">Monitor Webhook Health</h3>
              <p>
                Set up monitoring for your webhook endpoints to detect failures. You can view webhook delivery
                history in the GenerativSchool dashboard.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      <section>
        <h2 className="text-2xl font-bold mb-6">Testing Webhooks</h2>
        
        <p className="mb-6">
          You can test your webhook implementation using our test events feature in the dashboard or by using
          webhook testing tools.
        </p>
        
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-4">Testing Methods</h3>
          
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">1. Dashboard Test Events</h4>
              <p className="mb-2">
                In the webhook settings page, you can send test events to your webhook URL to verify your implementation.
              </p>
              <ol className="list-decimal pl-6 space-y-1">
                <li>Go to Settings → Webhooks</li>
                <li>Select an existing webhook</li>
                <li>Click "Send Test Event"</li>
                <li>Choose an event type and click "Send"</li>
              </ol>
            </div>
            
            <div>
              <h4 className="font-semibold mb-2">2. Local Development</h4>
              <p className="mb-2">
                For local development, you can use tools like <a href="https://ngrok.com" className="text-indigo-600 hover:text-indigo-800">ngrok</a> or
                <a href="https://github.com/stripe/stripe-cli" className="text-indigo-600 hover:text-indigo-800"> Stripe CLI</a> (which works with any webhook, not just Stripe) to expose your local server to the internet.
              </p>
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-indigo-50 rounded-md">
            <div className="flex items-start gap-3">
              <Code className="h-5 w-5 text-indigo-600 mt-1" />
              <div>
                <h4 className="font-semibold mb-1">Developer Tip</h4>
                <p className="text-sm">
                  When testing webhooks, check the webhook logs in the GenerativSchool dashboard to see delivery status,
                  response codes, and retry information. This can help diagnose issues with your webhook implementation.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </DocLayout>
  );
};

export default Webhooks;

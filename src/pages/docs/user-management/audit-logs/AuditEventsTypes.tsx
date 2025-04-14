
import React from 'react';

const AuditEventsTypes = () => {
  return (
    <section className="mb-12">
      <h2 className="text-2xl font-bold mb-6">Types of Audit Events</h2>
      
      <p className="mb-4">
        GenerativSchool captures a wide range of events across different categories:
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-4">Authentication Events</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li>Login attempts (successful and failed)</li>
            <li>Password changes</li>
            <li>Multi-factor authentication events</li>
            <li>Session timeouts</li>
            <li>API token usage</li>
            <li>SSO authentications</li>
          </ul>
        </div>
        
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-4">User Management Events</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li>User creation and deletion</li>
            <li>Role assignments and changes</li>
            <li>Permission modifications</li>
            <li>Group membership changes</li>
            <li>User profile updates</li>
            <li>Password resets</li>
          </ul>
        </div>
        
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-4">Resource Events</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li>Workflow creation and modification</li>
            <li>Workflow execution</li>
            <li>Data access and modification</li>
            <li>File uploads and downloads</li>
            <li>Resource sharing changes</li>
            <li>Template usage</li>
          </ul>
        </div>
        
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-4">System Events</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li>Configuration changes</li>
            <li>Integrations setup and modification</li>
            <li>API key creation and revocation</li>
            <li>Scheduled tasks execution</li>
            <li>Billing and subscription changes</li>
            <li>System errors and warnings</li>
          </ul>
        </div>
      </div>
      
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
        <h3 className="text-xl font-semibold mb-4">Event Data Structure</h3>
        <p className="mb-4">
          Each audit log entry contains detailed information about the event:
        </p>
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Field</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Description</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Example</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              <tr>
                <td className="px-4 py-3 text-sm font-medium">Event ID</td>
                <td className="px-4 py-3 text-sm">Unique identifier for the event</td>
                <td className="px-4 py-3 text-sm">evt_12345abcde</td>
              </tr>
              <tr>
                <td className="px-4 py-3 text-sm font-medium">Timestamp</td>
                <td className="px-4 py-3 text-sm">When the event occurred (in UTC)</td>
                <td className="px-4 py-3 text-sm">2025-04-14T10:23:45Z</td>
              </tr>
              <tr>
                <td className="px-4 py-3 text-sm font-medium">Event Type</td>
                <td className="px-4 py-3 text-sm">Category and specific type of event</td>
                <td className="px-4 py-3 text-sm">auth.login.success</td>
              </tr>
              <tr>
                <td className="px-4 py-3 text-sm font-medium">Actor</td>
                <td className="px-4 py-3 text-sm">User or system component that initiated the event</td>
                <td className="px-4 py-3 text-sm">user:john.doe@example.com</td>
              </tr>
              <tr>
                <td className="px-4 py-3 text-sm font-medium">Target</td>
                <td className="px-4 py-3 text-sm">Resource or object affected by the event</td>
                <td className="px-4 py-3 text-sm">workflow:marketing/campaign-2025</td>
              </tr>
              <tr>
                <td className="px-4 py-3 text-sm font-medium">Action</td>
                <td className="px-4 py-3 text-sm">The action performed</td>
                <td className="px-4 py-3 text-sm">execute</td>
              </tr>
              <tr>
                <td className="px-4 py-3 text-sm font-medium">IP Address</td>
                <td className="px-4 py-3 text-sm">Source IP of the request</td>
                <td className="px-4 py-3 text-sm">192.168.1.10</td>
              </tr>
              <tr>
                <td className="px-4 py-3 text-sm font-medium">User Agent</td>
                <td className="px-4 py-3 text-sm">Browser or client information</td>
                <td className="px-4 py-3 text-sm">Mozilla/5.0 (Windows NT 10.0...)</td>
              </tr>
              <tr>
                <td className="px-4 py-3 text-sm font-medium">Result</td>
                <td className="px-4 py-3 text-sm">Outcome of the action (success/failure)</td>
                <td className="px-4 py-3 text-sm">success</td>
              </tr>
              <tr>
                <td className="px-4 py-3 text-sm font-medium">Event Details</td>
                <td className="px-4 py-3 text-sm">Additional context-specific information</td>
                <td className="px-4 py-3 text-sm">{"{ \"parameters\": { \"input\": \"sample\" } }"}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};

export default AuditEventsTypes;

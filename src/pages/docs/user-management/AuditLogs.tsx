import React from 'react';
import DocLayout from '@/components/DocLayout';
import { ClipboardList, Search, Download, AlertCircle, Clock, Filter, BarChart, MessageSquare } from 'lucide-react';

const AuditLogs = () => {
  const sidebarLinks = [
    { title: 'User Management Overview', url: '/documentation/user-management' },
    { title: 'User Roles and Permissions', url: '/documentation/user-management/roles' },
    { title: 'Team Collaboration', url: '/documentation/user-management/collaboration' },
    { title: 'Access Control', url: '/documentation/user-management/access-control' },
    { title: 'Audit Logs', url: '/documentation/user-management/audit-logs', active: true },
  ];

  return (
    <DocLayout
      title="Audit Logs"
      description="Track and analyze user activities for security and compliance"
      sidebarLinks={sidebarLinks}
      breadcrumbs={[
        { title: 'User Management', url: '/documentation/user-management' },
        { title: 'Audit Logs', url: '/documentation/user-management/audit-logs' }
      ]}
      previousLink={{ title: 'Access Control', url: '/documentation/user-management/access-control' }}
    >
      <section className="mb-12">
        <p className="text-lg mb-6">
          Audit logs in GenerativSchool provide a comprehensive record of user activities and system events, 
          enabling you to monitor for security issues, troubleshoot problems, and maintain compliance with 
          regulatory requirements.
        </p>
        
        <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-6 mb-8">
          <div className="flex items-start">
            <ClipboardList className="h-6 w-6 text-indigo-600 mr-4 mt-1 flex-shrink-0" />
            <div>
              <h3 className="text-lg font-semibold mb-2">Comprehensive Activity Tracking</h3>
              <p>
                GenerativSchool automatically logs all significant events and actions performed by users or 
                system processes. These logs are securely stored and easily accessible through the audit log 
                interface, with enterprise retention policies available for long-term storage.
              </p>
            </div>
          </div>
        </div>
      </section>

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
                {/* Replace problematic JSON representation */}
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

      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Accessing and Managing Audit Logs</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center mb-4">
              <Search className="h-6 w-6 text-indigo-600 mr-3" />
              <h3 className="text-xl font-semibold">Searching and Filtering</h3>
            </div>
            <p className="mb-4">
              GenerativSchool provides powerful search capabilities to quickly find specific events in your audit logs.
            </p>
            <h4 className="font-medium mb-2">Advanced Filter Options</h4>
            <ul className="list-disc pl-6 space-y-2">
              <li>Event type and subtype</li>
              <li>Time range (from/to)</li>
              <li>User or system actor</li>
              <li>Resource type and identifier</li>
              <li>IP address or range</li>
              <li>Result (success/failure)</li>
              <li>Custom field values</li>
            </ul>
          </div>
          
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center mb-4">
              <Download className="h-6 w-6 text-indigo-600 mr-3" />
              <h3 className="text-xl font-semibold">Export and Integration</h3>
            </div>
            <p className="mb-4">
              Export audit logs for offline analysis or integrate with other security systems.
            </p>
            <h4 className="font-medium mb-2">Export Options</h4>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li>CSV for spreadsheet analysis</li>
              <li>JSON for programmatic processing</li>
              <li>PDF for reporting and documentation</li>
            </ul>
            <h4 className="font-medium mb-2">SIEM Integration</h4>
            <p className="text-sm text-gray-600">
              Enterprise plans support real-time log streaming to:
            </p>
            <ul className="list-disc pl-6 space-y-1 text-sm text-gray-600">
              <li>Splunk</li>
              <li>ELK Stack</li>
              <li>IBM QRadar</li>
              <li>AWS CloudWatch</li>
              <li>Custom SIEM via webhooks or APIs</li>
            </ul>
          </div>
        </div>
        
        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-8">
          <h3 className="text-xl font-semibold mb-4">Audit Log Interface</h3>
          <p className="mb-4">
            The audit log interface provides a user-friendly way to browse, search, and analyze your audit logs.
          </p>
          
          <div className="space-y-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium mb-2">Main View</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <div className="flex items-center mb-1">
                    <Filter className="h-4 w-4 text-gray-600 mr-2" />
                    <h5 className="text-sm font-medium">Filter Panel</h5>
                  </div>
                  <p className="text-xs text-gray-600">
                    Quickly narrow down logs using predefined or custom filters. Save filters for future use.
                  </p>
                </div>
                <div>
                  <div className="flex items-center mb-1">
                    <Clock className="h-4 w-4 text-gray-600 mr-2" />
                    <h5 className="text-sm font-medium">Timeline View</h5>
                  </div>
                  <p className="text-xs text-gray-600">
                    Chronological display of events with visual indicators for different event types.
                  </p>
                </div>
                <div>
                  <div className="flex items-center mb-1">
                    <MessageSquare className="h-4 w-4 text-gray-600 mr-2" />
                    <h5 className="text-sm font-medium">Detail Panel</h5>
                  </div>
                  <p className="text-xs text-gray-600">
                    Expanded view of selected events showing all captured metadata and context.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium mb-2">Search Capabilities</h4>
              <p className="text-sm mb-2">
                The search bar supports both simple text searches and advanced query syntax:
              </p>
              <div className="space-y-2">
                <div className="bg-white p-2 rounded border border-gray-200 text-sm">
                  <code className="font-mono text-xs">user:john.doe@example.com action:login after:2025-04-01</code>
                  <p className="text-xs text-gray-600 mt-1">Find all login events by a specific user after April 1, 2025</p>
                </div>
                <div className="bg-white p-2 rounded border border-gray-200 text-sm">
                  <code className="font-mono text-xs">resource:workflow/* result:failure</code>
                  <p className="text-xs text-gray-600 mt-1">Find all failed actions on any workflow</p>
                </div>
                <div className="bg-white p-2 rounded border border-gray-200 text-sm">
                  <code className="font-mono text-xs">ip:192.168.* AND type:auth.*</code>
                  <p className="text-xs text-gray-600 mt-1">Find authentication events from a specific IP range</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Compliance and Retention</h2>
        
        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-8">
          <h3 className="text-xl font-semibold mb-4">Retention Policies</h3>
          <p className="mb-4">
            GenerativSchool offers flexible retention policies to meet your compliance requirements.
          </p>
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Plan</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Default Retention</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Maximum Retention</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Custom Policies</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                <tr>
                  <td className="px-4 py-3 text-sm font-medium">Standard</td>
                  <td className="px-4 py-3 text-sm">30 days</td>
                  <td className="px-4 py-3 text-sm">90 days</td>
                  <td className="px-4 py-3 text-sm">Limited</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 text-sm font-medium">Professional</td>
                  <td className="px-4 py-3 text-sm">90 days</td>
                  <td className="px-4 py-3 text-sm">1 year</td>
                  <td className="px-4 py-3 text-sm">Yes</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 text-sm font-medium">Enterprise</td>
                  <td className="px-4 py-3 text-sm">1 year</td>
                  <td className="px-4 py-3 text-sm">7 years</td>
                  <td className="px-4 py-3 text-sm">Advanced</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-8">
          <div className="flex items-start">
            <AlertCircle className="h-6 w-6 text-yellow-600 mr-4 mt-1 flex-shrink-0" />
            <div>
              <h3 className="text-lg font-semibold mb-2">Compliance Requirements</h3>
              <p className="mb-4">
                Different industries and regions have specific compliance requirements for audit logging:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium mb-1">Financial Services</h4>
                  <ul className="list-disc pl-5 space-y-1 text-sm">
                    <li>SOX: 7-year retention</li>
                    <li>PCI DSS: 1-year retention with 3 months readily available</li>
                    <li>FINRA: 6-year retention</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-1">Healthcare</h4>
                  <ul className="list-disc pl-5 space-y-1 text-sm">
                    <li>HIPAA: 6-year retention</li>
                    <li>FDA CFR Part 11: Retention for the life of the product</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-1">Public Sector</h4>
                  <ul className="list-disc pl-5 space-y-1 text-sm">
                    <li>FedRAMP: 90-day minimum</li>
                    <li>CJIS: Minimum 1-year retention</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-1">General</h4>
                  <ul className="list-disc pl-5 space-y-1 text-sm">
                    <li>ISO 27001: Based on risk assessment</li>
                    <li>SOC 2: Based on risk assessment, typically 1 year</li>
                  </ul>
                </div>
              </div>
              <p className="mt-4 text-sm">
                Consult your compliance team to determine the appropriate retention period for your organization.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Security Monitoring and Alerting</h2>
        
        <p className="mb-6">
          Proactively monitor your audit logs for security issues with GenerativSchool's alerting capabilities.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-4">Setting Up Alerts</h3>
            <p className="mb-4">
              Create alert rules based on specific patterns or thresholds in your audit logs.
            </p>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-1">Alert Configuration</h4>
                <ol className="list-decimal pl-5 space-y-1 text-sm">
                  <li>Navigate to Audit Logs > Alerts</li>
                  <li>Click "Create New Alert"</li>
                  <li>Define your alert conditions</li>
                  <li>Set notification channels</li>
                  <li>Configure alert severity</li>
                  <li>Set throttling rules to prevent alert fatigue</li>
                  <li>Save and activate your alert</li>
                </ol>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <h4 className="font-medium mb-1">Example Alert Scenarios</h4>
                <ul className="list-disc pl-5 space-y-1 text-sm">
                  <li>Multiple failed login attempts</li>
                  <li>Admin privilege changes</li>
                  <li>Access from unusual locations</li>
                  <li>API key creation or modification</li>
                  <li>Critical resource modification</li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-4">Notification Channels</h3>
            <p className="mb-4">
              Receive alerts through various channels to ensure rapid response to security issues.
            </p>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-1">Available Channels</h4>
                <ul className="list-disc pl-5 space-y-1 text-sm">
                  <li>Email notifications</li>
                  <li>SMS alerts (Enterprise)</li>
                  <li>In-app notifications</li>
                  <li>Webhook integrations</li>
                  <li>Slack/Microsoft Teams</li>
                  <li>PagerDuty integration (Enterprise)</li>
                  <li>Custom HTTP endpoints</li>
                </ul>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <h4 className="font-medium mb-1">Notification Format</h4>
                <p className="text-xs mb-2">Each notification includes:</p>
                <ul className="list-disc pl-5 space-y-1 text-xs">
                  <li>Alert name and severity</li>
                  <li>Trigger time and conditions</li>
                  <li>Event details that triggered the alert</li>
                  <li>Contextual information</li>
                  <li>Direct link to investigate in the audit log UI</li>
                  <li>Recommended actions (Enterprise)</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-6">Audit Log Analytics</h2>
        
        <p className="mb-6">
          GenerativSchool Enterprise provides advanced analytics capabilities to help you derive insights 
          from your audit logs.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center mb-4">
              <BarChart className="h-6 w-6 text-indigo-600 mr-3" />
              <h3 className="text-xl font-semibold">Usage Patterns</h3>
            </div>
            <p className="mb-4">
              Analyze how your team uses GenerativSchool to identify optimization opportunities.
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Most active users and resources</li>
              <li>Usage trends over time</li>
              <li>Feature adoption metrics</li>
              <li>Workflow execution patterns</li>
              <li>Resource access frequency</li>
            </ul>
          </div>
          
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center mb-4">
              <AlertCircle className="h-6 w-6 text-indigo-600 mr-3" />
              <h3 className="text-xl font-semibold">Security Analytics</h3>
            </div>
            <p className="mb-4">
              Identify potential security issues through advanced pattern analysis.
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Anomaly detection in user behavior</li>
              <li>Unusual access patterns</li>
              <li>Credential usage analysis</li>
              <li>Privilege escalation tracking</li>
              <li>Cross-correlation with threat intelligence</li>
            </ul>
          </div>
        </div>
        
        <div className="bg-blue-50 border border-blue-100 rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-4">Custom Reporting</h3>
          <p className="mb-4">
            Create custom reports based on your audit log data to meet specific business or compliance needs.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-2">Report Types</h4>
              <ul className="list-disc pl-6 space-y-1">
                <li>User activity summaries</li>
                <li>Resource access reports</li>
                <li>Compliance documentation</li>
                <li>Security incident analysis</li>
                <li>Workflow execution metrics</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">Scheduling Options</h4>
              <ul className="list-disc pl-6 space-y-1">
                <li>One-time reports</li>
                <li>Daily/weekly/monthly schedules</li>
                <li>Event-triggered reports</li>
                <li>Custom delivery to stakeholders</li>
                <li>Export in multiple formats</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </DocLayout>
  );
};

export default AuditLogs;

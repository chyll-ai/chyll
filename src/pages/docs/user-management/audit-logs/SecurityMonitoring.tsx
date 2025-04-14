
import React from 'react';

const SecurityMonitoring = () => {
  return (
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
                <li>Navigate to Audit Logs {"->"} Alerts</li>
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
  );
};

export default SecurityMonitoring;

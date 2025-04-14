
import React from 'react';
import { BarChart, AlertCircle } from 'lucide-react';

const AuditLogsAnalytics = () => {
  return (
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
  );
};

export default AuditLogsAnalytics;

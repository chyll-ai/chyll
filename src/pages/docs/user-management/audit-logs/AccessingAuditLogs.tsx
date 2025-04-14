
import React from 'react';
import { Search, Download, Filter, Clock, MessageSquare } from 'lucide-react';

const AccessingAuditLogs = () => {
  return (
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
  );
};

export default AccessingAuditLogs;

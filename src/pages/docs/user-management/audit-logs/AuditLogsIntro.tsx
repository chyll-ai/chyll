
import React from 'react';
import { ClipboardList } from 'lucide-react';

const AuditLogsIntro = () => {
  return (
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
  );
};

export default AuditLogsIntro;

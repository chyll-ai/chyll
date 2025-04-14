
import React from 'react';
import DocLayout from '@/components/DocLayout';
import AuditLogsIntro from './audit-logs/AuditLogsIntro';
import AuditEventsTypes from './audit-logs/AuditEventsTypes';
import AccessingAuditLogs from './audit-logs/AccessingAuditLogs';
import ComplianceAndRetention from './audit-logs/ComplianceAndRetention';
import SecurityMonitoring from './audit-logs/SecurityMonitoring';
import AuditLogsAnalytics from './audit-logs/AuditLogsAnalytics';

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
      <AuditLogsIntro />
      <AuditEventsTypes />
      <AccessingAuditLogs />
      <ComplianceAndRetention />
      <SecurityMonitoring />
      <AuditLogsAnalytics />
    </DocLayout>
  );
};

export default AuditLogs;


import React from 'react';
import DocLayout from '@/components/DocLayout';
import CollaborationEssentials from './collaboration/CollaborationEssentials';
import SharingAndPermissions from './collaboration/SharingAndPermissions';
import CollaborativeWorkflow from './collaboration/CollaborativeWorkflow';
import TeamWorkspaces from './collaboration/TeamWorkspaces';
import CollaborativeAnalytics from './collaboration/CollaborativeAnalytics';

const Collaboration = () => {
  const sidebarLinks = [
    { title: 'User Management Overview', url: '/documentation/user-management' },
    { title: 'User Roles and Permissions', url: '/documentation/user-management/roles' },
    { title: 'Team Collaboration', url: '/documentation/user-management/collaboration', active: true },
    { title: 'Access Control', url: '/documentation/user-management/access-control' },
    { title: 'Audit Logs', url: '/documentation/user-management/audit-logs' },
  ];

  return (
    <DocLayout
      title="Team Collaboration"
      description="Enhance productivity through effective team collaboration features"
      sidebarLinks={sidebarLinks}
      breadcrumbs={[
        { title: 'User Management', url: '/documentation/user-management' },
        { title: 'Team Collaboration', url: '/documentation/user-management/collaboration' }
      ]}
      previousLink={{ title: 'User Roles and Permissions', url: '/documentation/user-management/roles' }}
      nextLink={{ title: 'Access Control', url: '/documentation/user-management/access-control' }}
    >
      <CollaborationEssentials />
      <SharingAndPermissions />
      <CollaborativeWorkflow />
      <TeamWorkspaces />
      <CollaborativeAnalytics />
    </DocLayout>
  );
};

export default Collaboration;

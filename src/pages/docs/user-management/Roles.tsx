
import React from 'react';
import DocLayout from '@/components/DocLayout';

const Roles = () => {
  const sidebarLinks = [
    { title: 'User Management Overview', url: '/documentation/user-management' },
    { title: 'User Roles and Permissions', url: '/documentation/user-management/roles', active: true },
    { title: 'Team Collaboration', url: '/documentation/user-management/collaboration' },
    { title: 'Access Control', url: '/documentation/user-management/access-control' },
    { title: 'Audit Logs', url: '/documentation/user-management/audit-logs' },
  ];

  return (
    <DocLayout
      title="User Roles and Permissions"
      description="Manage access levels and capabilities for different user types"
      sidebarLinks={sidebarLinks}
      breadcrumbs={[
        { title: 'User Management', url: '/documentation/user-management' },
        { title: 'User Roles and Permissions', url: '/documentation/user-management/roles' }
      ]}
      previousLink={{ title: 'User Management Overview', url: '/documentation/user-management' }}
      nextLink={{ title: 'Team Collaboration', url: '/documentation/user-management/collaboration' }}
    >
      <section className="mb-12">
        <p className="text-lg mb-6">
          Configure user roles and permissions to control what users can see and do within your GenerativSchool workspace.
        </p>
        <div className="p-6 bg-blue-50 border border-blue-100 rounded-lg mb-10">
          <h3 className="text-lg font-semibold mb-2">Role-Based Access Control</h3>
          <p className="mb-4">
            GenerativSchool uses a role-based access control system that allows you to assign users to predefined roles 
            with specific permissions. This approach simplifies access management while providing fine-grained control 
            over what users can access and modify.
          </p>
          <p>
            Create custom roles with specific permissions or use our predefined roles: Admin, Editor, Author, and Viewer.
          </p>
        </div>
        
        <h2 className="text-2xl font-bold mt-8 mb-4">Standard Roles</h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 px-4 py-2 text-left">Role</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Description</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Capabilities</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-gray-300 px-4 py-2 font-medium">Admin</td>
                <td className="border border-gray-300 px-4 py-2">Full system access and control</td>
                <td className="border border-gray-300 px-4 py-2">
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Manage users and roles</li>
                    <li>Create and edit all workflows</li>
                    <li>Manage integrations and API keys</li>
                    <li>Access system settings and billing</li>
                    <li>View audit logs and reports</li>
                  </ul>
                </td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-2 font-medium">Editor</td>
                <td className="border border-gray-300 px-4 py-2">Create and edit functionality</td>
                <td className="border border-gray-300 px-4 py-2">
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Create and edit workflows</li>
                    <li>Manage shared templates</li>
                    <li>View and analyze workflow results</li>
                    <li>Access integrations (but not manage keys)</li>
                    <li>View team activity</li>
                  </ul>
                </td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-2 font-medium">Author</td>
                <td className="border border-gray-300 px-4 py-2">Limited creation abilities</td>
                <td className="border border-gray-300 px-4 py-2">
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Create and edit their own workflows</li>
                    <li>Use existing templates</li>
                    <li>View their own workflow results</li>
                    <li>Use existing integrations</li>
                  </ul>
                </td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-2 font-medium">Viewer</td>
                <td className="border border-gray-300 px-4 py-2">Read-only access</td>
                <td className="border border-gray-300 px-4 py-2">
                  <ul className="list-disc pl-5 space-y-1">
                    <li>View workflows (but not edit)</li>
                    <li>View workflow results</li>
                    <li>View dashboards and reports</li>
                  </ul>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <h2 className="text-2xl font-bold mt-10 mb-4">Custom Roles</h2>
        <p className="mb-6">
          If the standard roles don't meet your requirements, you can create custom roles with specific permission sets.
        </p>
        
        <div className="p-6 bg-gray-50 border border-gray-200 rounded-lg mb-8">
          <h3 className="font-semibold mb-2">Creating a Custom Role</h3>
          <ol className="list-decimal pl-6 space-y-2">
            <li>Navigate to User Management &gt; Roles</li>
            <li>Click "Create New Role"</li>
            <li>Name your role and provide a description</li>
            <li>Select the specific permissions you want to grant</li>
            <li>Save your new role</li>
            <li>Assign users to the new role (e.g., &quot;Marketing Team&quot; with specific marketing-related permissions)</li>
          </ol>
        </div>
        
        <h2 className="text-2xl font-bold mt-10 mb-4">Permission Categories</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
            <h3 className="font-semibold mb-2">Workflow Permissions</h3>
            <ul className="list-disc pl-5 space-y-1 text-gray-700">
              <li>View workflows</li>
              <li>Create workflows</li>
              <li>Edit workflows</li>
              <li>Delete workflows</li>
              <li>Run workflows</li>
              <li>Schedule workflows</li>
            </ul>
          </div>
          
          <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
            <h3 className="font-semibold mb-2">Data Permissions</h3>
            <ul className="list-disc pl-5 space-y-1 text-gray-700">
              <li>View data</li>
              <li>Import data</li>
              <li>Export data</li>
              <li>Delete data</li>
              <li>Manage data connections</li>
            </ul>
          </div>
          
          <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
            <h3 className="font-semibold mb-2">Integration Permissions</h3>
            <ul className="list-disc pl-5 space-y-1 text-gray-700">
              <li>View integrations</li>
              <li>Configure integrations</li>
              <li>Manage API keys</li>
              <li>Create webhooks</li>
            </ul>
          </div>
          
          <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
            <h3 className="font-semibold mb-2">Administrative Permissions</h3>
            <ul className="list-disc pl-5 space-y-1 text-gray-700">
              <li>Manage users</li>
              <li>Manage roles</li>
              <li>View audit logs</li>
              <li>Configure workspace settings</li>
              <li>Manage billing</li>
            </ul>
          </div>
        </div>
        
        <div className="bg-yellow-50 p-6 rounded-lg border border-yellow-100 mb-8">
          <h3 className="text-lg font-semibold text-yellow-800 mb-2">Best Practices</h3>
          <ul className="list-disc pl-6 space-y-2 text-gray-700">
            <li>Follow the principle of least privilege - only grant permissions that users actually need</li>
            <li>Regularly audit your user roles and permissions</li>
            <li>Create role templates for common job functions in your organization</li>
            <li>Document your role definitions and permission assignments</li>
          </ul>
        </div>
      </section>
    </DocLayout>
  );
};

export default Roles;

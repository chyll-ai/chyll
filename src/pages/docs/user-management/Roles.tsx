import React from 'react';
import DocLayout from '@/components/DocLayout';
import { UserCog, ShieldCheck, Users, AlertTriangle } from 'lucide-react';

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
      description="Understanding and configuring user roles within your GenerativSchool workspace"
      sidebarLinks={sidebarLinks}
      breadcrumbs={[
        { title: 'User Management', url: '/documentation/user-management' },
        { title: 'User Roles and Permissions', url: '/documentation/user-management/roles' }
      ]}
      previousLink={{ title: 'User Management', url: '/documentation/user-management' }}
      nextLink={{ title: 'Team Collaboration', url: '/documentation/user-management/collaboration' }}
    >
      <section className="mb-12">
        <p className="text-lg mb-6">
          GenerativSchool provides a flexible role-based access control system that allows you to define 
          what actions different users can perform in your workspace. Understanding these roles and how to 
          assign them is key to maintaining security while enabling collaboration.
        </p>

        <div className="p-6 bg-blue-50 border border-blue-100 rounded-lg mb-10">
          <h3 className="text-lg font-semibold mb-2 flex items-center">
            <AlertTriangle className="h-5 w-5 text-blue-600 mr-2" />
            What You'll Learn
          </h3>
          <p>
            This guide covers the standard roles available in GenerativSchool, the permissions associated 
            with each role, and how to assign roles to team members. Enterprise customers will also learn 
            about custom role creation.
          </p>
        </div>

        <div className="space-y-12">
          <div>
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <UserCog className="h-6 w-6 text-indigo-600" />
              Standard User Roles
            </h2>
            <p className="mb-6">
              GenerativSchool provides several predefined roles to meet the needs of most organizations:
            </p>
            
            <div className="space-y-6">
              <div className="bg-white p-5 border border-gray-200 rounded-lg">
                <h3 className="text-xl font-semibold mb-3">Workspace Owner</h3>
                <p className="mb-3">
                  The Workspace Owner has full control over all aspects of the workspace, including billing, 
                  user management, and all workflow operations.
                </p>
                <h4 className="font-medium mb-2">Key Permissions:</h4>
                <ul className="list-disc pl-6 space-y-1 text-gray-700">
                  <li>Manage billing and subscription</li>
                  <li>Add, remove, and manage all users</li>
                  <li>Create, edit, delete, and activate all workflows</li>
                  <li>Configure all integrations and connections</li>
                  <li>Access all analytics and audit logs</li>
                  <li>Manage workspace settings</li>
                  <li>Transfer workspace ownership</li>
                </ul>
              </div>
              
              <div className="bg-white p-5 border border-gray-200 rounded-lg">
                <h3 className="text-xl font-semibold mb-3">Administrator</h3>
                <p className="mb-3">
                  Administrators have almost all the capabilities of an Owner, except for billing management 
                  and workspace deletion.
                </p>
                <h4 className="font-medium mb-2">Key Permissions:</h4>
                <ul className="list-disc pl-6 space-y-1 text-gray-700">
                  <li>Add, remove, and manage users (except Owners)</li>
                  <li>Create, edit, delete, and activate all workflows</li>
                  <li>Configure all integrations and connections</li>
                  <li>Access all analytics and audit logs</li>
                  <li>Manage most workspace settings</li>
                </ul>
              </div>
              
              <div className="bg-white p-5 border border-gray-200 rounded-lg">
                <h3 className="text-xl font-semibold mb-3">Workflow Manager</h3>
                <p className="mb-3">
                  Workflow Managers can create and manage all workflows but have limited access to user 
                  management and workspace settings.
                </p>
                <h4 className="font-medium mb-2">Key Permissions:</h4>
                <ul className="list-disc pl-6 space-y-1 text-gray-700">
                  <li>Create, edit, delete, and activate all workflows</li>
                  <li>Configure integrations and connections</li>
                  <li>View workflow analytics</li>
                  <li>Limited access to audit logs (workflow-related only)</li>
                  <li>Cannot manage users or workspace settings</li>
                </ul>
              </div>
              
              <div className="bg-white p-5 border border-gray-200 rounded-lg">
                <h3 className="text-xl font-semibold mb-3">Workflow Editor</h3>
                <p className="mb-3">
                  Workflow Editors can create and edit workflows but cannot activate or delete certain workflows 
                  depending on your settings.
                </p>
                <h4 className="font-medium mb-2">Key Permissions:</h4>
                <ul className="list-disc pl-6 space-y-1 text-gray-700">
                  <li>Create new workflows</li>
                  <li>Edit existing workflows</li>
                  <li>Limited ability to activate workflows (configurable)</li>
                  <li>Cannot delete production workflows</li>
                  <li>Limited access to analytics</li>
                  <li>Cannot manage users or workspace settings</li>
                </ul>
              </div>
              
              <div className="bg-white p-5 border border-gray-200 rounded-lg">
                <h3 className="text-xl font-semibold mb-3">Viewer</h3>
                <p className="mb-3">
                  Viewers have read-only access to workflows and limited analytics, making this role ideal 
                  for stakeholders who need visibility but shouldn't make changes.
                </p>
                <h4 className="font-medium mb-2">Key Permissions:</h4>
                <ul className="list-disc pl-6 space-y-1 text-gray-700">
                  <li>View workflows (read-only)</li>
                  <li>View basic analytics</li>
                  <li>Cannot create, edit, delete, or activate workflows</li>
                  <li>Cannot configure integrations</li>
                  <li>Cannot manage users or workspace settings</li>
                </ul>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <ShieldCheck className="h-6 w-6 text-indigo-600" />
              Assigning Roles to Users
            </h2>
            <p className="mb-6">
              Follow these steps to assign or change a user's role:
            </p>
            
            <ol className="list-decimal pl-6 space-y-4">
              <li>
                <strong>Navigate to User Management:</strong>
                <p className="mt-1 text-gray-700">From your workspace dashboard, go to Settings > User Management.</p>
              </li>
              <li>
                <strong>Find the User:</strong>
                <p className="mt-1 text-gray-700">Locate the user in the list or use the search function to find them by name or email.</p>
              </li>
              <li>
                <strong>Edit User Role:</strong>
                <p className="mt-1 text-gray-700">Click the "Edit" or gear icon next to the user's name to open their settings.</p>
              </li>
              <li>
                <strong>Select a New Role:</strong>
                <p className="mt-1 text-gray-700">From the Role dropdown, select the appropriate role for the user.</p>
              </li>
              <li>
                <strong>Save Changes:</strong>
                <p className="mt-1 text-gray-700">Click the "Save" or "Update" button to apply the new role.</p>
              </li>
              <li>
                <strong>Verify the Change:</strong>
                <p className="mt-1 text-gray-700">The user will receive a notification about their role change, and the new permissions will take effect immediately.</p>
              </li>
            </ol>
            
            <div className="bg-gray-50 p-4 rounded border border-gray-200 mt-6">
              <p className="text-sm text-gray-700">
                <strong>Pro Tip:</strong> When changing a user's role to one with fewer permissions, 
                consider notifying them in advance and explaining the reason for the change to maintain 
                transparency and trust within your team.
              </p>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <Users className="h-6 w-6 text-indigo-600" />
              Role Best Practices
            </h2>
            <p className="mb-6">
              Follow these recommendations for effective role management:
            </p>
            
            <div className="space-y-4">
              <div className="p-4 bg-white rounded-lg border border-gray-200">
                <h3 className="font-semibold mb-2">Follow the Principle of Least Privilege</h3>
                <p className="text-gray-700">
                  Assign users the minimum level of access they need to perform their job functions. 
                  This limits the potential impact of account compromise or misuse.
                </p>
              </div>
              
              <div className="p-4 bg-white rounded-lg border border-gray-200">
                <h3 className="font-semibold mb-2">Have Multiple Workspace Owners</h3>
                <p className="text-gray-700">
                  Designate at least two Workspace Owners to ensure you don't lose access if one 
                  person is unavailable or leaves the organization.
                </p>
              </div>
              
              <div className="p-4 bg-white rounded-lg border border-gray-200">
                <h3 className="font-semibold mb-2">Regularly Review User Roles</h3>
                <p className="text-gray-700">
                  Conduct periodic reviews of user roles to ensure they remain appropriate as job responsibilities 
                  change. This is especially important after team restructuring.
                </p>
              </div>
              
              <div className="p-4 bg-white rounded-lg border border-gray-200">
                <h3 className="font-semibold mb-2">Document Your Role Strategy</h3>
                <p className="text-gray-700">
                  Create and maintain documentation that explains which roles should be assigned to different 
                  positions within your organization for consistency.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-indigo-50 p-6 rounded-lg border border-indigo-100">
        <h2 className="text-2xl font-bold mb-4">Enterprise: Custom Roles</h2>
        <p className="mb-6">
          GenerativSchool Enterprise customers can create custom roles with granular permission controls:
        </p>
        <ul className="list-disc pl-6 space-y-2 mb-6">
          <li>Create roles tailored to your organization's specific needs</li>
          <li>Define granular permissions at the feature and resource level</li>
          <li>Set scope-based permissions (e.g., access to specific folders or projects)</li>
          <li>Create permission templates that can be applied across multiple roles</li>
          <li>Implement approval workflows for sensitive operations</li>
        </ul>
        <a href="/pricing" className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors">
          Learn about Enterprise
        </a>
      </section>
    </DocLayout>
  );
};

export default Roles;

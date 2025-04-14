
import React from 'react';
import DocLayout from '@/components/DocLayout';
import { UserCog, UsersRound, ShieldCheck, ClipboardList } from 'lucide-react';
import { Link } from 'react-router-dom';

const UserManagement = () => {
  const sidebarLinks = [
    { title: 'Overview', url: '/documentation/user-management', active: true },
    { title: 'User Roles and Permissions', url: '/documentation/user-management/roles' },
    { title: 'Team Collaboration', url: '/documentation/user-management/collaboration' },
    { title: 'Access Control', url: '/documentation/user-management/access-control' },
    { title: 'Audit Logs', url: '/documentation/user-management/audit-logs' },
  ];

  return (
    <DocLayout
      title="User Management"
      description="Control access and permissions within your GenerativSchool workspace"
      sidebarLinks={sidebarLinks}
      breadcrumbs={[{ title: 'User Management', url: '/documentation/user-management' }]}
      nextLink={{ title: 'User Roles and Permissions', url: '/documentation/user-management/roles' }}
    >
      <section className="mb-12">
        <p className="text-lg mb-6">
          Effectively managing users, permissions, and access controls is essential for organizations using 
          GenerativSchool. Our user management features provide the flexibility and security you 
          need to collaborate safely.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center mb-4">
              <UserCog className="h-8 w-8 text-indigo-600 mr-3" />
              <h3 className="text-xl font-semibold">User Roles and Permissions</h3>
            </div>
            <p className="text-gray-700 mb-4">
              Learn about the different user roles available and how to assign appropriate permissions to team members.
            </p>
            <Link to="/documentation/user-management/roles" className="text-indigo-600 hover:text-indigo-800 font-medium">
              Learn about roles →
            </Link>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center mb-4">
              <UsersRound className="h-8 w-8 text-indigo-600 mr-3" />
              <h3 className="text-xl font-semibold">Team Collaboration</h3>
            </div>
            <p className="text-gray-700 mb-4">
              Best practices for collaborative workflow development and management within teams.
            </p>
            <Link to="/documentation/user-management/collaboration" className="text-indigo-600 hover:text-indigo-800 font-medium">
              Collaboration guide →
            </Link>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center mb-4">
              <ShieldCheck className="h-8 w-8 text-indigo-600 mr-3" />
              <h3 className="text-xl font-semibold">Access Control</h3>
            </div>
            <p className="text-gray-700 mb-4">
              Configure granular access controls for workflows, integrations, and sensitive data.
            </p>
            <Link to="/documentation/user-management/access-control" className="text-indigo-600 hover:text-indigo-800 font-medium">
              Access control guide →
            </Link>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center mb-4">
              <ClipboardList className="h-8 w-8 text-indigo-600 mr-3" />
              <h3 className="text-xl font-semibold">Audit Logs</h3>
            </div>
            <p className="text-gray-700 mb-4">
              Track and review user actions with comprehensive audit logs for security and compliance.
            </p>
            <Link to="/documentation/user-management/audit-logs" className="text-indigo-600 hover:text-indigo-800 font-medium">
              Audit logging guide →
            </Link>
          </div>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4">User Management Best Practices</h2>
        <div className="space-y-4">
          <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
            <h3 className="font-semibold mb-2">Implement the Principle of Least Privilege</h3>
            <p className="text-gray-700">
              Grant users only the permissions they need to perform their job functions, reducing 
              the risk of accidental or intentional misuse.
            </p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
            <h3 className="font-semibold mb-2">Regularly Review Access</h3>
            <p className="text-gray-700">
              Schedule periodic reviews of user accounts and permissions to ensure they remain appropriate 
              as roles change within your organization.
            </p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
            <h3 className="font-semibold mb-2">Use Role-Based Access Control</h3>
            <p className="text-gray-700">
              Instead of assigning permissions to individual users, assign them to roles and then 
              assign users to those roles for more efficient management.
            </p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
            <h3 className="font-semibold mb-2">Enable Multi-Factor Authentication</h3>
            <p className="text-gray-700">
              Require MFA for all users, especially those with administrative privileges, to add 
              an additional layer of security.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-blue-50 p-6 rounded-lg border border-blue-100">
        <h2 className="text-2xl font-bold mb-4">Enterprise Features</h2>
        <p className="mb-6">
          GenerativSchool Enterprise offers additional user management features, including:
        </p>
        <ul className="list-disc pl-6 space-y-2 mb-6">
          <li>SAML/SSO integration with identity providers</li>
          <li>Custom roles and permissions</li>
          <li>Advanced audit logging and reporting</li>
          <li>IP restrictions and security policies</li>
          <li>User activity analytics</li>
        </ul>
        <a href="/pricing" className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
          Learn about Enterprise
        </a>
      </section>
    </DocLayout>
  );
};

export default UserManagement;

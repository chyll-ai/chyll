
import React from 'react';
import DocLayout from '@/components/DocLayout';
import { Lock, ShieldCheck, KeyRound, FileCheck, AlertTriangle, Target } from 'lucide-react';

const AccessControl = () => {
  const sidebarLinks = [
    { title: 'User Management Overview', url: '/documentation/user-management' },
    { title: 'User Roles and Permissions', url: '/documentation/user-management/roles' },
    { title: 'Team Collaboration', url: '/documentation/user-management/collaboration' },
    { title: 'Access Control', url: '/documentation/user-management/access-control', active: true },
    { title: 'Audit Logs', url: '/documentation/user-management/audit-logs' },
  ];

  return (
    <DocLayout
      title="Access Control"
      description="Secure your resources with fine-grained access control mechanisms"
      sidebarLinks={sidebarLinks}
      breadcrumbs={[
        { title: 'User Management', url: '/documentation/user-management' },
        { title: 'Access Control', url: '/documentation/user-management/access-control' }
      ]}
      previousLink={{ title: 'Team Collaboration', url: '/documentation/user-management/collaboration' }}
      nextLink={{ title: 'Audit Logs', url: '/documentation/user-management/audit-logs' }}
    >
      <section className="mb-12">
        <p className="text-lg mb-6">
          Access control in GenerativSchool allows you to precisely define who can access your 
          resources and what actions they can perform. Implement robust security measures to protect 
          sensitive data and ensure that users only have access to the functionality they need.
        </p>
        
        <div className="p-6 bg-yellow-50 border border-yellow-200 rounded-lg mb-8">
          <div className="flex items-start">
            <AlertTriangle className="h-6 w-6 text-yellow-600 mr-4 mt-1 flex-shrink-0" />
            <div>
              <h3 className="text-lg font-semibold mb-2">Security First Approach</h3>
              <p>
                When setting up access control, always follow the principle of least privilege—grant users 
                only the permissions they absolutely need to perform their job functions, nothing more. 
                Regularly review access rights to ensure they remain appropriate as roles and 
                responsibilities change.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Access Control Models</h2>
        
        <p className="mb-6">
          GenerativSchool supports several access control models that can be used individually or in combination 
          to create a comprehensive security framework.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center mb-4">
              <ShieldCheck className="h-6 w-6 text-indigo-600 mr-3" />
              <h3 className="text-xl font-semibold">Role-Based Access Control (RBAC)</h3>
            </div>
            <p className="mb-4">
              Assign permissions to roles, then assign users to those roles. This simplifies access 
              management and provides a clear structure.
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Predefined roles with permission sets</li>
              <li>Custom roles for specific requirements</li>
              <li>Hierarchical role structures</li>
              <li>Role inheritance capabilities</li>
            </ul>
          </div>
          
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center mb-4">
              <Target className="h-6 w-6 text-indigo-600 mr-3" />
              <h3 className="text-xl font-semibold">Attribute-Based Access Control (ABAC)</h3>
            </div>
            <p className="mb-4">
              Define access based on attributes of users, resources, actions, and environment. This 
              offers more granular control than RBAC alone.
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>User attributes (department, location, clearance)</li>
              <li>Resource attributes (classification, owner, type)</li>
              <li>Environmental conditions (time, location, device)</li>
              <li>Advanced policy expressions</li>
            </ul>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center mb-4">
              <Lock className="h-6 w-6 text-indigo-600 mr-3" />
              <h3 className="text-xl font-semibold">Discretionary Access Control (DAC)</h3>
            </div>
            <p className="mb-4">
              Resource owners can grant access permissions to other users. This provides flexibility 
              and enables delegation of access control.
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Owner-controlled sharing</li>
              <li>Delegation of access rights</li>
              <li>User-to-user permissions</li>
              <li>Sharing with expiration dates</li>
            </ul>
          </div>
          
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center mb-4">
              <FileCheck className="h-6 w-6 text-indigo-600 mr-3" />
              <h3 className="text-xl font-semibold">Mandatory Access Control (MAC)</h3>
            </div>
            <p className="mb-4">
              System-enforced access controls based on sensitivity labels. This provides the strictest 
              level of control for highly sensitive environments.
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Security classification levels</li>
              <li>Data sensitivity labeling</li>
              <li>System-enforced restrictions</li>
              <li>Compliance with regulatory requirements</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Resource-Level Access Control</h2>
        
        <p className="mb-6">
          Beyond user roles and system-wide permissions, GenerativSchool allows you to set access 
          controls at the resource level. This gives you fine-grained control over individual items.
        </p>
        
        <div className="overflow-x-auto mb-8">
          <table className="min-w-full border border-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Resource Type</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Available Permissions</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Inheritance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              <tr>
                <td className="px-6 py-4 text-sm font-medium">Workflows</td>
                <td className="px-6 py-4 text-sm">
                  <ul className="list-disc pl-5 space-y-1">
                    <li>View</li>
                    <li>Edit</li>
                    <li>Execute</li>
                    <li>Delete</li>
                    <li>Share</li>
                    <li>Manage Access</li>
                  </ul>
                </td>
                <td className="px-6 py-4 text-sm">Folder permissions can be inherited</td>
              </tr>
              <tr>
                <td className="px-6 py-4 text-sm font-medium">Data Sources</td>
                <td className="px-6 py-4 text-sm">
                  <ul className="list-disc pl-5 space-y-1">
                    <li>View</li>
                    <li>Query</li>
                    <li>Modify Structure</li>
                    <li>Write Data</li>
                    <li>Delete Data</li>
                    <li>Manage Access</li>
                  </ul>
                </td>
                <td className="px-6 py-4 text-sm">Data source category permissions can be inherited</td>
              </tr>
              <tr>
                <td className="px-6 py-4 text-sm font-medium">Reports</td>
                <td className="px-6 py-4 text-sm">
                  <ul className="list-disc pl-5 space-y-1">
                    <li>View</li>
                    <li>Edit</li>
                    <li>Export</li>
                    <li>Schedule</li>
                    <li>Delete</li>
                    <li>Manage Access</li>
                  </ul>
                </td>
                <td className="px-6 py-4 text-sm">Dashboard permissions can be inherited</td>
              </tr>
              <tr>
                <td className="px-6 py-4 text-sm font-medium">API Keys</td>
                <td className="px-6 py-4 text-sm">
                  <ul className="list-disc pl-5 space-y-1">
                    <li>View</li>
                    <li>Create</li>
                    <li>Revoke</li>
                    <li>Set Scopes</li>
                  </ul>
                </td>
                <td className="px-6 py-4 text-sm">No inheritance, direct permissions only</td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-8">
          <h3 className="text-xl font-semibold mb-4">Setting Resource-Level Permissions</h3>
          
          <div className="space-y-6">
            <div>
              <h4 className="font-medium mb-2">1. Navigate to the resource</h4>
              <p className="text-sm text-gray-600">
                Open the workflow, dataset, report, or other resource you want to set permissions for.
              </p>
            </div>
            
            <div>
              <h4 className="font-medium mb-2">2. Access permission settings</h4>
              <p className="text-sm text-gray-600">
                Click on the "Settings" or "Permissions" icon, usually found in the toolbar or menu.
              </p>
            </div>
            
            <div>
              <h4 className="font-medium mb-2">3. Add users or groups</h4>
              <p className="text-sm text-gray-600">
                Select the users, groups, or roles you want to grant access to. You can search by name or email.
              </p>
            </div>
            
            <div>
              <h4 className="font-medium mb-2">4. Assign permission levels</h4>
              <p className="text-sm text-gray-600">
                For each user or group, select the appropriate permission level from the dropdown menu.
              </p>
            </div>
            
            <div>
              <h4 className="font-medium mb-2">5. Set inheritance options</h4>
              <p className="text-sm text-gray-600">
                Choose whether permissions should be inherited by child resources (for folders or collections).
              </p>
            </div>
            
            <div>
              <h4 className="font-medium mb-2">6. Save changes</h4>
              <p className="text-sm text-gray-600">
                Click "Save" or "Apply" to implement the new permission settings.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Access Control Policies</h2>
        
        <p className="mb-6">
          For advanced access control requirements, GenerativSchool allows you to define custom policies 
          using a policy language. This gives you the most flexibility in defining complex access rules.
        </p>
        
        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-8">
          <h3 className="text-xl font-semibold mb-4">Policy Components</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium mb-2">Effect</h4>
              <p className="text-sm text-gray-600">
                Whether to allow or deny access when the policy conditions are met.
              </p>
              <div className="mt-2 text-xs bg-gray-100 p-2 rounded font-mono">
                "effect": "allow"
              </div>
            </div>
            
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium mb-2">Principal</h4>
              <p className="text-sm text-gray-600">
                The user, role, or group the policy applies to.
              </p>
              <div className="mt-2 text-xs bg-gray-100 p-2 rounded font-mono">
                "principal": ["role:editor", "user:jane@example.com"]
              </div>
            </div>
            
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium mb-2">Action</h4>
              <p className="text-sm text-gray-600">
                The operations the policy controls.
              </p>
              <div className="mt-2 text-xs bg-gray-100 p-2 rounded font-mono">
                "action": ["workflow:execute", "workflow:read"]
              </div>
            </div>
            
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium mb-2">Resource</h4>
              <p className="text-sm text-gray-600">
                The resources the policy applies to.
              </p>
              <div className="mt-2 text-xs bg-gray-100 p-2 rounded font-mono">
                "resource": "workflow:marketing/*"
              </div>
            </div>
            
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium mb-2">Condition</h4>
              <p className="text-sm text-gray-600">
                Additional constraints that must be satisfied.
              </p>
              <div className="mt-2 text-xs bg-gray-100 p-2 rounded font-mono">
                "condition": {"{"} "time": {"{"} "after": "09:00", "before": "17:00" {"}"} {"}"}
              </div>
            </div>
            
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium mb-2">Context</h4>
              <p className="text-sm text-gray-600">
                Environmental attributes available during evaluation.
              </p>
              <div className="mt-2 text-xs bg-gray-100 p-2 rounded font-mono">
                {"{"} "sourceIp": "192.168.1.10", "userAgent": "Chrome/90" {"}"}
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-4">Example Policy</h3>
          
          <p className="mb-4">
            Here's an example of a complete access policy that allows members of the marketing team 
            to view and execute workflows in the marketing folder, but only during business hours.
          </p>
          
          <div className="bg-gray-100 p-4 rounded-lg font-mono text-sm overflow-x-auto">
            {`{
  "name": "Marketing Team Workflow Access",
  "description": "Allows marketing team to run workflows during business hours",
  "effect": "allow",
  "principal": ["group:marketing"],
  "action": ["workflow:read", "workflow:execute"],
  "resource": "workflow:marketing/*",
  "condition": {
    "time": {
      "weekday": ["monday", "tuesday", "wednesday", "thursday", "friday"],
      "after": "09:00",
      "before": "17:00"
    }
  }
}`}
          </div>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">IP Restrictions and Network Controls</h2>
        
        <p className="mb-6">
          For enhanced security, GenerativSchool Enterprise allows you to restrict access based on IP 
          addresses and network conditions.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-4">IP Allowlisting</h3>
            <p className="mb-4">
              Restrict access to your GenerativSchool workspace to specific IP addresses or ranges.
            </p>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-1">Setting up IP Allowlists</h4>
                <ol className="list-decimal pl-5 space-y-1 text-sm">
                  <li>Navigate to Security Settings</li>
                  <li>Select "IP Restrictions"</li>
                  <li>Add allowed IP addresses or CIDR ranges</li>
                  <li>Save your configuration</li>
                </ol>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <h4 className="font-medium mb-1">Example Configurations</h4>
                <ul className="list-disc pl-5 space-y-1 text-sm">
                  <li>Single IP: 192.168.1.10</li>
                  <li>IP Range: 10.0.0.0/24</li>
                  <li>Multiple Ranges: 10.0.0.0/24, 172.16.0.0/16</li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-4">VPN Integration</h3>
            <p className="mb-4">
              Require users to connect through your corporate VPN before accessing GenerativSchool.
            </p>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-1">VPN Configuration Steps</h4>
                <ol className="list-decimal pl-5 space-y-1 text-sm">
                  <li>Configure your corporate VPN settings</li>
                  <li>Set up IP restrictions to only allow VPN IP ranges</li>
                  <li>Optionally enable SSO integration with your VPN</li>
                  <li>Test access through VPN connections</li>
                </ol>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <h4 className="font-medium mb-1">Supported VPN Services</h4>
                <ul className="list-disc pl-5 space-y-1 text-sm">
                  <li>Cisco AnyConnect</li>
                  <li>OpenVPN</li>
                  <li>FortiClient</li>
                  <li>Palo Alto GlobalProtect</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-6">Single Sign-On (SSO) and Identity Federation</h2>
        
        <p className="mb-6">
          GenerativSchool Enterprise supports integration with identity providers through SAML and OpenID Connect, 
          allowing you to use your existing identity management system.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center mb-4">
              <KeyRound className="h-6 w-6 text-indigo-600 mr-3" />
              <h3 className="text-xl font-semibold">SAML Integration</h3>
            </div>
            <p className="mb-4">
              Connect GenerativSchool with your SAML identity provider for enterprise-grade authentication.
            </p>
            <h4 className="font-medium mb-2">Supported Providers</h4>
            <ul className="list-disc pl-6 space-y-1 mb-4">
              <li>Okta</li>
              <li>Azure AD</li>
              <li>Google Workspace</li>
              <li>OneLogin</li>
              <li>PingIdentity</li>
              <li>Custom SAML Providers</li>
            </ul>
            <a href="#" className="text-indigo-600 hover:text-indigo-800 font-medium">
              View SAML configuration guide →
            </a>
          </div>
          
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center mb-4">
              <KeyRound className="h-6 w-6 text-indigo-600 mr-3" />
              <h3 className="text-xl font-semibold">OpenID Connect</h3>
            </div>
            <p className="mb-4">
              Use OpenID Connect for modern authentication flows with your identity provider.
            </p>
            <h4 className="font-medium mb-2">Supported Providers</h4>
            <ul className="list-disc pl-6 space-y-1 mb-4">
              <li>Auth0</li>
              <li>Okta</li>
              <li>Google Identity Platform</li>
              <li>Azure AD</li>
              <li>Keycloak</li>
              <li>Custom OIDC Providers</li>
            </ul>
            <a href="#" className="text-indigo-600 hover:text-indigo-800 font-medium">
              View OIDC configuration guide →
            </a>
          </div>
        </div>
        
        <div className="bg-blue-50 border border-blue-100 rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-4">User Provisioning and SCIM</h3>
          <p className="mb-4">
            Automatically provision and deprovision users in GenerativSchool based on your identity provider. 
            This ensures that user access is aligned with your organization's employee lifecycle.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-2">SCIM Features</h4>
              <ul className="list-disc pl-6 space-y-1">
                <li>User provisioning and deprovisioning</li>
                <li>Group synchronization</li>
                <li>Attribute mapping</li>
                <li>Role assignment</li>
                <li>Just-in-time provisioning</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">Supported SCIM Providers</h4>
              <ul className="list-disc pl-6 space-y-1">
                <li>Azure AD</li>
                <li>Okta</li>
                <li>Google Workspace</li>
                <li>OneLogin</li>
                <li>Any SCIM 2.0 compatible IdP</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </DocLayout>
  );
};

export default AccessControl;

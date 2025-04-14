
import React from 'react';
import DocLayout from '@/components/DocLayout';
import { Shield, Lock, Users, AlertTriangle, FileWarning, ExternalLink, Server, Layers } from 'lucide-react';

const Security = () => {
  const sidebarLinks = [
    { title: 'Best Practices Overview', url: '/documentation/best-practices' },
    { title: 'Performance Optimization', url: '/documentation/best-practices/performance' },
    { title: 'Security Guidelines', url: '/documentation/best-practices/security', active: true },
    { title: 'Scalability Planning', url: '/documentation/best-practices/scalability' },
    { title: 'Data Management', url: '/documentation/best-practices/data-management' },
  ];

  return (
    <DocLayout
      title="Security Guidelines"
      description="Best practices for maintaining security in your workflows"
      sidebarLinks={sidebarLinks}
      breadcrumbs={[
        { title: 'Best Practices', url: '/documentation/best-practices' },
        { title: 'Security Guidelines', url: '/documentation/best-practices/security' }
      ]}
      previousLink={{ title: 'Performance Optimization', url: '/documentation/best-practices/performance' }}
      nextLink={{ title: 'Scalability Planning', url: '/documentation/best-practices/scalability' }}
    >
      <section className="mb-12">
        <p className="text-lg mb-6">
          Implement robust security measures to protect your automations and data. 
          Security is a critical aspect of any automation workflow, especially when handling 
          sensitive business data or personally identifiable information.
        </p>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-8">
          <div className="flex items-start">
            <AlertTriangle className="h-6 w-6 text-yellow-600 mr-4 mt-1 flex-shrink-0" />
            <div>
              <h3 className="text-lg font-semibold mb-2">Security Is Everyone's Responsibility</h3>
              <p>
                Maintaining security is a continuous process, not a one-time setup. Regularly review
                your security practices and stay informed about emerging threats and best practices.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Key Security Principles</h2>
        
        <div className="space-y-10">
          <div className="flex gap-5">
            <div className="flex-shrink-0 mt-1">
              <div className="bg-indigo-100 p-3 rounded-full">
                <Lock className="h-6 w-6 text-indigo-700" />
              </div>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-3">Authentication & Authorization</h3>
              <p className="mb-4">
                Control who can access your workflows and what actions they can perform:
              </p>
              <ul className="list-disc pl-6 space-y-2 mb-5">
                <li>Use strong authentication mechanisms for all workflow access points</li>
                <li>Implement role-based access control (RBAC) to limit permissions</li>
                <li>Enforce the principle of least privilege—grant only the minimum access needed</li>
                <li>Regularly audit and review access permissions</li>
                <li>Implement session timeouts and automatic logouts</li>
              </ul>
              
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h4 className="font-medium mb-3">Authentication Best Practices</h4>
                <div className="overflow-x-auto">
                  <table className="min-w-full border border-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Practice</th>
                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Description</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                      <tr>
                        <td className="px-4 py-3 text-sm font-medium">Multi-factor Authentication</td>
                        <td className="px-4 py-3 text-sm">Require two or more verification methods</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 text-sm font-medium">Single Sign-On (SSO)</td>
                        <td className="px-4 py-3 text-sm">Use centralized authentication services</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 text-sm font-medium">API Tokens</td>
                        <td className="px-4 py-3 text-sm">Use short-lived tokens with limited scopes</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-5">
            <div className="flex-shrink-0 mt-1">
              <div className="bg-indigo-100 p-3 rounded-full">
                <Shield className="h-6 w-6 text-indigo-700" />
              </div>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-3">Data Security</h3>
              <p className="mb-4">
                Protect data both in transit and at rest:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Use encryption for all data transmissions (TLS/SSL)</li>
                <li>Implement proper key management practices</li>
                <li>Encrypt sensitive data before storing it</li>
                <li>Implement data masking for sensitive information in logs and displays</li>
                <li>Apply data retention policies—don't keep data longer than necessary</li>
                <li>Securely delete data when it's no longer needed</li>
              </ul>
            </div>
          </div>

          <div className="flex gap-5">
            <div className="flex-shrink-0 mt-1">
              <div className="bg-indigo-100 p-3 rounded-full">
                <ExternalLink className="h-6 w-6 text-indigo-700" />
              </div>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-3">API Security</h3>
              <p className="mb-4">
                Secure all API connections in your workflows:
              </p>
              <ul className="list-disc pl-6 space-y-3">
                <li>Use API authentication for all endpoints</li>
                <li>Implement rate limiting to prevent abuse</li>
                <li>Validate all input data</li>
                <li>Use API gateways to add security layers</li>
                <li>Monitor API usage for suspicious activities</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Workflow-Specific Security Controls</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center mb-4">
              <FileWarning className="h-6 w-6 text-indigo-600 mr-3" />
              <h3 className="text-lg font-semibold">Input Validation</h3>
            </div>
            <p className="mb-4">
              Never trust input data that comes from external sources. Validate all inputs:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Validate data types, formats, and ranges</li>
              <li>Check file types and sizes before processing</li>
              <li>Sanitize inputs to prevent injection attacks</li>
              <li>Implement allowlists rather than blocklists</li>
            </ul>
          </div>
          
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center mb-4">
              <Server className="h-6 w-6 text-indigo-600 mr-3" />
              <h3 className="text-lg font-semibold">Credential Management</h3>
            </div>
            <p className="mb-4">
              Securely manage the credentials used by your workflows:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Use a secure vault for credential storage</li>
              <li>Rotate credentials regularly</li>
              <li>Use service accounts with limited permissions</li>
              <li>Avoid hardcoding credentials in workflows</li>
            </ul>
          </div>
        </div>
        
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-8">
          <h3 className="text-xl font-semibold mb-4">Security Audit for Workflows</h3>
          <p className="mb-4">
            Regularly audit your workflows for security vulnerabilities:
          </p>
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Audit Item</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">What to Check</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Frequency</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                <tr>
                  <td className="px-4 py-3 text-sm font-medium">Access Control</td>
                  <td className="px-4 py-3 text-sm">User permissions, role assignments</td>
                  <td className="px-4 py-3 text-sm">Monthly</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 text-sm font-medium">Credentials</td>
                  <td className="px-4 py-3 text-sm">Exposed secrets, rotation schedule</td>
                  <td className="px-4 py-3 text-sm">Quarterly</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 text-sm font-medium">Data Handling</td>
                  <td className="px-4 py-3 text-sm">Encryption, masking, retention</td>
                  <td className="px-4 py-3 text-sm">Quarterly</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 text-sm font-medium">Error Handling</td>
                  <td className="px-4 py-3 text-sm">Error messages, data leakage</td>
                  <td className="px-4 py-3 text-sm">Bi-annually</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Monitoring and Incident Response</h2>
        
        <p className="mb-6">
          Implement monitoring to detect and respond to security incidents:
        </p>
        
        <div className="space-y-6">
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-4">Security Monitoring</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Log all security-relevant events (access attempts, configuration changes, etc.)</li>
              <li>Set up alerts for suspicious activities</li>
              <li>Implement automated responses for common attack patterns</li>
              <li>Regularly review security logs</li>
            </ul>
          </div>
          
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-4">Incident Response Plan</h3>
            <p className="mb-4">
              Develop a plan for responding to security incidents:
            </p>
            <ol className="list-decimal pl-6 space-y-2">
              <li><strong>Preparation</strong>: Document procedures, roles, and responsibilities</li>
              <li><strong>Identification</strong>: Detect and assess potential incidents</li>
              <li><strong>Containment</strong>: Limit the impact of the incident</li>
              <li><strong>Eradication</strong>: Remove the cause of the incident</li>
              <li><strong>Recovery</strong>: Restore systems to normal operation</li>
              <li><strong>Lessons Learned</strong>: Review and improve security measures</li>
            </ol>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-6">Security Compliance</h2>
        
        <p className="mb-4">
          Ensure your automation workflows comply with relevant security standards and regulations:
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h3 className="font-semibold mb-2">Data Protection</h3>
            <ul className="list-disc pl-5 space-y-1 text-sm">
              <li>GDPR (EU)</li>
              <li>CCPA (California)</li>
              <li>LGPD (Brazil)</li>
              <li>PIPEDA (Canada)</li>
            </ul>
          </div>
          
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h3 className="font-semibold mb-2">Industry-Specific</h3>
            <ul className="list-disc pl-5 space-y-1 text-sm">
              <li>HIPAA (Healthcare)</li>
              <li>PCI DSS (Payment)</li>
              <li>SOX (Financial)</li>
              <li>FERPA (Education)</li>
            </ul>
          </div>
          
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h3 className="font-semibold mb-2">Security Standards</h3>
            <ul className="list-disc pl-5 space-y-1 text-sm">
              <li>ISO 27001</li>
              <li>NIST Cybersecurity</li>
              <li>SOC 2</li>
              <li>CIS Controls</li>
            </ul>
          </div>
        </div>
        
        <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Security Checklist for New Workflows</h3>
          
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-5 h-5 rounded border border-indigo-500 flex-shrink-0 mt-1"></div>
              <div>
                <p className="font-medium">Conduct a security risk assessment</p>
                <p className="text-sm text-gray-600">Identify potential threats and vulnerabilities</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="w-5 h-5 rounded border border-indigo-500 flex-shrink-0 mt-1"></div>
              <div>
                <p className="font-medium">Implement appropriate access controls</p>
                <p className="text-sm text-gray-600">Apply role-based permissions and least privilege</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="w-5 h-5 rounded border border-indigo-500 flex-shrink-0 mt-1"></div>
              <div>
                <p className="font-medium">Secure all data used in the workflow</p>
                <p className="text-sm text-gray-600">Encryption for sensitive data at rest and in transit</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="w-5 h-5 rounded border border-indigo-500 flex-shrink-0 mt-1"></div>
              <div>
                <p className="font-medium">Implement input validation</p>
                <p className="text-sm text-gray-600">Validate all input data for format, type, and range</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="w-5 h-5 rounded border border-indigo-500 flex-shrink-0 mt-1"></div>
              <div>
                <p className="font-medium">Set up monitoring and logging</p>
                <p className="text-sm text-gray-600">Monitor workflow for security events and suspicious activities</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="w-5 h-5 rounded border border-indigo-500 flex-shrink-0 mt-1"></div>
              <div>
                <p className="font-medium">Create documented incident response procedures</p>
                <p className="text-sm text-gray-600">Define steps to take if a security breach occurs</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </DocLayout>
  );
};

export default Security;

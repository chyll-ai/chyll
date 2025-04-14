
import React from 'react';
import { AlertCircle } from 'lucide-react';

const ComplianceAndRetention = () => {
  return (
    <section className="mb-12">
      <h2 className="text-2xl font-bold mb-6">Compliance and Retention</h2>
      
      <div className="bg-white border border-gray-200 rounded-lg p-6 mb-8">
        <h3 className="text-xl font-semibold mb-4">Retention Policies</h3>
        <p className="mb-4">
          GenerativSchool offers flexible retention policies to meet your compliance requirements.
        </p>
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Plan</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Default Retention</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Maximum Retention</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Custom Policies</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              <tr>
                <td className="px-4 py-3 text-sm font-medium">Standard</td>
                <td className="px-4 py-3 text-sm">30 days</td>
                <td className="px-4 py-3 text-sm">90 days</td>
                <td className="px-4 py-3 text-sm">Limited</td>
              </tr>
              <tr>
                <td className="px-4 py-3 text-sm font-medium">Professional</td>
                <td className="px-4 py-3 text-sm">90 days</td>
                <td className="px-4 py-3 text-sm">1 year</td>
                <td className="px-4 py-3 text-sm">Yes</td>
              </tr>
              <tr>
                <td className="px-4 py-3 text-sm font-medium">Enterprise</td>
                <td className="px-4 py-3 text-sm">1 year</td>
                <td className="px-4 py-3 text-sm">7 years</td>
                <td className="px-4 py-3 text-sm">Advanced</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-8">
        <div className="flex items-start">
          <AlertCircle className="h-6 w-6 text-yellow-600 mr-4 mt-1 flex-shrink-0" />
          <div>
            <h3 className="text-lg font-semibold mb-2">Compliance Requirements</h3>
            <p className="mb-4">
              Different industries and regions have specific compliance requirements for audit logging:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium mb-1">Financial Services</h4>
                <ul className="list-disc pl-5 space-y-1 text-sm">
                  <li>SOX: 7-year retention</li>
                  <li>PCI DSS: 1-year retention with 3 months readily available</li>
                  <li>FINRA: 6-year retention</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-1">Healthcare</h4>
                <ul className="list-disc pl-5 space-y-1 text-sm">
                  <li>HIPAA: 6-year retention</li>
                  <li>FDA CFR Part 11: Retention for the life of the product</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-1">Public Sector</h4>
                <ul className="list-disc pl-5 space-y-1 text-sm">
                  <li>FedRAMP: 90-day minimum</li>
                  <li>CJIS: Minimum 1-year retention</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-1">General</h4>
                <ul className="list-disc pl-5 space-y-1 text-sm">
                  <li>ISO 27001: Based on risk assessment</li>
                  <li>SOC 2: Based on risk assessment, typically 1 year</li>
                </ul>
              </div>
            </div>
            <p className="mt-4 text-sm">
              Consult your compliance team to determine the appropriate retention period for your organization.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ComplianceAndRetention;

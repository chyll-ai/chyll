
import React from 'react';
import { BarChart, AlertCircle } from 'lucide-react';
import { useTranslation } from '@/contexts/TranslationContext';

const AuditLogsAnalytics = () => {
  const { t } = useTranslation();
  
  return (
    <section>
      <h2 className="text-2xl font-bold mb-6">{t('audit_log_analytics')}</h2>
      
      <p className="mb-6">
        {t('analytics_description')}
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center mb-4">
            <BarChart className="h-6 w-6 text-indigo-600 mr-3" />
            <h3 className="text-xl font-semibold">{t('usage_patterns')}</h3>
          </div>
          <p className="mb-4">
            {t('usage_patterns_description')}
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Most active users and resources</li>
            <li>Usage trends over time</li>
            <li>Feature adoption metrics</li>
            <li>Workflow execution patterns</li>
            <li>Resource access frequency</li>
          </ul>
        </div>
        
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center mb-4">
            <AlertCircle className="h-6 w-6 text-indigo-600 mr-3" />
            <h3 className="text-xl font-semibold">{t('security_analytics')}</h3>
          </div>
          <p className="mb-4">
            {t('security_analytics_description')}
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Anomaly detection in user behavior</li>
            <li>Unusual access patterns</li>
            <li>Credential usage analysis</li>
            <li>Privilege escalation tracking</li>
            <li>Cross-correlation with threat intelligence</li>
          </ul>
        </div>
      </div>
      
      <div className="bg-blue-50 border border-blue-100 rounded-lg p-6">
        <h3 className="text-xl font-semibold mb-4">{t('custom_reporting')}</h3>
        <p className="mb-4">
          {t('custom_reporting_description')}
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium mb-2">{t('report_types')}</h4>
            <ul className="list-disc pl-6 space-y-1">
              <li>User activity summaries</li>
              <li>Resource access reports</li>
              <li>Compliance documentation</li>
              <li>Security incident analysis</li>
              <li>Workflow execution metrics</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-2">{t('scheduling_options')}</h4>
            <ul className="list-disc pl-6 space-y-1">
              <li>One-time reports</li>
              <li>Daily/weekly/monthly schedules</li>
              <li>Event-triggered reports</li>
              <li>Custom delivery to stakeholders</li>
              <li>Export in multiple formats</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AuditLogsAnalytics;

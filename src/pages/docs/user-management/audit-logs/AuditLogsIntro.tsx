
import React from 'react';
import { ClipboardList } from 'lucide-react';
import { useTranslation } from '@/contexts/TranslationContext';

const AuditLogsIntro = () => {
  const { t } = useTranslation();
  
  return (
    <section className="mb-12">
      <p className="text-lg mb-6">
        {t('audit_logs_intro')}
      </p>
      
      <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-6 mb-8">
        <div className="flex items-start">
          <ClipboardList className="h-6 w-6 text-indigo-600 mr-4 mt-1 flex-shrink-0" />
          <div>
            <h3 className="text-lg font-semibold mb-2">{t('comprehensive_activity_tracking')}</h3>
            <p>
              {t('activity_tracking_description')}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AuditLogsIntro;

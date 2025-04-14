
import React from 'react';

interface ContactInfoProps {
  icon: React.ReactNode;
  title: string;
  details: React.ReactNode;
}

export const ContactInfoItem = ({ icon, title, details }: ContactInfoProps) => (
  <div className="flex space-x-4 items-start">
    <div className="bg-indigo-100 p-3 rounded-full">
      {icon}
    </div>
    <div>
      <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
      <div className="text-gray-600 mt-1">{details}</div>
    </div>
  </div>
);

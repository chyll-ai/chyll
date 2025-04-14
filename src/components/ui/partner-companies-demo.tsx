
import React from "react";
import { Building, Building2, Globe, Briefcase, Factory } from "lucide-react";

type CompanyLogo = {
  name: string;
  icon: React.ReactNode;
  className?: string;
};

const companies: CompanyLogo[] = [
  {
    name: "TechCorp",
    icon: <Building className="h-8 w-8 md:h-10 md:w-10" />,
    className: "bg-blue-50",
  },
  {
    name: "GlobalSoft",
    icon: <Globe className="h-8 w-8 md:h-10 md:w-10" />,
    className: "bg-purple-50",
  },
  {
    name: "Enterprise Solutions",
    icon: <Briefcase className="h-8 w-8 md:h-10 md:w-10" />,
    className: "bg-yellow-50",
  },
  {
    name: "IndusTech",
    icon: <Factory className="h-8 w-8 md:h-10 md:w-10" />,
    className: "bg-green-50",
  },
  {
    name: "FutureSystems",
    icon: <Building2 className="h-8 w-8 md:h-10 md:w-10" />,
    className: "bg-red-50",
  },
];

export function PartnerCompaniesDemo() {
  return (
    <div className="py-12">
      <div className="text-center mb-8">
        <h3 className="text-xl md:text-2xl font-semibold text-gray-800">
          Trusted by innovative companies
        </h3>
      </div>
      
      <div className="flex flex-wrap justify-center items-center gap-6 md:gap-12">
        {companies.map((company) => (
          <div
            key={company.name}
            className="flex flex-col items-center"
          >
            <div className={`p-4 rounded-full ${company.className} mb-2`}>
              {company.icon}
            </div>
            <span className="text-sm font-medium text-gray-700">{company.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

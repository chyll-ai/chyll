
import React from "react";
import { Building, Building2, Globe, Briefcase, Factory } from "lucide-react";
import { InfiniteSlider } from "@/components/ui/infinite-slider";

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
      
      <InfiniteSlider 
        gap={40} 
        duration={30} 
        durationOnHover={80} 
        className="w-full py-4"
      >
        {companies.map((company) => (
          <div
            key={company.name}
            className="flex flex-col items-center mx-4 min-w-[120px]"
          >
            <div className={`p-4 rounded-full ${company.className} mb-2`}>
              {company.icon}
            </div>
            <span className="text-sm font-medium text-gray-700">{company.name}</span>
          </div>
        ))}
        
        {/* PARIS&CO logo */}
        <div className="flex flex-col items-center mx-4 min-w-[180px]">
          <img
            src="/lovable-uploads/4640bcf9-d7bd-47f0-af20-a0bcf0927858.png"
            alt="PARIS&CO logo"
            className="h-16 w-auto"
          />
          <span className="text-sm font-medium text-gray-700 mt-2">PARIS&CO</span>
        </div>
      </InfiniteSlider>
    </div>
  );
}


import React from "react";
import { InfiniteSlider } from "@/components/ui/infinite-slider";

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
        {/* Paris&Co logo */}
        <div className="flex flex-col items-center mx-4 min-w-[160px]">
          <img 
            src="/lovable-uploads/cd379101-a03b-4431-b940-9afd5da7111b.png" 
            alt="Paris&Co logo" 
            className="h-12 w-auto mb-2" 
          />
          <span className="text-sm font-medium text-gray-700">Paris&Co</span>
        </div>

        {/* Blue Factory logo */}
        <div className="flex flex-col items-center mx-4 min-w-[160px]">
          <img 
            src="/lovable-uploads/3efc216a-03c5-43f5-aa2c-1a26eb7cc4af.png" 
            alt="Blue Factory logo" 
            className="h-12 w-auto mb-2" 
          />
          <span className="text-sm font-medium text-gray-700">Blue Factory</span>
        </div>

        {/* Daftar logo */}
        <div className="flex flex-col items-center mx-4 min-w-[160px]">
          <img 
            src="/lovable-uploads/ab44546c-7195-48e4-a71d-050ccdd0d82f.png" 
            alt="Daftar logo" 
            className="h-12 w-auto mb-2" 
          />
          <span className="text-sm font-medium text-gray-700">Daftar</span>
        </div>

        {/* Bpifrance logo */}
        <div className="flex flex-col items-center mx-4 min-w-[160px]">
          <img 
            src="/lovable-uploads/9c5562c8-93bf-431d-af7b-6aed23681bed.png" 
            alt="Bpifrance logo" 
            className="h-12 w-auto mb-2" 
          />
          <span className="text-sm font-medium text-gray-700">Bpifrance</span>
        </div>

        {/* Region Île-de-France logo */}
        <div className="flex flex-col items-center mx-4 min-w-[160px]">
          <img 
            src="/lovable-uploads/ca0dd06b-adba-4cf3-9194-84a7245c3c90.png" 
            alt="Region Île-de-France logo" 
            className="h-12 w-auto mb-2" 
          />
          <span className="text-sm font-medium text-gray-700">Région Île-de-France</span>
        </div>
      </InfiniteSlider>
    </div>
  );
}

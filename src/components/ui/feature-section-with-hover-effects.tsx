
import { cn } from "@/lib/utils";
import React from "react";
import { FeatureItem } from "@/components/ui/feature-section/feature-item";
import { useFeatureItems } from "@/components/ui/feature-section/feature-data";

export const FeaturesSectionWithHoverEffects = () => {
  const featureItems = useFeatureItems();
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 border border-neutral-200 dark:border-neutral-800 overflow-hidden">
      {featureItems.map((feature, index) => (
        <FeatureItem
          key={feature.title}
          title={feature.title}
          description={feature.description}
          icon={feature.icon}
          index={index}
        />
      ))}
    </div>
  );
};


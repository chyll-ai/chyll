
import { FeatureItem } from "./feature-section/feature-item";
import { featureItems } from "./feature-section/feature-data";

export function FeaturesSectionWithHoverEffects() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 relative z-10 py-10 max-w-7xl mx-auto">
      {featureItems.map((feature, index) => (
        <FeatureItem key={feature.title} {...feature} index={index} />
      ))}
    </div>
  );
}

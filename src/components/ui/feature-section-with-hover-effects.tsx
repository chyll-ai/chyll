
import { cn } from "@/lib/utils";
import { 
  Zap,
  Clock,
  Headphones,
  ShieldCheck,
  Users,
  TrendingUp,
  Bot,
  ArrowUpRight
} from "lucide-react";

export function FeaturesSectionWithHoverEffects() {
  const features = [
    {
      title: "24/7 Availability",
      description:
        "Your AI employee never sleeps, ensuring round-the-clock service for your customers across all time zones.",
      icon: <Clock className="w-6 h-6" />,
    },
    {
      title: "Cost Efficiency",
      description:
        "Reduce operational costs while increasing productivity. No benefits, breaks, or overtime pay required.",
      icon: <TrendingUp className="w-6 h-6" />,
    },
    {
      title: "Instant Customer Support",
      description:
        "Provide immediate responses to customer inquiries, improving satisfaction and retention rates.",
      icon: <Headphones className="w-6 h-6" />,
    },
    {
      title: "Scalable Solutions",
      description: "Easily scale your AI workforce up or down based on demand, without hiring or training delays.",
      icon: <ArrowUpRight className="w-6 h-6" />,
    },
    {
      title: "Human-like Interactions",
      description: "Our AI employees communicate naturally, making your customers feel valued and understood.",
      icon: <Users className="w-6 h-6" />,
    },
    {
      title: "Data Security",
      description:
        "Enterprise-grade security protocols ensure all customer data and interactions remain protected.",
      icon: <ShieldCheck className="w-6 h-6" />,
    },
    {
      title: "Consistent Performance",
      description:
        "Eliminate human error and mood swings. Your AI employee delivers consistent quality every time.",
      icon: <Bot className="w-6 h-6" />,
    },
    {
      title: "Unlimited Potential",
      description: "As AI technology evolves, your botis employee continuously improves, learning new skills automatically.",
      icon: <Zap className="w-6 h-6" />,
    },
  ];
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 relative z-10 py-10 max-w-7xl mx-auto">
      {features.map((feature, index) => (
        <Feature key={feature.title} {...feature} index={index} />
      ))}
    </div>
  );
}

const Feature = ({
  title,
  description,
  icon,
  index,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
  index: number;
}) => {
  return (
    <div
      className={cn(
        "flex flex-col lg:border-r py-10 relative group/feature dark:border-neutral-800",
        (index === 0 || index === 4) && "lg:border-l dark:border-neutral-800",
        index < 4 && "lg:border-b dark:border-neutral-800"
      )}
    >
      {index < 4 && (
        <div className="opacity-0 group-hover/feature:opacity-100 transition duration-200 absolute inset-0 h-full w-full bg-gradient-to-t from-neutral-100 dark:from-neutral-800 to-transparent pointer-events-none" />
      )}
      {index >= 4 && (
        <div className="opacity-0 group-hover/feature:opacity-100 transition duration-200 absolute inset-0 h-full w-full bg-gradient-to-b from-neutral-100 dark:from-neutral-800 to-transparent pointer-events-none" />
      )}
      <div className="mb-4 relative z-10 px-10 text-neutral-600 dark:text-neutral-400">
        {icon}
      </div>
      <div className="text-lg font-bold mb-2 relative z-10 px-10">
        <div className="absolute left-0 inset-y-0 h-6 group-hover/feature:h-8 w-1 rounded-tr-full rounded-br-full bg-neutral-300 dark:bg-neutral-700 group-hover/feature:bg-blue-500 transition-all duration-200 origin-center" />
        <span className="group-hover/feature:translate-x-2 transition duration-200 inline-block text-neutral-800 dark:text-neutral-100">
          {title}
        </span>
      </div>
      <p className="text-sm text-neutral-600 dark:text-neutral-300 max-w-xs relative z-10 px-10">
        {description}
      </p>
    </div>
  );
};

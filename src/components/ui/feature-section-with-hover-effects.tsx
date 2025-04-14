
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
      title: "Chrono - Time Management Specialist",
      description:
        "Meet Chrono, your 24/7 AI employee. While human employees sleep, Chrono ensures round-the-clock service across all time zones.",
      icon: <Clock className="w-6 h-6" />,
    },
    {
      title: "Kylo - Efficiency Expert",
      description:
        "Kylo reduces your operational costs while maximizing productivity. No benefits, breaks, or overtime required—just results.",
      icon: <TrendingUp className="w-6 h-6" />,
    },
    {
      title: "Rey - Customer Relations Specialist",
      description:
        "Rey provides immediate responses to customer inquiries with human-like empathy, improving satisfaction and retention rates.",
      icon: <Headphones className="w-6 h-6" />,
    },
    {
      title: "Lando - Growth Specialist",
      description: "Lando helps you scale your AI workforce instantly based on demand, without hiring delays or training periods.",
      icon: <ArrowUpRight className="w-6 h-6" />,
    },
    {
      title: "Obi - Communication Expert",
      description: "Obi communicates with natural language and emotional intelligence, making your customers feel valued and understood.",
      icon: <Users className="w-6 h-6" />,
    },
    {
      title: "Mace - Security Specialist",
      description:
        "Mace enforces enterprise-grade security protocols to ensure all customer data and interactions remain protected at all times.",
      icon: <ShieldCheck className="w-6 h-6" />,
    },
    {
      title: "Poe - Performance Specialist",
      description:
        "Poe delivers consistent quality every time, eliminating human error and mood-dependent performance variations.",
      icon: <Bot className="w-6 h-6" />,
    },
    {
      title: "Anakin - Evolution Specialist",
      description: "As AI technology evolves, Anakin continuously improves, learning new skills automatically without expensive retraining.",
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

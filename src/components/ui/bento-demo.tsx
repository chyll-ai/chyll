
import {
  Bell,
  Phone,
  Mic,
  Brain,
  Code
} from "lucide-react";

import { BentoCard, BentoGrid } from "@/components/ui/bento-grid";

const features = [
  {
    Icon: Brain,
    name: "AI-Powered Workflows",
    description: "Create and automate complex business processes with a few clicks using our advanced AI engine.",
    href: "/",
    cta: "Learn more",
    background: <div className="absolute -right-20 -top-20 bg-blue-100 rounded-full w-64 h-64 blur-3xl opacity-40" />,
    className: "lg:row-start-1 lg:row-end-4 lg:col-start-2 lg:col-end-3",
  },
  {
    Icon: Phone,
    name: "Voice Call Automation",
    description: "Let AI handle your customer calls, schedule appointments, and answer common questions 24/7.",
    href: "/",
    cta: "Learn more",
    background: <div className="absolute -right-20 -top-20 bg-green-100 rounded-full w-64 h-64 blur-3xl opacity-40" />,
    className: "lg:col-start-1 lg:col-end-2 lg:row-start-1 lg:row-end-3",
  },
  {
    Icon: Mic,
    name: "Voice Recognition",
    description: "Advanced speech-to-text technology that understands context and industry-specific terminology.",
    href: "/",
    cta: "Learn more",
    background: <div className="absolute -right-20 -top-20 bg-purple-100 rounded-full w-64 h-64 blur-3xl opacity-40" />,
    className: "lg:col-start-1 lg:col-end-2 lg:row-start-3 lg:row-end-4",
  },
  {
    Icon: Code,
    name: "Custom Integrations",
    description: "Connect with your existing tools and software through our open API and pre-built connectors.",
    href: "/",
    cta: "Learn more",
    background: <div className="absolute -right-20 -top-20 bg-yellow-100 rounded-full w-64 h-64 blur-3xl opacity-40" />,
    className: "lg:col-start-3 lg:col-end-3 lg:row-start-1 lg:row-end-2",
  },
  {
    Icon: Bell,
    name: "Smart Notifications",
    description:
      "Get real-time alerts and insights based on your business data, customer interactions, and market trends.",
    href: "/",
    cta: "Learn more",
    background: <div className="absolute -right-20 -top-20 bg-red-100 rounded-full w-64 h-64 blur-3xl opacity-40" />,
    className: "lg:col-start-3 lg:col-end-3 lg:row-start-2 lg:row-end-4",
  },
];

function BentoDemo() {
  return (
    <BentoGrid className="lg:grid-rows-3">
      {features.map((feature) => (
        <BentoCard key={feature.name} {...feature} />
      ))}
    </BentoGrid>
  );
}

export { BentoDemo };

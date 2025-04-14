
import {
  Phone,
  MessageSquare,
  Star,
  FileText,
  Workflow,
  LineChart
} from "lucide-react";

import { BentoCard, BentoGrid } from "@/components/ui/bento-grid";

const features = [
  {
    Icon: Phone,
    name: "Voice AI: Never Miss a Call",
    description: "Automate your phone calls with a virtual receptionist that answers calls 24/7, collects information, manages appointments, and qualifies leads through natural conversation.",
    href: "/",
    cta: "Hire AI Employee",
    background: <div className="absolute -right-20 -top-20 bg-blue-100 rounded-full w-64 h-64 blur-3xl opacity-40" />,
    className: "lg:row-start-1 lg:row-end-3 lg:col-start-1 lg:col-end-2",
  },
  {
    Icon: MessageSquare,
    name: "Conversation AI: Natural Live Chat",
    description: "Automate customer engagement across SMS, Live Chat, Facebook, Instagram with intelligent responses that learn from past interactions to book appointments and provide 24/7 support.",
    href: "/",
    cta: "Hire AI Employee",
    background: <div className="absolute -right-20 -top-20 bg-purple-100 rounded-full w-64 h-64 blur-3xl opacity-40" />,
    className: "lg:col-start-2 lg:col-end-3 lg:row-start-1 lg:row-end-3",
  },
  {
    Icon: Star,
    name: "Reviews AI: Reputation on Auto-Pilot",
    description: "Take control of your online reputation with automated review responses across Google and Facebook, helping improve SEO and collecting valuable customer insights.",
    href: "/",
    cta: "Hire AI Employee",
    background: <div className="absolute -right-20 -top-20 bg-yellow-100 rounded-full w-64 h-64 blur-3xl opacity-40" />,
    className: "lg:col-start-3 lg:col-end-3 lg:row-start-1 lg:row-end-2",
  },
  {
    Icon: FileText,
    name: "Content AI: Cure to Blank Pages",
    description: "Generate high-quality blog posts, social media content, email campaigns, and custom images that match your brand's voice without any design skills needed.",
    href: "/",
    cta: "Hire AI Employee",
    background: <div className="absolute -right-20 -top-20 bg-green-100 rounded-full w-64 h-64 blur-3xl opacity-40" />,
    className: "lg:col-start-1 lg:col-end-2 lg:row-start-3 lg:row-end-4",
  },
  {
    Icon: Workflow,
    name: "Workflow AI: Your Automation Weapon",
    description: "Master your business automation with guided workflow creation, from understanding structure to building lead nurture sequences and appointment scheduling systems.",
    href: "/",
    cta: "Hire AI Employee",
    background: <div className="absolute -right-20 -top-20 bg-indigo-100 rounded-full w-64 h-64 blur-3xl opacity-40" />,
    className: "lg:col-start-2 lg:col-end-3 lg:row-start-3 lg:row-end-4",
  },
  {
    Icon: LineChart,
    name: "Funnel AI: High-Converting Pages",
    description: "Build effective lead generation, membership, and sales funnels quickly by answering a few prompts about your business to create a conversion-optimized digital presence.",
    href: "/",
    cta: "Hire AI Employee",
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

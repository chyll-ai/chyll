
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
    name: "Obi-One: Voice AI Master",
    description: "Your AI receptionist that answers calls 24/7, collects information, manages appointments, and qualifies leads through natural conversation.",
    href: "/",
    cta: "Hire Obi-One",
    background: <div className="absolute -right-20 -top-20 bg-blue-100 rounded-full w-64 h-64 blur-3xl opacity-40" />,
    className: "lg:row-start-1 lg:row-end-3 lg:col-start-1 lg:col-end-2",
  },
  {
    Icon: MessageSquare,
    name: "Leia: Conversation Expert",
    description: "Your diplomatic AI that manages customer engagement across SMS, Live Chat, Facebook, and Instagram with intelligent responses that learn from past interactions.",
    href: "/",
    cta: "Hire Leia",
    background: <div className="absolute -right-20 -top-20 bg-purple-100 rounded-full w-64 h-64 blur-3xl opacity-40" />,
    className: "lg:col-start-2 lg:col-end-3 lg:row-start-1 lg:row-end-3",
  },
  {
    Icon: Star,
    name: "R2-View: Reputation Guardian",
    description: "Your dedicated AI that takes control of your online reputation with automated review responses across Google and Facebook, improving SEO and collecting insights.",
    href: "/",
    cta: "Hire R2-View",
    background: <div className="absolute -right-20 -top-20 bg-yellow-100 rounded-full w-64 h-64 blur-3xl opacity-40" />,
    className: "lg:col-start-3 lg:col-end-3 lg:row-start-1 lg:row-end-2",
  },
  {
    Icon: FileText,
    name: "Luke Writer: Content Creator",
    description: "Your creative AI that generates high-quality blog posts, social media content, email campaigns, and custom images that match your brand's voice.",
    href: "/",
    cta: "Hire Luke Writer",
    background: <div className="absolute -right-20 -top-20 bg-green-100 rounded-full w-64 h-64 blur-3xl opacity-40" />,
    className: "lg:col-start-1 lg:col-end-2 lg:row-start-3 lg:row-end-4",
  },
  {
    Icon: Workflow,
    name: "Yoda Flow: Workflow Sage",
    description: "Your wise AI guide for business automation, helping you master workflow creation from understanding structure to building lead nurture sequences.",
    href: "/",
    cta: "Hire Yoda Flow",
    background: <div className="absolute -right-20 -top-20 bg-indigo-100 rounded-full w-64 h-64 blur-3xl opacity-40" />,
    className: "lg:col-start-2 lg:col-end-3 lg:row-start-3 lg:row-end-4",
  },
  {
    Icon: LineChart,
    name: "Han Solo-Funnel: Conversion Master",
    description: "Your daring AI that builds effective lead generation, membership, and sales funnels quickly by turning simple prompts into a conversion-optimized digital presence.",
    href: "/",
    cta: "Hire Han Solo-Funnel",
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


import {
  Phone,
  MessageSquare,
  Users,
  Mail,
  FileText,
  LineChart
} from "lucide-react";

import { BentoCard, BentoGrid } from "@/components/ui/bento-grid";

const features = [
  {
    Icon: LineChart,
    name: "NAPOLEON — The AI SDR",
    description: "Relentless prospecting, fully automated. Napoleon hunts for leads, qualifies them, follows up, and fills your sales pipeline — like a tireless sales soldier.",
    href: "/",
    cta: "Deploy NAPOLEON",
    background: <div className="absolute -right-20 -top-20 bg-blue-100 rounded-full w-64 h-64 blur-3xl opacity-40" />,
    className: "lg:row-start-1 lg:row-end-3 lg:col-start-1 lg:col-end-2",
  },
  {
    Icon: Users,
    name: "TALIE — The Revolutionary Recruiter",
    description: "Find top talent, faster than ever. Talie scouts exceptional candidates, sends tailored messages, and shortlists them based on your criteria — recruitment on autopilot.",
    href: "/",
    cta: "Deploy Talie",
    background: <div className="absolute -right-20 -top-20 bg-purple-100 rounded-full w-64 h-64 blur-3xl opacity-40" />,
    className: "lg:col-start-2 lg:col-end-3 lg:row-start-1 lg:row-end-3",
  },
  {
    Icon: MessageSquare,
    name: "JULIENNE — The Community Whisperer",
    description: "24/7 engagement and moderation. Julienne manages your online communities, replies to comments, posts updates, and keeps the conversation flowing — with grace and consistency.",
    href: "/",
    cta: "Deploy Julienne",
    background: <div className="absolute -right-20 -top-20 bg-yellow-100 rounded-full w-64 h-64 blur-3xl opacity-40" />,
    className: "lg:col-start-3 lg:col-end-3 lg:row-start-1 lg:row-end-2",
  },
  {
    Icon: Phone,
    name: "BASTIEN — The Voice Agent",
    description: "Never miss a call again. Bastien answers phone calls like a virtual receptionist, gathers key info, schedules appointments, and qualifies callers in natural language.",
    href: "/",
    cta: "Deploy Bastien",
    background: <div className="absolute -right-20 -top-20 bg-green-100 rounded-full w-64 h-64 blur-3xl opacity-40" />,
    className: "lg:col-start-1 lg:col-end-2 lg:row-start-3 lg:row-end-4",
  },
  {
    Icon: Mail,
    name: "LAFAYETTE — The Email Strategist (AI Email Writer)",
    description: "Emails that convert — no copywriter needed. Lafayette crafts compelling outreach and follow-up emails, personalizes each message, and triggers them at the right time.",
    href: "/",
    cta: "Deploy Lafayette",
    background: <div className="absolute -right-20 -top-20 bg-indigo-100 rounded-full w-64 h-64 blur-3xl opacity-40" />,
    className: "lg:col-start-2 lg:col-end-3 lg:row-start-3 lg:row-end-4",
  },
  {
    Icon: FileText,
    name: "VOLTAIRE — The Content Architect",
    description: "Smart content, in your tone and style. Voltaire writes your blog posts, social media captions, email campaigns, and visuals — turning your ideas into beautifully crafted assets.",
    href: "/",
    cta: "Deploy Voltaire",
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

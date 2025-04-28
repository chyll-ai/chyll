
import {
  Phone,
  MessageSquare,
  Users,
  Mail,
  FileText,
  LineChart
} from "lucide-react";

import { BentoCard, BentoGrid } from "@/components/ui/bento-grid";
import { useLanguage } from '@/context/LanguageContext';

function BentoDemo() {
  const { language, t } = useLanguage();
  
  const defaultFeatures = [
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
  
  // Check if French translations are available for AI employees
  const hasFrenchEmployees = language === 'fr' && t.home && 'aiEmployees' in t.home;
  
  // Use French translations if available, otherwise use defaults
  const features = hasFrenchEmployees ? [
    {
      Icon: LineChart,
      name: t.home.aiEmployees?.napoleon?.name || defaultFeatures[0].name,
      description: t.home.aiEmployees?.napoleon?.description || defaultFeatures[0].description,
      href: "/",
      cta: t.home.aiEmployees?.napoleon?.cta || defaultFeatures[0].cta,
      background: <div className="absolute -right-20 -top-20 bg-blue-100 rounded-full w-64 h-64 blur-3xl opacity-40" />,
      className: "lg:row-start-1 lg:row-end-3 lg:col-start-1 lg:col-end-2",
    },
    {
      Icon: Users,
      name: t.home.aiEmployees?.talie?.name || defaultFeatures[1].name,
      description: t.home.aiEmployees?.talie?.description || defaultFeatures[1].description,
      href: "/",
      cta: t.home.aiEmployees?.talie?.cta || defaultFeatures[1].cta,
      background: <div className="absolute -right-20 -top-20 bg-purple-100 rounded-full w-64 h-64 blur-3xl opacity-40" />,
      className: "lg:col-start-2 lg:col-end-3 lg:row-start-1 lg:row-end-3",
    },
    {
      Icon: MessageSquare,
      name: t.home.aiEmployees?.julienne?.name || defaultFeatures[2].name,
      description: t.home.aiEmployees?.julienne?.description || defaultFeatures[2].description,
      href: "/",
      cta: t.home.aiEmployees?.julienne?.cta || defaultFeatures[2].cta,
      background: <div className="absolute -right-20 -top-20 bg-yellow-100 rounded-full w-64 h-64 blur-3xl opacity-40" />,
      className: "lg:col-start-3 lg:col-end-3 lg:row-start-1 lg:row-end-2",
    },
    {
      Icon: Phone,
      name: t.home.aiEmployees?.bastien?.name || defaultFeatures[3].name,
      description: t.home.aiEmployees?.bastien?.description || defaultFeatures[3].description,
      href: "/",
      cta: t.home.aiEmployees?.bastien?.cta || defaultFeatures[3].cta,
      background: <div className="absolute -right-20 -top-20 bg-green-100 rounded-full w-64 h-64 blur-3xl opacity-40" />,
      className: "lg:col-start-1 lg:col-end-2 lg:row-start-3 lg:row-end-4",
    },
    {
      Icon: Mail,
      name: t.home.aiEmployees?.lafayette?.name || defaultFeatures[4].name,
      description: t.home.aiEmployees?.lafayette?.description || defaultFeatures[4].description,
      href: "/",
      cta: t.home.aiEmployees?.lafayette?.cta || defaultFeatures[4].cta,
      background: <div className="absolute -right-20 -top-20 bg-indigo-100 rounded-full w-64 h-64 blur-3xl opacity-40" />,
      className: "lg:col-start-2 lg:col-end-3 lg:row-start-3 lg:row-end-4",
    },
    {
      Icon: FileText,
      name: t.home.aiEmployees?.voltaire?.name || defaultFeatures[5].name,
      description: t.home.aiEmployees?.voltaire?.description || defaultFeatures[5].description,
      href: "/",
      cta: t.home.aiEmployees?.voltaire?.cta || defaultFeatures[5].cta,
      background: <div className="absolute -right-20 -top-20 bg-red-100 rounded-full w-64 h-64 blur-3xl opacity-40" />,
      className: "lg:col-start-3 lg:col-end-3 lg:row-start-2 lg:row-end-4",
    },
  ] : defaultFeatures;

  return (
    <BentoGrid className="lg:grid-rows-3">
      {features.map((feature) => (
        <BentoCard key={feature.name} {...feature} />
      ))}
    </BentoGrid>
  );
}

export { BentoDemo };

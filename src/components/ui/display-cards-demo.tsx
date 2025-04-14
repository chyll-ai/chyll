
"use client";

import DisplayCards from "@/components/ui/display-cards";
import { Zap, Mic, TrendingUp, Rocket, Bot, MessageCircle } from "lucide-react";

const featuresCards = [
  {
    icon: <Zap className="size-4 text-yellow-300" />,
    title: "AI Automation",
    description: "Automate repetitive tasks",
    date: "Save 20+ hours/week",
    iconClassName: "text-yellow-500",
    titleClassName: "text-yellow-500",
    className:
      "[grid-area:stack] hover:-translate-y-10 before:absolute before:w-[100%] before:outline-1 before:rounded-xl before:outline-border before:h-[100%] before:content-[''] before:bg-blend-overlay before:bg-background/50 grayscale-[100%] hover:before:opacity-0 before:transition-opacity before:duration:700 hover:grayscale-0 before:left-0 before:top-0",
  },
  {
    icon: <Mic className="size-4 text-blue-300" />,
    title: "Voice Calls",
    description: "AI-powered voice assistant",
    date: "24/7 availability",
    iconClassName: "text-blue-500",
    titleClassName: "text-blue-500",
    className:
      "[grid-area:stack] translate-x-12 translate-y-10 hover:-translate-y-1 before:absolute before:w-[100%] before:outline-1 before:rounded-xl before:outline-border before:h-[100%] before:content-[''] before:bg-blend-overlay before:bg-background/50 grayscale-[100%] hover:before:opacity-0 before:transition-opacity before:duration:700 hover:grayscale-0 before:left-0 before:top-0",
  },
  {
    icon: <Rocket className="size-4 text-purple-300" />,
    title: "Workflow Builder",
    description: "Create custom workflows",
    date: "No coding required",
    iconClassName: "text-purple-500",
    titleClassName: "text-purple-500",
    className:
      "[grid-area:stack] translate-x-24 translate-y-20 hover:translate-y-10",
  },
  {
    icon: <TrendingUp className="size-4 text-green-300" />,
    title: "Competitive Edge",
    description: "Stay ahead of competitors",
    date: "Market advantage",
    iconClassName: "text-green-500",
    titleClassName: "text-green-500",
    className:
      "[grid-area:stack] translate-x-36 translate-y-30 hover:translate-y-20 before:absolute before:w-[100%] before:outline-1 before:rounded-xl before:outline-border before:h-[100%] before:content-[''] before:bg-blend-overlay before:bg-background/50 grayscale-[100%] hover:before:opacity-0 before:transition-opacity before:duration:700 hover:grayscale-0 before:left-0 before:top-0",
  },
  {
    icon: <Bot className="size-4 text-indigo-300" />,
    title: "Chatbot Integration",
    description: "Custom chatbot solutions",
    date: "Instant response",
    iconClassName: "text-indigo-500",
    titleClassName: "text-indigo-500",
    className:
      "[grid-area:stack] translate-x-48 translate-y-40 hover:translate-y-30 before:absolute before:w-[100%] before:outline-1 before:rounded-xl before:outline-border before:h-[100%] before:content-[''] before:bg-blend-overlay before:bg-background/50 grayscale-[100%] hover:before:opacity-0 before:transition-opacity before:duration:700 hover:grayscale-0 before:left-0 before:top-0",
  },
  {
    icon: <MessageCircle className="size-4 text-red-300" />,
    title: "Multi-Channel Support",
    description: "Support across platforms",
    date: "Seamless integration",
    iconClassName: "text-red-500",
    titleClassName: "text-red-500",
    className:
      "[grid-area:stack] translate-x-60 translate-y-50 hover:translate-y-40",
  },
];

function DisplayCardsDemo() {
  return (
    <div className="flex min-h-[500px] w-full items-center justify-center py-20">
      <div className="w-full max-w-3xl">
        <DisplayCards cards={featuresCards} />
      </div>
    </div>
  );
}

export { DisplayCardsDemo };

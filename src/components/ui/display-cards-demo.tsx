
"use client";

import DisplayCards from "@/components/ui/display-cards";
import { DollarSign, Zap, PlayCircle, Clock, Globe, ArrowUpRight } from "lucide-react";

const benefitsCards = [
  {
    icon: <DollarSign className="size-4 text-green-300" />,
    title: "Cost-Efficient",
    description: "Reduce operational costs",
    date: "Save now",
    iconClassName: "text-green-500",
    titleClassName: "text-green-500",
    className:
      "[grid-area:stack] hover:-translate-y-10 before:absolute before:w-[100%] before:outline-1 before:rounded-xl before:outline-border before:h-[100%] before:content-[''] before:bg-blend-overlay before:bg-background/50 grayscale-[100%] hover:before:opacity-0 before:transition-opacity before:duration:700 hover:grayscale-0 before:left-0 before:top-0",
  },
  {
    icon: <Zap className="size-4 text-yellow-300" />,
    title: "Boosted Productivity",
    description: "Accomplish more with less",
    date: "Immediate results",
    iconClassName: "text-yellow-500",
    titleClassName: "text-yellow-500",
    className:
      "[grid-area:stack] translate-x-12 translate-y-10 hover:-translate-y-1 before:absolute before:w-[100%] before:outline-1 before:rounded-xl before:outline-border before:h-[100%] before:content-[''] before:bg-blend-overlay before:bg-background/50 grayscale-[100%] hover:before:opacity-0 before:transition-opacity before:duration:700 hover:grayscale-0 before:left-0 before:top-0",
  },
  {
    icon: <PlayCircle className="size-4 text-blue-300" />,
    title: "Effortless Automation",
    description: "Set up in minutes",
    date: "Easy to start",
    iconClassName: "text-blue-500",
    titleClassName: "text-blue-500",
    className:
      "[grid-area:stack] translate-x-24 translate-y-20 hover:translate-y-10",
  },
  {
    icon: <Clock className="size-4 text-purple-300" />,
    title: "24/7 Support",
    description: "Always available",
    date: "Never sleeps",
    iconClassName: "text-purple-500",
    titleClassName: "text-purple-500",
    className:
      "[grid-area:stack] translate-x-36 translate-y-30 hover:translate-y-20 before:absolute before:w-[100%] before:outline-1 before:rounded-xl before:outline-border before:h-[100%] before:content-[''] before:bg-blend-overlay before:bg-background/50 grayscale-[100%] hover:before:opacity-0 before:transition-opacity before:duration:700 hover:grayscale-0 before:left-0 before:top-0",
  },
  {
    icon: <Globe className="size-4 text-indigo-300" />,
    title: "Multi-Channel Engagement",
    description: "Reach customers everywhere",
    date: "Omni-channel",
    iconClassName: "text-indigo-500",
    titleClassName: "text-indigo-500",
    className:
      "[grid-area:stack] translate-x-48 translate-y-40 hover:translate-y-30 before:absolute before:w-[100%] before:outline-1 before:rounded-xl before:outline-border before:h-[100%] before:content-[''] before:bg-blend-overlay before:bg-background/50 grayscale-[100%] hover:before:opacity-0 before:transition-opacity before:duration:700 hover:grayscale-0 before:left-0 before:top-0",
  },
  {
    icon: <ArrowUpRight className="size-4 text-red-300" />,
    title: "Infinitely Scalable",
    description: "Grow without limits",
    date: "Future-proof",
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
        <DisplayCards cards={benefitsCards} />
      </div>
    </div>
  );
}

export { DisplayCardsDemo };

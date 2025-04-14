
import React from 'react';
import DisplayCards from '@/components/ui/display-cards';
import { Bot, Zap, TrendingUp } from 'lucide-react';

const stepsCards = [
  {
    icon: <Zap className="size-4 text-indigo-300" />,
    title: "Choose Your AI Employee",
    description: "",
    date: "Step 1",
    iconClassName: "text-indigo-500",
    titleClassName: "text-indigo-500",
    className:
      "[grid-area:stack] hover:-translate-y-10 before:absolute before:w-[100%] before:outline-1 before:rounded-xl before:outline-border before:h-[100%] before:content-[''] before:bg-blend-overlay before:bg-background/50 grayscale-[100%] hover:before:opacity-0 before:transition-opacity before:duration:700 hover:grayscale-0 before:left-0 before:top-0",
  },
  {
    icon: <Bot className="size-4 text-blue-300" />,
    title: "Plug Into Your Workflow",
    description: "",
    date: "Step 2",
    iconClassName: "text-blue-500",
    titleClassName: "text-blue-500",
    className:
      "[grid-area:stack] translate-x-16 translate-y-10 hover:-translate-y-1 before:absolute before:w-[100%] before:outline-1 before:rounded-xl before:outline-border before:h-[100%] before:content-[''] before:bg-blend-overlay before:bg-background/50 grayscale-[100%] hover:before:opacity-0 before:transition-opacity before:duration:700 hover:grayscale-0 before:left-0 before:top-0",
  },
  {
    icon: <TrendingUp className="size-4 text-green-300" />,
    title: "Watch Productivity Skyrocket",
    description: "",
    date: "Step 3",
    iconClassName: "text-green-500",
    titleClassName: "text-green-500",
    className:
      "[grid-area:stack] translate-x-32 translate-y-20 hover:translate-y-10",
  },
];

const HowItWorks = () => {
  return (
    <div className="flex min-h-[400px] w-full items-center justify-center">
      <div className="w-full max-w-3xl">
        <DisplayCards cards={stepsCards} />
      </div>
    </div>
  );
};

export default HowItWorks;

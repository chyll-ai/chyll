
import { FaqAccordion } from "@/components/ui/faq-chat-accordion";

const defaultData = [
  {
    answer: "Botis is an AI-powered automation platform that helps businesses streamline workflows, handle customer communications, and scale operations. It combines advanced AI with intuitive tools to handle repetitive tasks, engage with customers, and provide data-driven insights.",
    icon: "🤖",
    iconPosition: "right" as const,
    id: 1,
    question: "What is botis and how can it help my business?",
  },
  {
    answer: "No technical skills required! Botis is designed to be user-friendly with a simple interface. Our onboarding team will help you set up your workflows and automations, and our documentation provides step-by-step guidance.",
    id: 2,
    question: "Do I need technical skills to use botis?",
  },
  {
    answer: "Most businesses can get up and running with botis in just a few days. The exact timeline depends on your specific needs, but our white-glove onboarding ensures a smooth and efficient implementation process.",
    id: 3,
    question: "How long does it take to implement botis?",
  },
  {
    answer: "Yes! Botis seamlessly integrates with most popular business tools including CRMs, marketing platforms, payment processors, and communication tools. Our team can assist with custom integrations if needed.",
    icon: "⚙️",
    iconPosition: "left" as const,
    id: 4,
    question: "Can botis integrate with my existing tools and systems?",
  },
  {
    answer: "We offer multiple levels of support depending on your plan. All customers receive email support, while our Professional and Expert plans include faster response times, priority support, and scheduled strategy calls.",
    id: 5,
    question: "What kind of support does botis provide?",
  },
  {
    answer: "Absolutely. We take data security very seriously. Botis employs enterprise-grade encryption, regular security audits, and follows best practices for data protection. Our Expert plan includes additional security features like SSO authentication.",
    icon: "🔒",
    iconPosition: "right" as const,
    id: 6,
    question: "Is my data secure with botis?",
  },
];

function DefaultDemo() {
  return (
    <FaqAccordion 
      data={defaultData}
      className="max-w-[700px]"
      timestamp="Last updated: April 2025"
    />
  );
}

function CustomStyleDemo() {
  return (
    <FaqAccordion 
      data={defaultData}
      className="max-w-[700px]"
      questionClassName="bg-secondary hover:bg-secondary/80"
      answerClassName="bg-secondary text-secondary-foreground"
      timestamp="Updated daily at 12:00 PM"
    />
  );
}

export { DefaultDemo, CustomStyleDemo };

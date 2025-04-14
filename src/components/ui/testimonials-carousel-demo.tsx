
import { TestimonialsCarousel } from "@/components/ui/testimonials-carousel";

const testimonials = [
  {
    author: {
      name: "Sarah Johnson",
      handle: "@sarahj_marketing",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face"
    },
    text: "Our Voice AI Employee handles customer calls with such precision, we've reduced our customer service team's workload by 70% while improving response quality.",
    href: "#"
  },
  {
    author: {
      name: "Michael Chen",
      handle: "@michaelc_tech",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"
    },
    text: "The Conversation AI Employee manages our entire customer support chat, handling complex inquiries with incredible accuracy and empathy.",
    href: "#"
  },
  {
    author: {
      name: "Sophia Rodriguez",
      handle: "@sophiar_founder",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face"
    },
    text: "As a solo entrepreneur, my Content AI Employee creates marketing materials, blog posts, and social media content that perfectly matches my brand voice.",
    href: "#"
  },
  {
    author: {
      name: "James Wilson",
      handle: "@jameswilson_ceo",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
    },
    text: "Our Reviews AI Employee has transformed our online reputation management, automatically responding to reviews and improving our ratings.",
    href: "#"
  },
  {
    author: {
      name: "Emily Parker",
      handle: "@emilyp_digital",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face"
    },
    text: "The Workflow AI Employee automates our entire project management process, reducing administrative overhead by 50%.",
    href: "#"
  },
  {
    author: {
      name: "Daniel Kim",
      handle: "@danielk_agency",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face"
    },
    text: "Our Funnel AI Employee continuously optimizes our sales funnels, resulting in a 40% increase in conversion rates with minimal manual intervention.",
    href: "#"
  }
];

export function TestimonialsCarouselDemo() {
  return (
    <TestimonialsCarousel
      title="Meet the AI Employees Transforming Businesses"
      description="Hear how businesses are scaling and innovating with specialized AI team members"
      testimonials={testimonials}
    />
  );
}

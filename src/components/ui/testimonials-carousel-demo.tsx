
import { TestimonialsCarousel } from "@/components/ui/testimonials-carousel";

const testimonials = [
  {
    author: {
      name: "Jennifer Wu",
      handle: "@jen_techfounder",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face"
    },
    text: "Our AI Employee handles all customer outreach and nurturing campaigns. It crafts personalized messages that have increased our engagement rates by 85%.",
    href: "#"
  },
  {
    author: {
      name: "David Park",
      handle: "@davidp_founder",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"
    },
    text: "The AI Employee we deployed for content creation generates blog posts, social media updates, and email newsletters that are indistinguishable from our human writers.",
    href: "#"
  },
  {
    author: {
      name: "Elena Rodriguez",
      handle: "@elena_ceo",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face"
    },
    text: "My AI Sales Employee qualified 500 leads in its first week and set up 35 meetings automatically. It's like having a superhuman SDR who never sleeps.",
    href: "#"
  },
  {
    author: {
      name: "James Wilson",
      handle: "@james_founder",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
    },
    text: "We deployed an AI Employee to handle our customer support tickets. Response times dropped from hours to seconds, and customer satisfaction rose by 40%.",
    href: "#"
  },
  {
    author: {
      name: "Lisa Chen",
      handle: "@lisa_startup",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face"
    },
    text: "As a solo founder, my AI Research Employee continually analyzes market trends and competitor activities, giving me insights I'd never have time to discover on my own.",
    href: "#"
  },
  {
    author: {
      name: "Marcus Johnson",
      handle: "@marcus_ceo",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face"
    },
    text: "Our AI Project Manager coordinates our entire remote team, tracks deadlines, and sends personalized updates. It's like having a chief of staff who works around the clock.",
    href: "#"
  }
];

export function TestimonialsCarouselDemo() {
  return (
    <TestimonialsCarousel
      title="How Founders Are Scaling With AI Employees"
      description="Hear directly from business owners who have transformed their operations with our AI workforce"
      testimonials={testimonials}
    />
  );
}

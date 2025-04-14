
import { TestimonialsSection } from "@/components/ui/testimonials-section"

const testimonials = [
  {
    author: {
      name: "Rebecca Taylor",
      handle: "@rebecca_founder",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face"
    },
    text: "Our AI Communications Employee writes all our marketing copy, social posts, and email campaigns. The quality is amazing, and it's saved me 25 hours every week.",
    href: "#"
  },
  {
    author: {
      name: "Jason Kim",
      handle: "@jason_startup",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"
    },
    text: "The AI Sales Employee handles our entire outbound process - from prospecting to follow-ups. We've tripled our pipeline with zero additional headcount.",
    href: "#"
  },
  {
    author: {
      name: "Maria Garcia",
      handle: "@maria_ceo",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face"
    },
    text: "My AI Customer Success Employee monitors customer health scores and proactively reaches out to at-risk accounts. Our retention rate has improved by 35%.",
    href: "#"
  },
  {
    author: {
      name: "Thomas Wright",
      handle: "@thomas_founder",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
    },
    text: "Our AI Development Employee reviews code, finds bugs, and suggests optimizations. It's like having a senior developer who never gets tired.",
    href: "#"
  },
  {
    author: {
      name: "Sophia Chen",
      handle: "@sophia_tech",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face"
    },
    text: "As a technical founder, I've deployed an AI Data Analyst that continuously monitors our metrics and sends me actionable insights. It's transformed our decision-making.",
    href: "#"
  },
  {
    author: {
      name: "Daniel Lee",
      handle: "@daniel_saas",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face"
    },
    text: "Our AI Operations Employee manages our entire scheduling system, handling changes, conflicts, and notifications automatically. It's eliminated admin work completely.",
    href: "#"
  }
]

export function TestimonialsSectionDemo() {
  return (
    <TestimonialsSection
      title="AI Employees Transforming Founder-Led Businesses"
      description="See how founders and CEOs are using AI team members to scale faster with fewer resources"
      testimonials={testimonials}
    />
  )
}

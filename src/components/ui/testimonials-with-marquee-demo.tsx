
import { TestimonialsSection } from "@/components/ui/testimonials-with-marquee"

const testimonials = [
  {
    author: {
      name: "Alex Chen",
      handle: "@alexfounder",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"
    },
    text: "Our AI Employee handles all our customer emails with perfect accuracy. It's like having a dedicated team member who works 24/7 without breaks.",
    href: "#"
  },
  {
    author: {
      name: "Sarah Miller",
      handle: "@sarahstartup",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face"
    },
    text: "As a solo founder, my AI Employee manages our entire sales pipeline. It follows up with leads, qualifies prospects, and even closes deals while I sleep.",
    href: "#"
  },
  {
    author: {
      name: "Michael Rodriguez",
      handle: "@mikeceo",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
    },
    text: "We've reduced our support team costs by 70% since implementing AI Employees. They handle routine inquiries with incredible accuracy and empathy."
  }
]

export function TestimonialsWithMarqueeDemo() {
  return (
    <TestimonialsSection
      title="Founders love our AI Employees"
      description="Join thousands of business owners who are scaling their operations with our tireless AI team members"
      testimonials={testimonials}
    />
  )
}

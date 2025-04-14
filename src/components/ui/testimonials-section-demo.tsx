
import { TestimonialsSection } from "@/components/ui/testimonials-section"

const testimonials = [
  {
    author: {
      name: "Sarah Johnson",
      handle: "@sarahj_marketing",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face"
    },
    text: "Since hiring Obi-One Voice AI, we've saved 20 hours a week in customer service and doubled our lead response rate. It's like having a Jedi answer every call!",
    href: "#"
  },
  {
    author: {
      name: "Michael Chen",
      handle: "@michaelc_tech",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"
    },
    text: "Leia Conversation AI has transformed our customer service. We're handling twice as many inquiries with half the staff. The diplomatic skills are truly royal level.",
    href: "#"
  },
  {
    author: {
      name: "Sophia Rodriguez",
      handle: "@sophiar_founder",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face"
    },
    text: "As a solo entrepreneur, R2-View has become my most valuable team member. It handles our online reputation 24/7 without missing a beat - beep boop perfection!"
  },
  {
    author: {
      name: "James Wilson",
      handle: "@jameswilson_ceo",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
    },
    text: "R2-View has completely transformed our online reputation. Our Google ratings have gone from 3.8 to 4.7 in just three months. This droid really delivers!",
    href: "#"
  },
  {
    author: {
      name: "Emily Parker",
      handle: "@emilyp_digital",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face"
    },
    text: "Luke Writer saves us hours every week. We've increased our content output by 300% while maintaining our brand voice perfectly. The force is strong with this one!",
    href: "#"
  },
  {
    author: {
      name: "Daniel Kim",
      handle: "@danielk_agency",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face"
    },
    text: "The ROI on Han Solo-Funnel has been incredible. We've seen a 35% increase in conversions since implementing it on our website. It made the conversion run in less than 12 parsecs!",
    href: "#"
  }
]

export function TestimonialsSectionDemo() {
  return (
    <TestimonialsSection
      title="See What Our Clients Are Saying"
      description="Businesses of all sizes are transforming their operations with botis AI employees"
      testimonials={testimonials}
    />
  )
}

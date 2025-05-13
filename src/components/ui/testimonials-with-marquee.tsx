
import { cn } from "@/lib/utils"
import { TestimonialCard, TestimonialAuthor } from "@/components/ui/testimonial-card"

interface TestimonialsSectionProps {
  title?: string;
  description?: string;
  testimonials: Array<{
    author: TestimonialAuthor
    text: string
    href?: string
  }>
  className?: string
}

export function TestimonialsSection({ 
  title,
  description,
  testimonials,
  className 
}: TestimonialsSectionProps) {
  return (
    <section className={cn(
      "bg-background text-foreground",
      "py-12 sm:py-24 md:py-32 px-0",
      className
    )}>
      <div className="mx-auto flex max-w-container flex-col items-center gap-4 text-center sm:gap-16">
        {title && (
          <div className="flex flex-col items-center gap-4 px-4 sm:gap-8">
            <h2 className="max-w-[720px] text-3xl font-semibold leading-tight sm:text-5xl sm:leading-tight">
              {title}
            </h2>
            {description && (
              <p className="text-md max-w-[600px] font-medium text-muted-foreground sm:text-xl">
                {description}
              </p>
            )}
          </div>
        )}

        <div className="relative w-full overflow-hidden">
          <div className="flex flex-nowrap overflow-hidden">
            <div 
              className="flex animate-marquee gap-4 py-4"
              style={{ animationDuration: "40s" }}
            >
              {testimonials.map((testimonial, i) => (
                <TestimonialCard 
                  key={`set1-${i}`}
                  {...testimonial}
                />
              ))}
              {testimonials.map((testimonial, i) => (
                <TestimonialCard 
                  key={`set2-${i}`}
                  {...testimonial}
                />
              ))}
              {testimonials.map((testimonial, i) => (
                <TestimonialCard 
                  key={`set3-${i}`}
                  {...testimonial}
                />
              ))}
            </div>
          </div>

          {/* Gradient overlays for smooth fade effect */}
          <div className="pointer-events-none absolute inset-y-0 left-0 w-[15%] bg-gradient-to-r from-background to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-[15%] bg-gradient-to-l from-background to-transparent" />
        </div>
      </div>
    </section>
  )
}

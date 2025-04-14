
import React from "react";
import { cn } from "@/lib/utils";

export interface TestimonialAuthor {
  name: string;
  handle?: string;
  avatar?: string;
}

interface TestimonialCardProps {
  author: TestimonialAuthor;
  text: string;
  href?: string;
}

export function TestimonialCard({ 
  author, 
  text, 
  href 
}: TestimonialCardProps) {
  return (
    <div className="min-w-[300px] max-w-[400px] rounded-xl bg-card p-8 shadow-sm mx-2">
      <div className="flex flex-col gap-4">
        <p className="text-base italic text-card-foreground">"{text}"</p>
        <div className="flex items-center gap-3">
          {author.avatar && (
            <div className="h-10 w-10 shrink-0 overflow-hidden rounded-full">
              <img
                src={author.avatar}
                alt={author.name}
                className="h-full w-full object-cover"
              />
            </div>
          )}
          <div className="flex flex-col">
            <div className="font-semibold">{author.name}</div>
            {author.handle && (
              <div className="text-xs text-muted-foreground">
                {href ? (
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-brand-blue transition-colors"
                  >
                    {author.handle}
                  </a>
                ) : (
                  author.handle
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

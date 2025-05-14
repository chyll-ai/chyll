import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { initialBlogPosts, additionalBlogPosts, finalBlogPosts } from '@/components/blog/blog-data';
import { Link } from 'react-router-dom';

function Blog() {
  // Combine all blog posts
  const allBlogPosts = [...initialBlogPosts, ...additionalBlogPosts, ...finalBlogPosts];
  
  // Check if we have any blog posts
  if (allBlogPosts.length === 0) {
    return null; // Don't render anything if there are no blog posts
  }
  
  // This code won't be reached with empty blog data, but keeping it for future use
  const featuredPost = allBlogPosts[0];
  const latestPosts = allBlogPosts.slice(1, 3);

  return (
    <div className="w-full py-20 lg:py-40">
      <div className="container mx-auto flex flex-col gap-14">
        <div className="flex w-full flex-col sm:flex-row sm:justify-between sm:items-center gap-8">
          <h4 className="text-3xl md:text-5xl tracking-tighter max-w-xl font-regular">
            Articles récents
          </h4>
        </div>
        {/* Blog post grid would be here if there were posts */}
        {/* Since there are no posts, nothing will be rendered */}
      </div>
    </div>
  );
}

export { Blog as BlogSectionWithRichPreview };

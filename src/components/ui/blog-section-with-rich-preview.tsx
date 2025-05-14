
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { initialBlogPosts, additionalBlogPosts, finalBlogPosts, productBlogPosts } from '@/components/blog/blog-data';
import { Link } from 'react-router-dom';

function Blog() {
  // Combine all blog posts
  const allBlogPosts = [...initialBlogPosts, ...additionalBlogPosts, ...finalBlogPosts, ...productBlogPosts];
  
  // Check if we have any blog posts
  if (allBlogPosts.length === 0) {
    return null; // Don't render anything if there are no blog posts
  }
  
  const featuredPost = allBlogPosts[0];
  const latestPosts = allBlogPosts.slice(1, 3);

  return (
    <div className="w-full py-20 lg:py-40">
      <div className="container mx-auto flex flex-col gap-14">
        <div className="flex w-full flex-col sm:flex-row sm:justify-between sm:items-center gap-8">
          <h4 className="text-3xl md:text-5xl tracking-tighter max-w-xl font-regular">
            Latest articles
          </h4>
          <Link to="/blog" className="text-indigo-600 font-semibold hover:text-indigo-800 transition">
            View all articles →
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Featured Post */}
          <Link to={featuredPost.url} className="flex flex-col gap-4 hover:opacity-75 cursor-pointer md:col-span-2">
            <div className="rounded-md aspect-video overflow-hidden">
              <img 
                src={featuredPost.imageUrl} 
                alt={featuredPost.title} 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex flex-row gap-4 items-center">
              <Badge>{featuredPost.category}</Badge>
              <p className="flex flex-row gap-2 text-sm items-center">
                <span className="text-muted-foreground">Published</span>{" "}
                <span>{featuredPost.date}</span>
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <h3 className="max-w-3xl text-4xl tracking-tight">
                {featuredPost.title}
              </h3>
              <p className="max-w-3xl text-muted-foreground text-base">
                {featuredPost.excerpt}
              </p>
            </div>
          </Link>

          {/* Latest Posts */}
          {latestPosts.map((post) => (
            <Link key={post.id} to={post.url} className="flex flex-col gap-4 hover:opacity-75 cursor-pointer">
              <div className="rounded-md aspect-video overflow-hidden">
                <img 
                  src={post.imageUrl} 
                  alt={post.title} 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex flex-row gap-4 items-center">
                <Badge>{post.category}</Badge>
                <p className="flex flex-row gap-2 text-sm items-center">
                  <span className="text-muted-foreground">Published</span>{" "}
                  <span>{post.date}</span>
                </p>
              </div>
              <div className="flex flex-col gap-1">
                <h3 className="max-w-3xl text-2xl tracking-tight">
                  {post.title}
                </h3>
                <p className="max-w-3xl text-muted-foreground text-base">
                  {post.excerpt}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export { Blog as BlogSectionWithRichPreview };

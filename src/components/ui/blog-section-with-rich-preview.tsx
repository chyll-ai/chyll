
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { initialBlogPosts, additionalBlogPosts, finalBlogPosts } from '@/components/blog/blog-data';
import { Link } from 'react-router-dom';
import { CalendarIcon, Clock } from 'lucide-react';
import { AspectRatio } from "@/components/ui/aspect-ratio";

function Blog() {
  // Combine all blog posts
  const allBlogPosts = [...initialBlogPosts, ...additionalBlogPosts, ...finalBlogPosts];
  
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
            Articles récents
          </h4>
          <Link to="/blog" className="text-indigo-600 font-semibold flex items-center hover:text-indigo-800 transition">
            Voir tous les articles →
          </Link>
        </div>

        {/* Featured Post */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7">
            <Link to={featuredPost.url}>
              <div className="overflow-hidden rounded-xl">
                <AspectRatio ratio={16 / 9}>
                  <img 
                    src={featuredPost.imageUrl} 
                    alt={featuredPost.title} 
                    className="w-full h-full object-cover transition-transform hover:scale-105 duration-500"
                  />
                </AspectRatio>
              </div>
            </Link>
          </div>

          <div className="lg:col-span-5 flex flex-col justify-center">
            <div className="flex items-center gap-2 mb-3">
              <Badge variant="outline" className="bg-indigo-50 text-indigo-800 font-medium border-indigo-100">
                {featuredPost.category}
              </Badge>
              <div className="flex items-center text-sm text-gray-500">
                <CalendarIcon size={14} className="mr-1" />
                {featuredPost.date}
              </div>
              <div className="flex items-center text-sm text-gray-500">
                <Clock size={14} className="mr-1" />
                {featuredPost.readTime}
              </div>
            </div>
            
            <Link to={featuredPost.url}>
              <h3 className="text-2xl md:text-3xl font-bold mb-4 hover:text-indigo-600 transition-colors">
                {featuredPost.title}
              </h3>
            </Link>

            <p className="text-gray-600 mb-6 line-clamp-3">
              {featuredPost.excerpt}
            </p>
            
            <Link 
              to={featuredPost.url}
              className="text-indigo-600 font-semibold hover:text-indigo-800 transition-colors"
            >
              Lire l'article complet →
            </Link>
          </div>
        </div>

        {/* Latest Posts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {latestPosts.map(post => (
            <div key={post.id} className="flex flex-col">
              <Link to={post.url}>
                <div className="overflow-hidden rounded-xl mb-4">
                  <AspectRatio ratio={16 / 9}>
                    <img 
                      src={post.imageUrl} 
                      alt={post.title} 
                      className="w-full h-full object-cover transition-transform hover:scale-105 duration-500"
                    />
                  </AspectRatio>
                </div>
              </Link>
              
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="outline" className="bg-indigo-50 text-indigo-800 font-medium border-indigo-100">
                  {post.category}
                </Badge>
                <span className="text-sm text-gray-500">{post.date}</span>
              </div>
              
              <Link to={post.url}>
                <h3 className="text-xl font-semibold mb-2 hover:text-indigo-600 transition-colors line-clamp-2">
                  {post.title}
                </h3>
              </Link>

              <p className="text-gray-600 line-clamp-2 mb-3">{post.excerpt}</p>
              
              <Link 
                to={post.url}
                className="text-indigo-600 mt-auto font-medium hover:text-indigo-800 transition-colors"
              >
                Lire l'article →
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export { Blog as BlogSectionWithRichPreview };

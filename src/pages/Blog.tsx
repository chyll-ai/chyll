
import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import { Footer2Demo } from '@/components/ui/footer2-demo';
import { CalendarIcon, Clock, Tag } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { useToast } from "@/components/ui/use-toast";

interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  category: string;
  imageUrl: string;
}

// Initial blog posts (first page)
const initialBlogPosts: BlogPost[] = [
  {
    id: 1,
    title: "How AI is Revolutionizing Customer Service in 2025",
    excerpt: "Learn how AI technologies are transforming customer service operations and creating better experiences for customers and businesses alike.",
    date: "April 10, 2025",
    readTime: "8 min read",
    category: "AI Trends",
    imageUrl: "https://images.unsplash.com/photo-1573164713988-8665fc963095?auto=format&fit=crop&q=80&w=1200",
  },
  {
    id: 2,
    title: "5 Ways Automation Can Streamline Your Business Workflows",
    excerpt: "Discover practical automation strategies that can help your business save time, reduce errors, and increase productivity.",
    date: "April 5, 2025",
    readTime: "6 min read",
    category: "Automation",
    imageUrl: "https://images.unsplash.com/photo-1566228015668-4c45dbc4e2f5?auto=format&fit=crop&q=80&w=1200",
  },
  {
    id: 3,
    title: "The Future of Work: AI Collaboration Models for Teams",
    excerpt: "Explore how AI-powered collaboration tools are changing the way teams work together and driving innovation across industries.",
    date: "March 28, 2025",
    readTime: "10 min read",
    category: "Workplace",
    imageUrl: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=1200",
  },
  {
    id: 4,
    title: "Case Study: How Company X Increased Efficiency by 300% with AI",
    excerpt: "Read about how a mid-sized company implemented our AI solutions and achieved remarkable improvements in operational efficiency.",
    date: "March 20, 2025",
    readTime: "12 min read",
    category: "Case Study",
    imageUrl: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=1200",
  },
  {
    id: 5,
    title: "Ethical Considerations in AI Development and Deployment",
    excerpt: "Examining the ethical dimensions of AI technology and how businesses can ensure responsible use of artificial intelligence.",
    date: "March 15, 2025", 
    readTime: "9 min read",
    category: "Ethics",
    imageUrl: "https://images.unsplash.com/photo-1508830524289-0adcbe822b40?auto=format&fit=crop&q=80&w=1200",
  },
  {
    id: 6,
    title: "Getting Started with GenerativSchool: A Beginner's Guide",
    excerpt: "A step-by-step guide to implementing GenerativSchool solutions in your business, from setup to first automation.",
    date: "March 8, 2025",
    readTime: "7 min read",
    category: "Tutorial",
    imageUrl: "https://images.unsplash.com/photo-1596838132731-3201dda7df18?auto=format&fit=crop&q=80&w=1200",
  },
];

// Additional blog posts (next page)
const additionalBlogPosts: BlogPost[] = [
  {
    id: 7,
    title: "Generative AI in Education: Transforming Learning Experiences",
    excerpt: "Explore how generative AI is changing the education landscape and creating personalized learning pathways for students of all ages.",
    date: "March 5, 2025", 
    readTime: "11 min read",
    category: "Education",
    imageUrl: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&q=80&w=1200",
  },
  {
    id: 8,
    title: "Building a Culture of Innovation with AI-Powered Tools",
    excerpt: "Learn how forward-thinking companies are using AI to foster innovation and create environments where creativity thrives.",
    date: "February 28, 2025", 
    readTime: "9 min read",
    category: "Innovation",
    imageUrl: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=1200",
  },
  {
    id: 9,
    title: "The Rise of AI Agents: Autonomous Systems in Business",
    excerpt: "Discover how autonomous AI agents are taking on complex tasks and helping businesses operate more efficiently than ever before.",
    date: "February 22, 2025", 
    readTime: "13 min read",
    category: "AI Trends",
    imageUrl: "https://images.unsplash.com/photo-1531746790731-6c087fecd65a?auto=format&fit=crop&q=80&w=1200",
  },
  {
    id: 10,
    title: "Data Privacy in the Age of AI: Best Practices for Businesses",
    excerpt: "Important considerations and practical strategies for maintaining data privacy and security while leveraging powerful AI technologies.",
    date: "February 15, 2025", 
    readTime: "10 min read",
    category: "Privacy",
    imageUrl: "https://images.unsplash.com/photo-1563705883268-eb48dff97eb0?auto=format&fit=crop&q=80&w=1200",
  },
  {
    id: 11,
    title: "Customer Spotlight: How Retail Giant Y Transformed Customer Experience",
    excerpt: "An in-depth look at how a major retail corporation used our AI platform to create personalized shopping experiences at scale.",
    date: "February 8, 2025", 
    readTime: "12 min read",
    category: "Case Study",
    imageUrl: "https://images.unsplash.com/photo-1573164574572-cb89e39749b4?auto=format&fit=crop&q=80&w=1200",
  },
  {
    id: 12,
    title: "The Economics of AI Implementation: ROI Analysis",
    excerpt: "A data-driven approach to calculating the return on investment for AI implementation projects across different business functions.",
    date: "February 1, 2025", 
    readTime: "14 min read",
    category: "Business",
    imageUrl: "https://images.unsplash.com/photo-1543286386-713bdd548da4?auto=format&fit=crop&q=80&w=1200",
  },
];

// Final additional posts to demonstrate empty state
const finalBlogPosts: BlogPost[] = [
  {
    id: 13,
    title: "AI and Sustainability: Creating Eco-Friendly Business Solutions",
    excerpt: "How AI is helping businesses reduce their environmental footprint and create more sustainable operations while improving efficiency.",
    date: "January 25, 2025", 
    readTime: "8 min read",
    category: "Sustainability",
    imageUrl: "https://images.unsplash.com/photo-1600880292089-90a7e086ee0c?auto=format&fit=crop&q=80&w=1200",
  },
  {
    id: 14,
    title: "Personalization at Scale: AI-Driven Marketing Strategies",
    excerpt: "Learn how AI is enabling marketers to create highly personalized campaigns that reach the right customers at the right time.",
    date: "January 18, 2025", 
    readTime: "7 min read",
    category: "Marketing",
    imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=1200",
  },
  {
    id: 15,
    title: "The Role of Human Expertise in AI-Powered Workflows",
    excerpt: "Exploring the critical interplay between human expertise and AI capabilities in creating effective business solutions.",
    date: "January 10, 2025", 
    readTime: "9 min read",
    category: "Workplace",
    imageUrl: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&q=80&w=1200",
  },
];

const BlogCard = ({ post }: { post: BlogPost }) => (
  <div className="bg-white rounded-lg overflow-hidden shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
    <img 
      src={post.imageUrl} 
      alt={post.title}
      className="w-full h-48 object-cover"
    />
    <div className="p-6">
      <div className="flex items-center space-x-4 mb-3 text-sm text-gray-600">
        <span className="flex items-center">
          <CalendarIcon size={14} className="mr-1" />
          {post.date}
        </span>
        <span className="flex items-center">
          <Clock size={14} className="mr-1" />
          {post.readTime}
        </span>
        <span className="flex items-center bg-indigo-100 text-indigo-800 px-2 py-1 rounded-full">
          <Tag size={14} className="mr-1" />
          {post.category}
        </span>
      </div>
      <h3 className="text-xl font-bold mb-2">{post.title}</h3>
      <p className="text-gray-600 mb-4">{post.excerpt}</p>
      <a 
        href="#" 
        className="text-indigo-600 font-medium hover:text-indigo-800 transition-colors"
      >
        Read more →
      </a>
    </div>
  </div>
);

const Blog = () => {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>(initialBlogPosts);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const location = useLocation();

  const loadMoreArticles = () => {
    setIsLoading(true);

    // Simulate a network request
    setTimeout(() => {
      if (page === 1) {
        setBlogPosts([...blogPosts, ...additionalBlogPosts]);
        setPage(2);
        setIsLoading(false);
      } else if (page === 2) {
        setBlogPosts([...blogPosts, ...finalBlogPosts]);
        setPage(3);
        setHasMore(false);
        setIsLoading(false);
        toast({
          title: "All articles loaded",
          description: "You've reached the end of our article collection.",
          duration: 3000,
        });
      }
    }, 800);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar currentPath={location.pathname} />
      
      <section className="bg-indigo-50 py-20">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-3xl md:text-5xl font-bold mb-4">Our Blog</h1>
            <p className="text-lg text-gray-700">
              Insights, updates, and perspectives from the GenerativSchool team on AI, automation, and business innovation.
            </p>
          </div>
        </div>
      </section>
      
      <section className="py-16">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.map(post => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>
          
          {hasMore && (
            <div className="mt-16 flex justify-center">
              <button 
                className={`px-6 py-3 border border-indigo-600 text-indigo-600 rounded-md hover:bg-indigo-50 transition-colors font-medium ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                onClick={loadMoreArticles}
                disabled={isLoading}
              >
                {isLoading ? 'Loading...' : 'Load More Articles'}
              </button>
            </div>
          )}
        </div>
      </section>
      
      <Footer2Demo />
    </div>
  );
};

export default Blog;

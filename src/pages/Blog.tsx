
import React from 'react';
import Navbar from '@/components/Navbar';
import { Footer2Demo } from '@/components/ui/footer2-demo';
import { CalendarIcon, Clock, Tag } from 'lucide-react';

interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  category: string;
  imageUrl: string;
}

const blogPosts: BlogPost[] = [
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
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
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
          
          <div className="mt-16 flex justify-center">
            <button className="px-6 py-3 border border-indigo-600 text-indigo-600 rounded-md hover:bg-indigo-50 transition-colors font-medium">
              Load More Articles
            </button>
          </div>
        </div>
      </section>
      
      <Footer2Demo />
    </div>
  );
};

export default Blog;

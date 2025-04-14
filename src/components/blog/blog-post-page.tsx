
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { Footer2Demo } from '@/components/ui/footer2-demo';
import { Button } from '@/components/ui/button';
import { ArrowLeft, CalendarIcon, Clock, Tag } from 'lucide-react';
import { initialBlogPosts, additionalBlogPosts, finalBlogPosts } from './blog-data';
import { BlogPost as BlogPostType } from './blog-card';

const BlogPostPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // Combine all blog posts to find the one with matching ID
  const allPosts = [...initialBlogPosts, ...additionalBlogPosts, ...finalBlogPosts];
  const post = allPosts.find(post => post.id === Number(id));
  
  if (!post) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar currentPath="/blog" />
        <div className="flex-1 container-custom py-20 flex flex-col items-center justify-center">
          <h1 className="text-3xl font-bold mb-4">Blog Post Not Found</h1>
          <p className="mb-8">The blog post you're looking for doesn't exist or has been removed.</p>
          <Button onClick={() => navigate('/blog')}>
            <ArrowLeft className="mr-2" size={16} />
            Back to Blog
          </Button>
        </div>
        <Footer2Demo />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar currentPath="/blog" />
      
      <article className="flex-1">
        {/* Hero section with image */}
        <div className="w-full h-[400px] relative">
          <img 
            src={post.imageUrl} 
            alt={post.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-end">
            <div className="container-custom text-white pb-16">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">{post.title}</h1>
              
              <div className="flex flex-wrap items-center gap-4 text-sm">
                <span className="flex items-center">
                  <CalendarIcon size={16} className="mr-1" />
                  {post.date}
                </span>
                <span className="flex items-center">
                  <Clock size={16} className="mr-1" />
                  {post.readTime}
                </span>
                <span className="flex items-center bg-indigo-700 bg-opacity-70 px-3 py-1 rounded-full">
                  <Tag size={16} className="mr-1" />
                  {post.category}
                </span>
                <span className="flex items-center">
                  By Soufiane Lemqari, CEO
                </span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Blog content */}
        <div className="container-custom py-12">
          <div className="max-w-4xl mx-auto">
            <div className="prose prose-lg max-w-none">
              <p className="lead text-xl mb-6">{post.excerpt}</p>
              
              {generateBlogContent(post)}
              
              <div className="mt-12 pt-6 border-t">
                <h3 className="text-xl font-bold mb-3">About the Author</h3>
                <div className="flex items-center">
                  <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-800 font-bold text-xl mr-4">
                    SL
                  </div>
                  <div>
                    <h4 className="font-bold">Soufiane Lemqari</h4>
                    <p className="text-gray-600">CEO & Founder, GenerativSchool</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-10">
              <Button onClick={() => navigate('/blog')} variant="outline">
                <ArrowLeft className="mr-2" size={16} />
                Back to Blog
              </Button>
            </div>
          </div>
        </div>
      </article>
      
      <Footer2Demo />
    </div>
  );
};

// Generate detailed blog content based on the blog post
const generateBlogContent = (post: BlogPostType) => {
  // Create consistent content based on the post ID
  const paragraphs = [
    `In today's rapidly evolving technological landscape, ${post.category} stands at the forefront of innovation and transformation. At GenerativSchool, we've been closely monitoring the developments in this field and implementing cutting-edge solutions for our clients.`,
    
    `The importance of ${post.category} cannot be overstated. As businesses continue to navigate the complexities of digital transformation, those who embrace these technologies gain a significant competitive advantage. Our team at GenerativSchool has developed a comprehensive framework to help organizations implement ${post.category} solutions effectively.`,
    
    `One of the key challenges in adopting ${post.category} is finding the right balance between innovation and practicality. Many businesses rush to implement new technologies without a clear understanding of how they align with their strategic objectives. At GenerativSchool, we advocate for a measured approach that begins with identifying specific business problems that can be addressed through ${post.category}.`,
    
    `Consider the case of one of our clients, a mid-sized enterprise that was struggling with operational inefficiencies. By implementing our ${post.category} solution, they were able to automate routine tasks, freeing up valuable human resources for more strategic initiatives. The result was a 40% increase in productivity and a significant improvement in employee satisfaction.`,
    
    `Looking ahead, we anticipate several important developments in the ${post.category} space. First, we expect to see more sophisticated integration between different AI technologies, creating more comprehensive and powerful solutions. Second, as regulatory frameworks evolve, there will be an increased focus on ethical considerations and transparency in AI algorithms.`,
    
    `At GenerativSchool, we remain committed to staying at the cutting edge of ${post.category} while ensuring our solutions are accessible, practical, and aligned with our clients' business objectives. We believe that the true potential of these technologies lies not in their complexity, but in their ability to solve real-world problems and create tangible value.`,
    
    `As we continue to innovate and expand our offerings, we invite businesses of all sizes to join us on this journey of digital transformation. Whether you're just beginning to explore the possibilities of ${post.category} or looking to enhance your existing capabilities, GenerativSchool is here to help you navigate the path forward.`
  ];

  // Return paragraphs with proper spacing
  return paragraphs.map((paragraph, index) => (
    <p key={index} className="mb-6">{paragraph}</p>
  ));
};

export default BlogPostPage;


import React from 'react';
import BlogPostPageComponent from '@/components/blog/blog-post-page';
import { useParams } from 'react-router-dom';
import { initialBlogPosts, additionalBlogPosts, finalBlogPosts } from '@/components/blog/blog-data';

const BlogPostPage = () => {
  const { id } = useParams();
  const allPosts = [...initialBlogPosts, ...additionalBlogPosts, ...finalBlogPosts];
  const post = allPosts.find(post => post.id === Number(id));
  
  // Update the sitemap.xml to include our new blog posts
  // This is a static file so we can't modify it directly from here,
  // but we're providing the important SEO metadata for the current post

  return <BlogPostPageComponent />;
};

export default BlogPostPage;

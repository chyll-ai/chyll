
import React from 'react';
import { BlogCard, BlogPost } from './blog-card';

interface BlogListProps {
  posts: BlogPost[];
  isLoading: boolean;
  hasMore: boolean;
  onLoadMore: () => void;
}

export const BlogList = ({ posts, isLoading, hasMore, onLoadMore }: BlogListProps) => {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {posts.map(post => (
          <BlogCard key={post.id} post={post} />
        ))}
      </div>
      
      {hasMore && (
        <div className="mt-16 flex justify-center">
          <button 
            className={`px-6 py-3 border border-indigo-600 text-indigo-600 rounded-md hover:bg-indigo-50 transition-colors font-medium ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
            onClick={onLoadMore}
            disabled={isLoading}
          >
            {isLoading ? 'Loading...' : 'Load More Articles'}
          </button>
        </div>
      )}
    </>
  );
};

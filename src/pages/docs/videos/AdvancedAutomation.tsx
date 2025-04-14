
import React from 'react';
import DocLayout from '@/components/DocLayout';
import { Play, Clock, ChevronRight } from 'lucide-react';

const AdvancedAutomation = () => {
  const sidebarLinks = [
    { title: 'All Videos', url: '/documentation/videos' },
    { title: 'Building AI Workflows', url: '/documentation/videos/ai-workflows' },
    { title: 'Advanced Automation', url: '/documentation/videos/advanced-automation', active: true },
    { title: 'Custom Integrations', url: '/documentation/videos/custom-integrations' },
    { title: 'Data Analysis', url: '/documentation/videos/data-analysis' },
  ];

  const videos = [
    {
      id: 'video2',
      title: 'Advanced Conditional Logic in Automation Flows',
      description: 'Master complex decision trees and conditional branching in your workflows',
      duration: '12:15',
      thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop',
      level: 'Advanced'
    },
    {
      id: 'video6',
      title: 'Error Handling and Retry Logic',
      description: 'Build robust workflows that gracefully handle failures and retry operations',
      duration: '9:46',
      thumbnail: 'https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=600&h=400&fit=crop',
      level: 'Intermediate'
    },
    {
      id: 'video11',
      title: 'Multi-Stage Approval Workflows',
      description: 'Create sophisticated approval processes with multiple steps and roles',
      duration: '15:33',
      thumbnail: 'https://images.unsplash.com/photo-1559523161-0fc0d8b38a7a?w=600&h=400&fit=crop',
      level: 'Advanced'
    },
    {
      id: 'video12',
      title: 'Parallel Processing in Workflows',
      description: 'Optimize performance by running workflow steps in parallel',
      duration: '10:21',
      thumbnail: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?w=600&h=400&fit=crop',
      level: 'Advanced'
    }
  ];

  return (
    <DocLayout
      title="Advanced Automation Techniques"
      description="Master sophisticated workflow patterns and optimization strategies"
      sidebarLinks={sidebarLinks}
      breadcrumbs={[
        { title: 'Video Tutorials', url: '/documentation/videos' },
        { title: 'Advanced Automation', url: '/documentation/videos/advanced-automation' }
      ]}
      previousLink={{ title: 'Building AI Workflows', url: '/documentation/videos/ai-workflows' }}
      nextLink={{ title: 'Custom Integrations', url: '/documentation/videos/custom-integrations' }}
    >
      <section className="mb-8">
        <p className="text-lg mb-6">
          Take your automation skills to the next level with these advanced tutorials. Learn sophisticated workflow patterns, error handling, parallel processing, and complex decision logic to build enterprise-grade automation solutions.
        </p>
      </section>

      <section className="mb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {videos.map((video) => (
            <div key={video.id} className="border border-gray-200 rounded-lg overflow-hidden">
              <div className="relative">
                <img 
                  src={video.thumbnail}
                  alt={`${video.title} thumbnail`}
                  className="w-full h-auto object-cover aspect-video"
                />
                <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                  <button className="bg-white bg-opacity-90 rounded-full p-3 hover:bg-opacity-100 transition-colors">
                    <Play className="h-6 w-6 text-indigo-600" />
                  </button>
                </div>
                <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white px-2 py-1 rounded text-xs flex items-center">
                  <Clock className="h-3 w-3 mr-1" />
                  {video.duration}
                </div>
              </div>
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold">{video.title}</h3>
                  <span className={`text-xs px-2 py-1 rounded ${
                    video.level === 'Beginner' ? 'bg-green-100 text-green-800' :
                    video.level === 'Intermediate' ? 'bg-blue-100 text-blue-800' :
                    'bg-indigo-100 text-indigo-800'
                  }`}>
                    {video.level}
                  </span>
                </div>
                <p className="text-gray-700 text-sm mb-3 line-clamp-2">
                  {video.description}
                </p>
                <a href="#" className="text-indigo-600 hover:text-indigo-800 text-sm font-medium flex items-center">
                  Watch tutorial
                  <ChevronRight className="h-4 w-4 ml-1" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <div className="bg-indigo-50 p-6 rounded-lg border border-indigo-100">
          <h2 className="text-xl font-bold mb-3">Want to dive deeper?</h2>
          <p className="text-gray-700 mb-4">
            Join our monthly advanced automation webinar to learn from our experts and ask questions in real-time.
          </p>
          <a href="#" className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors">
            Register for Webinar
          </a>
        </div>
      </section>
    </DocLayout>
  );
};

export default AdvancedAutomation;

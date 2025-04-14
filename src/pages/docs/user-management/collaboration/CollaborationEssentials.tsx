
import React from 'react';
import { UsersRound, MessageSquare, GitMerge } from 'lucide-react';

const CollaborationEssentials = () => {
  return (
    <section className="mb-12">
      <p className="text-lg mb-6">
        GenerativSchool provides powerful collaboration features that allow teams to work together 
        efficiently on workflows, share knowledge, and coordinate activities. Learn how to leverage 
        these capabilities to enhance your team's productivity.
      </p>
      
      <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-6 mb-8">
        <h3 className="text-xl font-semibold mb-3">Collaboration Essentials</h3>
        <p className="mb-4">
          Effective collaboration in GenerativSchool is built on three key pillars: shared workspaces, 
          real-time communication, and version control. These elements work together to create a 
          seamless collaborative environment.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="flex items-center mb-2">
              <UsersRound className="h-5 w-5 text-indigo-600 mr-2" />
              <h4 className="font-medium">Shared Workspaces</h4>
            </div>
            <p className="text-sm text-gray-600">
              Central environments where teams can access and work on the same resources.
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="flex items-center mb-2">
              <MessageSquare className="h-5 w-5 text-indigo-600 mr-2" />
              <h4 className="font-medium">Real-time Communication</h4>
            </div>
            <p className="text-sm text-gray-600">
              Built-in messaging and notification features to coordinate efforts.
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="flex items-center mb-2">
              <GitMerge className="h-5 w-5 text-indigo-600 mr-2" />
              <h4 className="font-medium">Version Control</h4>
            </div>
            <p className="text-sm text-gray-600">
              Track changes, manage revisions, and prevent conflicts in workflows.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CollaborationEssentials;

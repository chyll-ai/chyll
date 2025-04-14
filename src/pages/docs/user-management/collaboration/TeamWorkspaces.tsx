
import React from 'react';
import { Zap } from 'lucide-react';

const TeamWorkspaces = () => {
  return (
    <section className="mb-12">
      <h2 className="text-2xl font-bold mb-6">Team Workspaces</h2>
      
      <p className="mb-6">
        Team workspaces are dedicated environments where members can collaborate on workflows and resources 
        that are specific to their team.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-4">Creating a Team Workspace</h3>
          <ol className="list-decimal pl-6 space-y-2">
            <li>Go to the Workspaces section in the main navigation</li>
            <li>Click "Create New Workspace"</li>
            <li>Enter a name and description for your workspace</li>
            <li>Invite team members and assign roles</li>
            <li>Configure workspace settings</li>
            <li>Click "Create"</li>
          </ol>
        </div>
        
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-4">Workspace Features</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li>Shared workflow library</li>
            <li>Team-specific resources and templates</li>
            <li>Collaborative dashboards</li>
            <li>Activity feeds and notifications</li>
            <li>Workspace-level permissions</li>
            <li>Resource usage tracking</li>
          </ul>
        </div>
      </div>
      
      <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-6">
        <div className="flex items-start mb-4">
          <Zap className="h-6 w-6 text-indigo-600 mr-3 mt-1" />
          <div>
            <h3 className="text-xl font-semibold mb-2">Best Practices for Team Workspaces</h3>
            <p className="mb-4">
              Follow these guidelines to make the most of your team workspaces:
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium mb-2">Organization</h4>
            <ul className="list-disc pl-6 space-y-1 text-sm">
              <li>Use clear, consistent naming conventions</li>
              <li>Create folder structures for different workflow types</li>
              <li>Archive unused or outdated workflows</li>
              <li>Pin important workflows for easy access</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-2">Communication</h4>
            <ul className="list-disc pl-6 space-y-1 text-sm">
              <li>Use workspace announcements for important updates</li>
              <li>Document complex workflows with descriptions</li>
              <li>Schedule regular sync meetings</li>
              <li>Create dashboards to share progress</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-2">Quality Control</h4>
            <ul className="list-disc pl-6 space-y-1 text-sm">
              <li>Implement workflow review processes</li>
              <li>Create test cases for critical workflows</li>
              <li>Monitor workflow performance metrics</li>
              <li>Document known issues and solutions</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-2">Knowledge Sharing</h4>
            <ul className="list-disc pl-6 space-y-1 text-sm">
              <li>Create reusable components and templates</li>
              <li>Document common patterns and solutions</li>
              <li>Train new team members using example workflows</li>
              <li>Share successful use cases</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TeamWorkspaces;

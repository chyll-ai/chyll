
import React from 'react';

const CollaborativeWorkflow = () => {
  return (
    <section className="mb-12">
      <h2 className="text-2xl font-bold mb-6">Collaborative Workflow Development</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div>
          <h3 className="text-xl font-semibold mb-4">Real-time Collaboration</h3>
          <p className="mb-4">
            Multiple team members can work on the same workflow simultaneously, seeing each other's 
            changes in real-time. This facilitates rapid iteration and prevents the need to manually 
            merge changes.
          </p>
          <div className="bg-yellow-50 border border-yellow-100 rounded-lg p-4">
            <h4 className="font-medium mb-2">Pro Tip</h4>
            <p className="text-sm">
              Use the built-in chat function when collaborating in real-time to coordinate efforts 
              and discuss changes as they happen.
            </p>
          </div>
        </div>
        
        <div>
          <h3 className="text-xl font-semibold mb-4">Version Control</h3>
          <p className="mb-4">
            Every edit to a workflow is automatically saved and versioned. This allows you to:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>View the complete history of a workflow</li>
            <li>Revert to previous versions if needed</li>
            <li>Compare different versions to understand changes</li>
            <li>Create named checkpoints for important milestones</li>
          </ul>
        </div>
      </div>
      
      <div className="bg-white border border-gray-200 rounded-lg p-6 mb-8">
        <h3 className="text-xl font-semibold mb-4">Comments and Feedback</h3>
        <p className="mb-4">
          Add comments to specific parts of a workflow to provide context, ask questions, or suggest improvements.
        </p>
        <div className="bg-gray-50 p-4 rounded-lg mb-4">
          <h4 className="font-medium mb-2">How to Use Comments</h4>
          <ul className="list-disc pl-6 space-y-2">
            <li>Click the comment icon in the workflow editor to add a comment to a specific node</li>
            <li>Use @mentions to notify specific team members</li>
            <li>Resolve comments once they've been addressed</li>
            <li>Filter to view only unresolved comments</li>
          </ul>
        </div>
        <p>
          Comments are preserved in the workflow history, allowing you to track discussions and decisions 
          over time.
        </p>
      </div>
    </section>
  );
};

export default CollaborativeWorkflow;

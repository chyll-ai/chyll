
import React from 'react';
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';

const SharingAndPermissions = () => {
  return (
    <section className="mb-12">
      <h2 className="text-2xl font-bold mb-6">Sharing and Permissions</h2>
      
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4">Sharing Workflows</h3>
        <p className="mb-4">
          Sharing workflows with team members allows for collaborative development and execution.
          You can control exactly what level of access each team member has to your workflows.
        </p>
        
        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
          <h4 className="font-medium mb-4">How to Share a Workflow</h4>
          <ol className="list-decimal pl-6 space-y-3">
            <li>
              <span className="font-medium">Navigate to the workflow</span>
              <p className="text-sm text-gray-600 mt-1">
                Go to the workflow you want to share from your workflow dashboard.
              </p>
            </li>
            <li>
              <span className="font-medium">Click the Share button</span>
              <p className="text-sm text-gray-600 mt-1">
                Located in the top-right corner of the workflow editor.
              </p>
            </li>
            <li>
              <span className="font-medium">Enter emails or select team members</span>
              <p className="text-sm text-gray-600 mt-1">
                Add the people you want to share with by email or by selecting from your team list.
              </p>
            </li>
            <li>
              <span className="font-medium">Set permission levels</span>
              <p className="text-sm text-gray-600 mt-1">
                Choose from View, Edit, or Manage access levels for each recipient.
              </p>
            </li>
            <li>
              <span className="font-medium">Add an optional message</span>
              <p className="text-sm text-gray-600 mt-1">
                Provide context about what you're sharing and why.
              </p>
            </li>
            <li>
              <span className="font-medium">Click "Share"</span>
              <p className="text-sm text-gray-600 mt-1">
                Recipients will receive a notification and can access the workflow.
              </p>
            </li>
          </ol>
        </div>
        
        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-8">
          <h3 className="text-xl font-semibold mb-4">Workflow Sharing Permission Levels</h3>
          <Table>
            <TableCaption>Workflow sharing permission levels and capabilities</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Permission Level</TableHead>
                <TableHead>Can View</TableHead>
                <TableHead>Can Edit</TableHead>
                <TableHead>Can Share</TableHead>
                <TableHead>Can Delete</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">View</TableCell>
                <TableCell>✓</TableCell>
                <TableCell>✗</TableCell>
                <TableCell>✗</TableCell>
                <TableCell>✗</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Edit</TableCell>
                <TableCell>✓</TableCell>
                <TableCell>✓</TableCell>
                <TableCell>✗</TableCell>
                <TableCell>✗</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Manage</TableCell>
                <TableCell>✓</TableCell>
                <TableCell>✓</TableCell>
                <TableCell>✓</TableCell>
                <TableCell>✓</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </div>
    </section>
  );
};

export default SharingAndPermissions;

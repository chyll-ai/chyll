
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DollarSign, TrendingUp, Calendar } from 'lucide-react';
import { Lead } from '@/types/assistant';

interface SalesDataEditorProps {
  lead: Lead;
  onUpdate: (leadId: string, salesData: any) => void;
}

const SalesDataEditor: React.FC<SalesDataEditorProps> = ({ lead, onUpdate }) => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    mrr: lead.mrr || '',
    arr: lead.arr || '',
    pipeline_stage: lead.pipeline_stage || 'prospect',
    close_probability: lead.close_probability || '',
    expected_close_date: lead.expected_close_date || '',
    last_activity_date: lead.last_activity_date || new Date().toISOString().split('T')[0]
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const salesData = {
      mrr: formData.mrr ? parseFloat(formData.mrr.toString()) : null,
      arr: formData.arr ? parseFloat(formData.arr.toString()) : null,
      pipeline_stage: formData.pipeline_stage,
      close_probability: formData.close_probability ? parseInt(formData.close_probability.toString()) : null,
      expected_close_date: formData.expected_close_date || null,
      last_activity_date: formData.last_activity_date || null
    };
    
    onUpdate(lead.id, salesData);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="h-6 w-6 p-0">
          <DollarSign className="h-3 w-3" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Sales Data</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="mrr">MRR ($)</Label>
              <Input
                id="mrr"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={formData.mrr}
                onChange={(e) => setFormData(prev => ({ ...prev, mrr: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="arr">ARR ($)</Label>
              <Input
                id="arr"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={formData.arr}
                onChange={(e) => setFormData(prev => ({ ...prev, arr: e.target.value }))}
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="pipeline_stage">Pipeline Stage</Label>
            <Select value={formData.pipeline_stage} onValueChange={(value) => setFormData(prev => ({ ...prev, pipeline_stage: value }))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="prospect">Prospect</SelectItem>
                <SelectItem value="qualified">Qualified</SelectItem>
                <SelectItem value="proposal">Proposal</SelectItem>
                <SelectItem value="negotiation">Negotiation</SelectItem>
                <SelectItem value="closed_won">Closed Won</SelectItem>
                <SelectItem value="closed_lost">Closed Lost</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="close_probability">Close Probability (%)</Label>
            <Input
              id="close_probability"
              type="number"
              min="0"
              max="100"
              placeholder="0"
              value={formData.close_probability}
              onChange={(e) => setFormData(prev => ({ ...prev, close_probability: e.target.value }))}
            />
          </div>
          
          <div>
            <Label htmlFor="expected_close_date">Expected Close Date</Label>
            <Input
              id="expected_close_date"
              type="date"
              value={formData.expected_close_date}
              onChange={(e) => setFormData(prev => ({ ...prev, expected_close_date: e.target.value }))}
            />
          </div>
          
          <div>
            <Label htmlFor="last_activity_date">Last Activity Date</Label>
            <Input
              id="last_activity_date"
              type="date"
              value={formData.last_activity_date}
              onChange={(e) => setFormData(prev => ({ ...prev, last_activity_date: e.target.value }))}
            />
          </div>
          
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">
              Save Changes
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default SalesDataEditor;

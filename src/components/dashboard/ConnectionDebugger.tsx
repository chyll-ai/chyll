
import React, { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, XCircle, AlertCircle, RefreshCw } from 'lucide-react';

interface ConnectionDebuggerProps {
  userId?: string;
}

const ConnectionDebugger: React.FC<ConnectionDebuggerProps> = ({ userId }) => {
  const [results, setResults] = useState<any>({});
  const [isRunning, setIsRunning] = useState(false);

  const runDiagnostics = async () => {
    setIsRunning(true);
    const diagnostics: any = {};

    try {
      // Test 1: Basic connection
      diagnostics.connection = await testConnection();
      
      // Test 2: Auth state
      diagnostics.auth = await testAuth();
      
      // Test 3: RLS policies
      diagnostics.rls = await testRLS(userId);
      
      // Test 4: Leads table structure
      diagnostics.schema = await testTableSchema();
      
      // Test 5: Simple query
      diagnostics.query = await testSimpleQuery(userId);

    } catch (error) {
      diagnostics.error = error;
    }

    setResults(diagnostics);
    setIsRunning(false);
  };

  const testConnection = async () => {
    try {
      const { data, error } = await supabase.from('leads').select('count', { count: 'exact', head: true });
      return { success: !error, data, error: error?.message };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  };

  const testAuth = async () => {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      return { 
        success: !error && !!user, 
        user: user?.id, 
        error: error?.message 
      };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  };

  const testRLS = async (uid?: string) => {
    if (!uid) return { success: false, error: 'No user ID provided' };
    
    try {
      // Try to query with explicit user context
      const { data, error } = await supabase
        .from('leads')
        .select('id')
        .eq('client_id', uid)
        .limit(1);
      
      return { success: !error, data: data?.length, error: error?.message };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  };

  const testTableSchema = async () => {
    try {
      // Test if table exists and has expected columns
      const { data, error } = await supabase
        .from('leads')
        .select('id, client_id, full_name, email, created_at')
        .limit(0);
      
      return { success: !error, error: error?.message };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  };

  const testSimpleQuery = async (uid?: string) => {
    if (!uid) return { success: false, error: 'No user ID provided' };
    
    try {
      const { data, error, count } = await supabase
        .from('leads')
        .select('*', { count: 'exact' })
        .eq('client_id', uid);
      
      return { 
        success: !error, 
        count, 
        hasData: (data?.length || 0) > 0,
        error: error?.message 
      };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  };

  const getStatusIcon = (test: any) => {
    if (!test) return <AlertCircle className="h-4 w-4 text-muted-foreground" />;
    return test.success ? 
      <CheckCircle className="h-4 w-4 text-green-600" /> : 
      <XCircle className="h-4 w-4 text-red-600" />;
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-sm flex items-center gap-2">
          Database Connection Diagnostics
          <Button 
            variant="outline" 
            size="sm" 
            onClick={runDiagnostics}
            disabled={isRunning}
          >
            {isRunning ? (
              <RefreshCw className="h-3 w-3 animate-spin" />
            ) : (
              <RefreshCw className="h-3 w-3" />
            )}
            Run Tests
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {Object.keys(results).length === 0 ? (
          <p className="text-xs text-muted-foreground">Click "Run Tests" to diagnose connection issues</p>
        ) : (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs">
              {getStatusIcon(results.connection)}
              <span>Database Connection</span>
              {results.connection?.error && (
                <span className="text-red-600">({results.connection.error})</span>
              )}
            </div>
            
            <div className="flex items-center gap-2 text-xs">
              {getStatusIcon(results.auth)}
              <span>Authentication</span>
              {results.auth?.user && (
                <span className="text-muted-foreground">User: {results.auth.user.substring(0, 8)}...</span>
              )}
              {results.auth?.error && (
                <span className="text-red-600">({results.auth.error})</span>
              )}
            </div>
            
            <div className="flex items-center gap-2 text-xs">
              {getStatusIcon(results.rls)}
              <span>RLS Policies</span>
              {results.rls?.error && (
                <span className="text-red-600">({results.rls.error})</span>
              )}
            </div>
            
            <div className="flex items-center gap-2 text-xs">
              {getStatusIcon(results.schema)}
              <span>Table Schema</span>
              {results.schema?.error && (
                <span className="text-red-600">({results.schema.error})</span>
              )}
            </div>
            
            <div className="flex items-center gap-2 text-xs">
              {getStatusIcon(results.query)}
              <span>Query Test</span>
              {results.query?.count !== undefined && (
                <span className="text-muted-foreground">Found: {results.query.count} leads</span>
              )}
              {results.query?.error && (
                <span className="text-red-600">({results.query.error})</span>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ConnectionDebugger;

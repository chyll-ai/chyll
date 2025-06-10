import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const SUPABASE_URL = process.env.SUPABASE_URL || 'https://atsfuqwxfrezkxtnctmk.supabase.co';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;

if (!SUPABASE_SERVICE_KEY) {
  throw new Error('SUPABASE_SERVICE_KEY is required');
}

// Create Supabase admin client with service key
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

export const commands = {
  async listTables() {
    const { data, error } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public');

    if (error) throw error;
    return data.map(t => t.table_name);
  },

  async describeTable(tableName: string) {
    const { data, error } = await supabase
      .from('information_schema.columns')
      .select('*')
      .eq('table_schema', 'public')
      .eq('table_name', tableName);

    if (error) throw error;
    return data;
  },

  async getRlsPolicies(tableName: string) {
    const { data, error } = await supabase
      .from('pg_policies')
      .select('*')
      .eq('tablename', tableName);

    if (error) throw error;
    return data;
  },

  async queryTable(tableName: string, query = '*', limit = 10) {
    const { data, error } = await supabase
      .from(tableName)
      .select(query)
      .limit(limit);

    if (error) throw error;
    return data;
  },

  async insertData(tableName: string, data: any) {
    const { data: result, error } = await supabase
      .from(tableName)
      .insert(data)
      .select();

    if (error) throw error;
    return result;
  },

  async updateData(tableName: string, match: any, data: any) {
    const { data: result, error } = await supabase
      .from(tableName)
      .update(data)
      .match(match)
      .select();

    if (error) throw error;
    return result;
  },

  async deleteData(tableName: string, match: any) {
    const { data: result, error } = await supabase
      .from(tableName)
      .delete()
      .match(match)
      .select();

    if (error) throw error;
    return result;
  },

  async executeRaw(sql: string) {
    const { data, error } = await supabase.rpc('execute_sql', { sql });
    if (error) throw error;
    return data;
  }
};

export type Commands = typeof commands; 
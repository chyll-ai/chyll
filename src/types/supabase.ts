export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      clients: {
        Row: {
          id: string
          email: string
          full_name: string | null
          avatar_url: string | null
        }
        Insert: {
          id?: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
        }
      }
      conversations: {
        Row: {
          id: string
          client_id: string
          title: string | null
          last_message_at: string
        }
        Insert: {
          id?: string
          client_id: string
          title?: string | null
          last_message_at?: string
        }
        Update: {
          id?: string
          client_id?: string
          title?: string | null
          last_message_at?: string
        }
      }
      chat_sessions: {
        Row: {
          id: string
          client_id: string
          conversation_id: string
          thread_id: string | null
          assistant_id: string | null
        }
        Insert: {
          id?: string
          client_id: string
          conversation_id: string
          thread_id?: string | null
          assistant_id?: string | null
        }
        Update: {
          id?: string
          client_id?: string
          conversation_id?: string
          thread_id?: string | null
          assistant_id?: string | null
        }
      }
      messages: {
        Row: {
          id: string
          client_id: string
          conversation_id: string
          chat_session_id: string | null
          role: string
          content: string
          toolCalls: Json | null
        }
        Insert: {
          id?: string
          client_id: string
          conversation_id: string
          chat_session_id?: string | null
          role: string
          content: string
          toolCalls?: Json | null
        }
        Update: {
          id?: string
          client_id?: string
          conversation_id?: string
          chat_session_id?: string | null
          role?: string
          content?: string
          toolCalls?: Json | null
        }
      }
      client_profile: {
        Row: {
          id: string
          client_id: string
          company_name: string | null
          industry: string | null
          value_prop: string | null
          icp_title: string | null
          icp_location: string | null
          icp_size: string | null
          is_complete: boolean
        }
        Insert: {
          id?: string
          client_id: string
          company_name?: string | null
          industry?: string | null
          value_prop?: string | null
          icp_title?: string | null
          icp_location?: string | null
          icp_size?: string | null
          is_complete?: boolean
        }
        Update: {
          id?: string
          client_id?: string
          company_name?: string | null
          industry?: string | null
          value_prop?: string | null
          icp_title?: string | null
          icp_location?: string | null
          icp_size?: string | null
          is_complete?: boolean
        }
      }
      leads: {
        Row: {
          id: string
          client_id: string
          search_id: string | null
          full_name: string | null
          job_title: string | null
          company: string | null
          location: string | null
          email: string | null
          linkedin_url: string | null
          status: string
          notes: string | null
        }
        Insert: {
          id?: string
          client_id: string
          search_id?: string | null
          full_name?: string | null
          job_title?: string | null
          company?: string | null
          location?: string | null
          email?: string | null
          linkedin_url?: string | null
          status?: string
          notes?: string | null
        }
        Update: {
          id?: string
          client_id?: string
          search_id?: string | null
          full_name?: string | null
          job_title?: string | null
          company?: string | null
          location?: string | null
          email?: string | null
          linkedin_url?: string | null
          status?: string
          notes?: string | null
        }
      }
      tokens: {
        Row: {
          id: string
          client_id: string
          provider: string
          access_token: string
          refresh_token: string | null
          expires_at: string | null
        }
        Insert: {
          id?: string
          client_id: string
          provider: string
          access_token: string
          refresh_token?: string | null
          expires_at?: string | null
        }
        Update: {
          id?: string
          client_id?: string
          provider?: string
          access_token?: string
          refresh_token?: string | null
          expires_at?: string | null
        }
      }
      api_keys: {
        Row: {
          id: string
          key_type: string
          key_value: string
          is_active: boolean
        }
        Insert: {
          id?: string
          key_type: string
          key_value: string
          is_active?: boolean
        }
        Update: {
          id?: string
          key_type?: string
          key_value?: string
          is_active?: boolean
        }
      }
      activity_logs: {
        Row: {
          id: string
          client_id: string
          action: string
          context: Json | null
          timestamp: string
        }
        Insert: {
          id?: string
          client_id: string
          action: string
          context?: Json | null
          timestamp?: string
        }
        Update: {
          id?: string
          client_id?: string
          action?: string
          context?: Json | null
          timestamp?: string
        }
      }
      queue_search: {
        Row: {
          id: string
          client_id: string
          keyword: string
          parsed_filters: Json | null
          status: string
          error: string | null
          created_at: string
        }
        Insert: {
          id?: string
          client_id: string
          keyword: string
          parsed_filters?: Json | null
          status?: string
          error?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          client_id?: string
          keyword?: string
          parsed_filters?: Json | null
          status?: string
          error?: string | null
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      update_message_toolcalls: {
        Args: {
          message_id: string
          tool_calls: Json
        }
        Returns: void
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
} 
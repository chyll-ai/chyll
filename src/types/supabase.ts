
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
          created_at: string
          updated_at: string
          is_active: boolean
          plan: string
          stripe_id: string | null
        }
        Insert: {
          id?: string
          email: string
          created_at?: string
          updated_at?: string
          is_active?: boolean
          plan?: string
          stripe_id?: string | null
        }
        Update: {
          id?: string
          email?: string
          created_at?: string
          updated_at?: string
          is_active?: boolean
          plan?: string
          stripe_id?: string | null
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
          role: string
          content: string
          toolCalls: Json | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          client_id: string
          role: string
          content: string
          toolCalls?: Json | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          client_id?: string
          role?: string
          content?: string
          toolCalls?: Json | null
          created_at?: string
          updated_at?: string
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
          full_name: string
          job_title: string | null
          company: string | null
          location: string | null
          email: string | null
          phone_number: string | null
          linkedin_url: string | null
          linkedin_profile_data: Json | null
          status: string
          last_contact_date: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          client_id: string
          full_name: string
          job_title?: string | null
          company?: string | null
          location?: string | null
          email?: string | null
          phone_number?: string | null
          linkedin_url?: string | null
          linkedin_profile_data?: Json | null
          status?: string
          last_contact_date?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          client_id?: string
          full_name?: string
          job_title?: string | null
          company?: string | null
          location?: string | null
          email?: string | null
          phone_number?: string | null
          linkedin_url?: string | null
          linkedin_profile_data?: Json | null
          status?: string
          last_contact_date?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      email_jobs: {
        Row: {
          id: string
          client_id: string
          lead_id: string
          subject: string
          body: string
          status: string
          type: string
          sent_at: string | null
          error: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          client_id: string
          lead_id: string
          subject: string
          body: string
          status?: string
          type?: string
          sent_at?: string | null
          error?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          client_id?: string
          lead_id?: string
          subject?: string
          body?: string
          status?: string
          type?: string
          sent_at?: string | null
          error?: string | null
          created_at?: string
          updated_at?: string
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
      waitlist: {
        Row: {
          id: string
          user_id: string
          email: string
          referral_code: string
          referred_by: string | null
          points: number
          discord_joined: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          email: string
          referral_code?: string
          referred_by?: string | null
          points?: number
          discord_joined?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          email?: string
          referral_code?: string
          referred_by?: string | null
          points?: number
          discord_joined?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      user_roles: {
        Row: {
          id: string
          user_id: string
          role: 'superadmin' | 'admin' | 'user'
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          role: 'superadmin' | 'admin' | 'user'
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          role?: 'superadmin' | 'admin' | 'user'
          created_at?: string
        }
      }
    }
    Views: {
      waitlist_with_position: {
        Row: {
          id: string | null
          user_id: string | null
          email: string | null
          referral_code: string | null
          referred_by: string | null
          points: number | null
          discord_joined: boolean | null
          created_at: string | null
          updated_at: string | null
          waitlist_position: number | null
          referral_count: number | null
        }
      }
    }
    Functions: {
      update_message_toolcalls: {
        Args: {
          message_id: string
          tool_calls: Json
        }
        Returns: void
      }
      handle_waitlist_signup: {
        Args: {
          p_email: string
          p_referral_code?: string
        }
        Returns: Json
      }
      update_discord_status: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      get_waitlist_data: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      has_role: {
        Args: {
          _user_id: string
          _role: 'superadmin' | 'admin' | 'user'
        }
        Returns: boolean
      }
      get_user_email: {
        Args: {
          _user_id: string
        }
        Returns: string
      }
      is_superadmin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
    }
    Enums: {
      app_role: 'superadmin' | 'admin' | 'user'
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
} 

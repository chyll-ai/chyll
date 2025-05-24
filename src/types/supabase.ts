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
      api_keys: {
        Row: {
          id: string
          client_id: string
          key_type: string
          key_value: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          client_id: string
          key_type: string
          key_value: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          client_id?: string
          key_type?: string
          key_value?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "api_keys_client_id_fkey"
            columns: ["client_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      client_profile: {
        Row: {
          id: string
          client_id: string
          company_name: string
          industry: string
          value_prop: string
          icp_title: string
          icp_location: string
          icp_size: string
          common_objections: string
          banned_phrases: string
          calendly_url: string
          is_complete: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          client_id: string
          company_name: string
          industry: string
          value_prop: string
          icp_title: string
          icp_location: string
          icp_size: string
          common_objections: string
          banned_phrases: string
          calendly_url: string
          is_complete?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          client_id?: string
          company_name?: string
          industry?: string
          value_prop?: string
          icp_title?: string
          icp_location?: string
          icp_size?: string
          common_objections?: string
          banned_phrases?: string
          calendly_url?: string
          is_complete?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      conversations: {
        Row: {
          id: string
          client_id: string
          type: string
          title: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          client_id: string
          type: string
          title: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          client_id?: string
          type?: string
          title?: string
          created_at?: string
          updated_at?: string
        }
      }
      messages: {
        Row: {
          id: string
          client_id: string
          conversation_id: string
          role: string
          content: string
          toolCalls: Json | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          client_id: string
          conversation_id: string
          role: string
          content: string
          toolCalls?: Json | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          client_id?: string
          conversation_id?: string
          role?: string
          content?: string
          toolCalls?: Json | null
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
} 
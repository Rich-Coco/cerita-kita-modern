export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      chapters: {
        Row: {
          chapter_number: number
          content: string
          created_at: string
          id: string
          is_premium: boolean | null
          story_id: string
          title: string
          updated_at: string
        }
        Insert: {
          chapter_number: number
          content: string
          created_at?: string
          id?: string
          is_premium?: boolean | null
          story_id: string
          title: string
          updated_at?: string
        }
        Update: {
          chapter_number?: number
          content?: string
          created_at?: string
          id?: string
          is_premium?: boolean | null
          story_id?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "chapters_story_id_fkey"
            columns: ["story_id"]
            isOneToOne: false
            referencedRelation: "stories"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          coins: number
          created_at: string
          full_name: string | null
          id: string
          updated_at: string
          username: string
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          coins?: number
          created_at?: string
          full_name?: string | null
          id: string
          updated_at?: string
          username: string
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          coins?: number
          created_at?: string
          full_name?: string | null
          id?: string
          updated_at?: string
          username?: string
        }
        Relationships: []
      }
      purchased_chapters: {
        Row: {
          chapter_id: string
          id: string
          price_paid: number
          purchased_at: string
          story_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          chapter_id: string
          id?: string
          price_paid: number
          purchased_at?: string
          story_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          chapter_id?: string
          id?: string
          price_paid?: number
          purchased_at?: string
          story_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      stories: {
        Row: {
          author_id: string
          cover_url: string | null
          created_at: string
          genre: string | null
          id: string
          is_published: boolean | null
          like_count: number | null
          synopsis: string | null
          tags: string[] | null
          title: string
          updated_at: string
          view_count: number | null
        }
        Insert: {
          author_id: string
          cover_url?: string | null
          created_at?: string
          genre?: string | null
          id?: string
          is_published?: boolean | null
          like_count?: number | null
          synopsis?: string | null
          tags?: string[] | null
          title: string
          updated_at?: string
          view_count?: number | null
        }
        Update: {
          author_id?: string
          cover_url?: string | null
          created_at?: string
          genre?: string | null
          id?: string
          is_published?: boolean | null
          like_count?: number | null
          synopsis?: string | null
          tags?: string[] | null
          title?: string
          updated_at?: string
          view_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "stories_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      transactions: {
        Row: {
          amount: number
          coins: number
          created_at: string
          id: string
          midtrans_order_id: string
          midtrans_transaction_id: string | null
          payment_type: string | null
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          amount: number
          coins: number
          created_at?: string
          id?: string
          midtrans_order_id: string
          midtrans_transaction_id?: string | null
          payment_type?: string | null
          status: string
          updated_at?: string
          user_id: string
        }
        Update: {
          amount?: number
          coins?: number
          created_at?: string
          id?: string
          midtrans_order_id?: string
          midtrans_transaction_id?: string | null
          payment_type?: string | null
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "transactions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_reading_progress: {
        Row: {
          created_at: string
          id: string
          is_completed: boolean | null
          last_read_chapter: string | null
          progress_percentage: number | null
          story_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_completed?: boolean | null
          last_read_chapter?: string | null
          progress_percentage?: number | null
          story_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_completed?: boolean | null
          last_read_chapter?: string | null
          progress_percentage?: number | null
          story_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_reading_progress_last_read_chapter_fkey"
            columns: ["last_read_chapter"]
            isOneToOne: false
            referencedRelation: "chapters"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_reading_progress_story_id_fkey"
            columns: ["story_id"]
            isOneToOne: false
            referencedRelation: "stories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_reading_progress_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
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

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const

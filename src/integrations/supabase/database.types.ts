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
      clients: {
        Row: {
          birth: string | null
          created_at: string
          email: string
          essential: boolean
          karmic_numbers: Json[] | null
          map_choosen: string | null
          maps_available: string[]
          name: string | null
        }
        Insert: {
          birth?: string | null
          created_at?: string
          email: string
          essential?: boolean
          karmic_numbers?: Json[] | null
          map_choosen?: string | null
          maps_available?: string[]
          name?: string | null
        }
        Update: {
          birth?: string | null
          created_at?: string
          email?: string
          essential?: boolean
          karmic_numbers?: Json[] | null
          map_choosen?: string | null
          maps_available?: string[]
          name?: string | null
        }
        Relationships: []
      }
      karmic_interpretations: {
        Row: {
          content: string | null
          created_at: string
          id: string
          title: string | null
        }
        Insert: {
          content?: string | null
          created_at?: string
          id: string
          title?: string | null
        }
        Update: {
          content?: string | null
          created_at?: string
          id?: string
          title?: string | null
        }
        Relationships: []
      }
      karmic_love: {
        Row: {
          content: string
          id: string
          title: string
        }
        Insert: {
          content: string
          id: string
          title: string
        }
        Update: {
          content?: string
          id?: string
          title?: string
        }
        Relationships: []
      }
      karmic_maps: {
        Row: {
          created_at: string
          id: number
          selected_map: string
          skus: string[]
        }
        Insert: {
          created_at?: string
          id?: number
          selected_map: string
          skus?: string[]
        }
        Update: {
          created_at?: string
          id?: number
          selected_map?: string
          skus?: string[]
        }
        Relationships: []
      }
      karmic_professional: {
        Row: {
          content: string
          id: string
          title: string
        }
        Insert: {
          content: string
          id: string
          title: string
        }
        Update: {
          content?: string
          id?: string
          title?: string
        }
        Relationships: []
      }
      yampi_integrations: {
        Row: {
          alias: string
          created_at: string
          id: number | null
          secret: string | null
          webhook_url: string | null
        }
        Insert: {
          alias: string
          created_at?: string
          id?: number | null
          secret?: string | null
          webhook_url?: string | null
        }
        Update: {
          alias?: string
          created_at?: string
          id?: number | null
          secret?: string | null
          webhook_url?: string | null
        }
        Relationships: []
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

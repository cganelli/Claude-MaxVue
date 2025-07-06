export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string | null;
          first_name: string | null;
          last_name: string | null;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          id: string;
          email?: string | null;
          first_name?: string | null;
          last_name?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: {
          id?: string;
          email?: string | null;
          first_name?: string | null;
          last_name?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
      };
      vision_tests: {
        Row: {
          id: string;
          user_id: string;
          test_type: string;
          results: unknown;
          score: number;
          created_at: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          test_type?: string;
          results?: unknown;
          score?: number;
          created_at?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          test_type?: string;
          results?: unknown;
          score?: number;
          created_at?: string | null;
        };
      };
      prescriptions: {
        Row: {
          id: string;
          user_id: string;
          right_eye_sphere: string | null;
          right_eye_cylinder: string | null;
          right_eye_axis: string | null;
          right_eye_add: string | null;
          left_eye_sphere: string | null;
          left_eye_cylinder: string | null;
          left_eye_axis: string | null;
          left_eye_add: string | null;
          pupillary_distance: string | null;
          prescription_date: string | null;
          doctor_name: string | null;
          notes: string | null;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          right_eye_sphere?: string | null;
          right_eye_cylinder?: string | null;
          right_eye_axis?: string | null;
          right_eye_add?: string | null;
          left_eye_sphere?: string | null;
          left_eye_cylinder?: string | null;
          left_eye_axis?: string | null;
          left_eye_add?: string | null;
          pupillary_distance?: string | null;
          prescription_date?: string | null;
          doctor_name?: string | null;
          notes?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          right_eye_sphere?: string | null;
          right_eye_cylinder?: string | null;
          right_eye_axis?: string | null;
          right_eye_add?: string | null;
          left_eye_sphere?: string | null;
          left_eye_cylinder?: string | null;
          left_eye_axis?: string | null;
          left_eye_add?: string | null;
          pupillary_distance?: string | null;
          prescription_date?: string | null;
          doctor_name?: string | null;
          notes?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
      };
    };
  };
}

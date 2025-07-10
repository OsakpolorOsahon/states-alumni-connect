export interface Member {
  id: string;
  full_name: string;
  nickname?: string;
  email: string;
  stateship_year: string;
  last_mowcub_position: string;
  current_council_office?: string;
  photo_url?: string;
  dues_proof_url?: string;
  status: 'pending' | 'active' | 'inactive';
  role: 'member' | 'secretary';
  latitude?: number;
  longitude?: number;
  created_at: string;
  updated_at: string;
}
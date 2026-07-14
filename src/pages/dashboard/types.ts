export interface IDashboardRecentMember {
  id: number;
  name: string;
  email: string;
  front_title?: string;
  back_title?: string;
  status?: string;
  verification_status?: string | null;
  is_need_verify?: boolean;
  is_verified?: boolean;
  created_at?: string;
  photo?: string | null;
}

export interface IDashboardSummary {
  members: {
    total: number;
    submission: number;
    approved: number;
    rejected: number;
  };
  verification: {
    need_verify: number;
    pending: number;
    re_verified: number;
    submitted: number;
    approved: number;
    rejected: number;
  };
  recent: IDashboardRecentMember[];
}

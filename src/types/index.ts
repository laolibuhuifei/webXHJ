export interface UserInfo {
  id: number;
  username: string;
  avatar_img: string;
  art_star_count: number;
  user_type: string;
  is_vip: boolean;
}

export interface Work {
  work_id: number;
  user_id: number;
  work_url: string;
  user_avatar_url: string;
  created_at: string;
  views: number;
}

export interface WorkDetail extends Work {
  result_image_url: string;
  like_count: number;
  comment_count: number;
  comment_list: Comment[];
  like_list: LikeItem[];
}

export interface Comment {
  comment_id: number;
  user_id: number;
  username: string;
  avatar_url: string;
  comment_text: string;
  created_at: string;
}

export interface LikeItem {
  like_id: number;
  user_id: number;
  username: string;
  avatar_url: string;
  like_expression: string;
  created_at: string;
}

export interface Description {
  id: number;
  description: string;
  category_name: string;
  rule: string;
}

export interface Style {
  id: number;
  name: string;
  sample_image_url: string;
}

export interface ApiResponse<T = any> {
  code: number;
  data: T;
  msg?: string;
  message?: string;
}

export interface LoginResponse {
  user_id: number;
  username: string;
  avatar_img: string;
}

export interface GenerateResponse {
  work_id: number;
  record: string;
  art_star_count: number;
}

export interface WorkListResponse {
  current_page: number;
  total_pages: number;
  user_id: number;
  work_list: Work[];
}
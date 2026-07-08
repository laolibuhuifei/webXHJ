import type { 
  ApiResponse, 
  LoginResponse, 
  UserInfo, 
  Work, 
  WorkDetail, 
  Description, 
  Style,
  GenerateResponse,
  WorkListResponse
} from '../types';

const BASE_URL = '/xhapi';

const request = async <T>(
  url: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 15000);
  
  try {
    const response = await fetch(`${BASE_URL}${url}`, {
      ...options,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return response.json();
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') {
      throw new Error('请求超时，请稍后重试');
    }
    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
};

export const authApi = {
  login: async (openid: string, channel: string): Promise<ApiResponse<LoginResponse>> => {
    return request('/xhjlogin', {
      method: 'POST',
      body: JSON.stringify({ openid, channel }),
    });
  },
};

export const userApi = {
  getUserInfo: async (userId: number): Promise<ApiResponse<UserInfo>> => {
    return request(`/xhj/user/info/${userId}`);
  },
  
  getUserWorks: async (userId: number, page: number): Promise<ApiResponse<WorkListResponse>> => {
    return request(`/xhj/user/work_list/${userId}/${page}`);
  },
  
  followUser: async (userId: number, followUserId: number): Promise<ApiResponse<void>> => {
    return request('/xhj/user/follow', {
      method: 'POST',
      body: JSON.stringify({ user_id: userId, follow_user_id: followUserId }),
    });
  },
};

export const workApi = {
  getWorkDetail: async (workId: number): Promise<ApiResponse<WorkDetail>> => {
    return request(`/xhj/work/detail/${workId}`);
  },
};

export const creationApi = {
  submit: async (
    userId: number, 
    descriptionCombination: string, 
    styleId: number
  ): Promise<ApiResponse<GenerateResponse>> => {
    return request('/xhj/creation/submit', {
      method: 'POST',
      body: JSON.stringify({
        user_id: userId,
        description_combination: descriptionCombination + ',',
        style_id: styleId,
        source: 0,
        style: '1',
      }),
    });
  },
  
  getDescriptions: async (): Promise<ApiResponse<{ id: number; category_name: string; must: string; creation_description_options: Description[] }[]>> => {
    return request('/xhj/creation/descriptions');
  },
  
  getStyles: async (): Promise<ApiResponse<Style[]>> => {
    return request('/xhj/creation/styles');
  },
};

export const interactionApi = {
  like: async (
    userId: number, 
    workId: number, 
    likeExpression: string
  ): Promise<ApiResponse<void>> => {
    return request('/xhj/work/like', {
      method: 'POST',
      body: JSON.stringify({
        user_id: userId,
        work_id: workId,
        like_expression: likeExpression,
      }),
    });
  },
  
  comment: async (
    userId: number, 
    workId: number, 
    commentText: string
  ): Promise<ApiResponse<void>> => {
    return request('/xhj/work/comment', {
      method: 'POST',
      body: JSON.stringify({
        user_id: userId,
        work_id: workId,
        comment_text: commentText,
      }),
    });
  },
  
  getLikeIcons: async (): Promise<ApiResponse<any[]>> => {
    return request('/xhj/like/icons');
  },
  
  getCommentOptions: async (): Promise<ApiResponse<any[]>> => {
    return request('/xhj/comment/options');
  },
};

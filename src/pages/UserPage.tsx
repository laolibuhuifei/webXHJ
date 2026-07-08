import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Image, Plus } from 'lucide-react';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { WorkGrid } from '../components/WorkGrid';
import { userApi } from '../utils/api';
import { useUserStore } from '../store/userStore';
import type { UserInfo, Work } from '../types';

export function UserPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, isLoggedIn } = useUserStore();
  
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [works, setWorks] = useState<Work[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      fetchUserInfo(parseInt(id));
      fetchUserWorks(parseInt(id));
    }
  }, [id]);

  const fetchUserInfo = async (userId: number) => {
    try {
      const response = await userApi.getUserInfo(userId);
      if (response.code === 200 && response.data) {
        setUserInfo(response.data);
      } else {
        setError('获取用户信息失败');
      }
    } catch (error) {
      console.error('获取用户信息失败:', error);
    }
  };

  const fetchUserWorks = async (userId: number) => {
    setIsLoading(true);
    try {
      const firstPageResponse = await userApi.getUserWorks(userId, 1);
      if (firstPageResponse.code !== 200 || !firstPageResponse.data) {
        return;
      }
      
      const totalPages = firstPageResponse.data.total_pages || 1;
      const allWorks: Work[] = [...(firstPageResponse.data.work_list || [])];
      
      if (totalPages > 1) {
        for (let page = 2; page <= totalPages; page++) {
          const response = await userApi.getUserWorks(userId, page);
          if (response.code === 200 && response.data) {
            allWorks.push(...(response.data.work_list || []));
          }
          await new Promise(resolve => setTimeout(resolve, 200));
        }
      }
      
      setWorks(allWorks);
    } catch (error) {
      console.error('获取用户作品失败:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const isCurrentUser = id && user && parseInt(id) === user.id;

  if (isLoading && works.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <LoadingSpinner size="md" text="加载用户信息..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-3">{error}</p>
          <button onClick={() => navigate('/')} className="btn-primary text-sm">返回首页</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 text-sm dark:text-gray-400 dark:hover:text-white"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>返回</span>
        </button>

        {userInfo && (
          <div className="bg-white border border-gray-100 rounded-md p-6 mb-6 dark:bg-gray-800 dark:border-gray-700">
            <div className="flex flex-col md:flex-row md:items-center gap-4">
              <div className="flex-shrink-0">
                {userInfo.avatar_img ? (
                  <img
                    src={userInfo.avatar_img}
                    alt={userInfo.username}
                    className="w-20 h-20 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center dark:bg-gray-700">
                    <User className="w-10 h-10 text-gray-400 dark:text-gray-500" />
                  </div>
                )}
              </div>

              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-3 mb-3">
                  <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                    {userInfo.username || `用户${userInfo.id}`}
                  </h1>
                  {isCurrentUser && (
                    <button
                      onClick={() => navigate('/create')}
                      className="btn-primary text-sm flex items-center gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      <span>发布作品</span>
                    </button>
                  )}
                  {userInfo.is_vip && (
                    <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full dark:bg-gray-700 dark:text-gray-300">VIP用户</span>
                  )}
                </div>

                <div className="flex items-center gap-5">
                  <div className="flex items-center gap-1.5 text-gray-500 text-sm dark:text-gray-400">
                    <Image className="w-4 h-4" />
                    <span>
                      <span className="text-gray-900 font-medium dark:text-white">{works.length}</span> 个作品
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-gray-500 text-sm dark:text-gray-400">
                    <span className="text-gray-900 font-medium dark:text-white">{userInfo.art_star_count || 0}</span> 粉丝
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="mb-4">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white">作品 ({works.length})</h2>
        </div>

        {works.length === 0 && !isLoading ? (
          <div className="flex flex-col items-center justify-center py-12 bg-white border border-gray-100 rounded-md dark:bg-gray-800 dark:border-gray-700">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-3 dark:bg-gray-900">
              <Image className="w-8 h-8 text-gray-400 dark:text-gray-500" />
            </div>
            <p className="text-gray-500 text-sm dark:text-gray-400">暂无作品</p>
          </div>
        ) : (
          <WorkGrid works={works} />
        )}
      </div>
    </div>
  );
}

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MessageCircle, Share2, Calendar, Eye } from 'lucide-react';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { CommentSection } from '../components/CommentSection';
import { LikeButton } from '../components/LikeButton';
import { workApi, interactionApi } from '../utils/api';
import { useUserStore } from '../store/userStore';
import type { WorkDetail } from '../types';

export function WorkDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, isLoggedIn } = useUserStore();
  
  const [work, setWork] = useState<WorkDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      fetchWorkDetail(parseInt(id));
    }
  }, [id]);

  const fetchWorkDetail = async (workId: number) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await workApi.getWorkDetail(workId);
      if (response.code === 200 && response.data) {
        setWork(response.data);
      } else {
        setError('获取作品详情失败');
      }
    } catch (error) {
      console.error('获取作品详情失败:', error);
      setError('获取作品详情失败，请稍后重试');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddComment = async (text: string) => {
    if (!isLoggedIn) {
      alert('请先登录');
      return;
    }
    try {
      await interactionApi.comment(user!.id, work!.work_id, text);
      await fetchWorkDetail(work!.work_id);
    } catch (error) {
      console.error('评论失败:', error);
    }
  };

  const handleShare = () => {
    if (navigator.share && work) {
      navigator.share({
        title: `作品 ${work.work_id}`,
        text: '分享自小画家网页版',
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('链接已复制到剪贴板');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <LoadingSpinner size="md" text="加载作品详情..." />
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

  if (!work) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <p className="text-gray-500 dark:text-gray-400">作品不存在</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 text-sm dark:text-gray-400 dark:hover:text-white"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>返回</span>
        </button>

        <div className="bg-white border border-gray-100 rounded-md overflow-hidden dark:bg-gray-800 dark:border-gray-700">
          <img
            src={work.result_image_url || work.work_url}
            alt={`作品 ${work.work_id}`}
            className="w-full max-h-[500px] object-contain bg-gray-50 dark:bg-gray-900"
          />
        </div>

        <div className="mt-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-xl font-semibold text-gray-900 dark:text-white">作品 #{work.work_id}</h1>
              <p className="text-gray-500 text-sm mt-1 dark:text-gray-400">由用户{work.user_id}创作</p>
            </div>
            <button
              onClick={handleShare}
              className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:text-gray-900 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-700"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center gap-5">
            <LikeButton
              workId={work.work_id}
              initialCount={work.like_count || 0}
              userId={user?.id || 0}
            />
            <div className="flex items-center gap-1.5 text-gray-500 text-sm dark:text-gray-400">
              <MessageCircle className="w-4 h-4" />
              <span>{work.comment_count || 0}</span>
            </div>
            <div className="flex items-center gap-1.5 text-gray-500 text-sm dark:text-gray-400">
              <Eye className="w-4 h-4" />
              <span>{work.views || 0}</span>
            </div>
          </div>
        </div>

        <div className="mt-6 flex items-center gap-2 text-gray-500 text-sm dark:text-gray-400">
          <Calendar className="w-4 h-4" />
          <span>{work.created_at}</span>
        </div>

        <CommentSection
          comments={work.comment_list || []}
          onAddComment={handleAddComment}
        />
      </div>
    </div>
  );
}

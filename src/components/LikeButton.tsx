import { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import { interactionApi } from '../utils/api';

interface LikeButtonProps {
  workId: number;
  initialCount: number;
  userId: number;
}

interface LikeIcon {
  id: number;
  icon: string;
  icon_name: string;
}

export function LikeButton({ workId, initialCount, userId }: LikeButtonProps) {
  const [count, setCount] = useState(initialCount);
  const [isLiked, setIsLiked] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [icons, setIcons] = useState<LikeIcon[]>([]);

  useEffect(() => {
    fetchLikeIcons();
  }, []);

  const fetchLikeIcons = async () => {
    try {
      const response = await interactionApi.getLikeIcons();
      if (response.code === 200 && response.data) {
        setIcons(Array.isArray(response.data) ? response.data : []);
      }
    } catch (error) {
      console.error('获取点赞图标失败:', error);
    }
  };

  const handleLike = async () => {
    if (isLiked || isSubmitting || userId === 0) return;
    
    setIsSubmitting(true);
    try {
      const likeExpression = icons.length > 0 ? icons[0].icon : 'heart';
      
      const response = await interactionApi.like(userId, workId, likeExpression);
      
      if (response.code === 200) {
        setIsLiked(!isLiked);
        setCount((prev) => isLiked ? prev - 1 : prev + 1);
      } else {
        console.error('点赞失败:', response.msg || response.message);
      }
    } catch (error) {
      console.error('点赞失败:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <button
      onClick={handleLike}
      disabled={isSubmitting || userId === 0}
      className={`flex items-center gap-1.5 text-sm transition-colors ${
        isLiked ? 'text-red-500' : 'text-gray-500 hover:text-red-500'
      } disabled:opacity-50 disabled:cursor-not-allowed`}
    >
      <Heart className="w-4 h-4" fill={isLiked ? 'currentColor' : 'none'} />
      <span className="font-medium">{count}</span>
    </button>
  );
}

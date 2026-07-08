import { useState, useEffect } from 'react';
import { User, RefreshCw } from 'lucide-react';
import { interactionApi } from '../utils/api';
import type { Comment } from '../types';

interface CommentOption {
  id: number;
  comment_text: string;
}

interface CommentSectionProps {
  comments: Comment[];
  onAddComment: (text: string) => void;
}

export function CommentSection({ comments, onAddComment }: CommentSectionProps) {
  const [options, setOptions] = useState<CommentOption[]>([]);
  const [isLoadingOptions, setIsLoadingOptions] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchCommentOptions();
  }, []);

  const fetchCommentOptions = async () => {
    setIsLoadingOptions(true);
    try {
      const response = await interactionApi.getCommentOptions();
      console.log('评论选项API返回:', response);
      if (response.code === 200 && response.data) {
        setOptions(Array.isArray(response.data) ? response.data : []);
      }
    } catch (error) {
      console.error('获取评论选项失败:', error);
    } finally {
      setIsLoadingOptions(false);
    }
  };

  const handleSubmit = async (commentText: string) => {
    if (!commentText.trim() || isSubmitting) return;
    setIsSubmitting(true);
    await onAddComment(commentText.trim());
    setIsSubmitting(false);
  };

  return (
    <div className="mt-8">
      <h3 className="font-medium text-gray-900 mb-4 dark:text-white">评论 ({comments.length})</h3>

      <div className="flex gap-3 mb-4">
        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0 dark:bg-gray-700">
          <User className="w-4 h-4 text-gray-400 dark:text-gray-500" />
        </div>
        <div className="flex-1">
          {isLoadingOptions ? (
            <div className="flex items-center gap-2 text-gray-500 text-sm dark:text-gray-400">
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>加载评论选项...</span>
            </div>
          ) : options.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {options.map((option) => (
                <button
                  key={option.id}
                  onClick={() => handleSubmit(option.comment_text)}
                  disabled={isSubmitting}
                  className="px-3 py-1.5 rounded-md text-sm bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                >
                  {option.comment_text}
                </button>
              ))}
            </div>
          ) : (
            <div className="text-gray-500 text-sm dark:text-gray-400">暂无评论选项</div>
          )}
        </div>
      </div>

      <div className="space-y-3 max-h-64 overflow-y-auto">
        {comments.length === 0 ? (
          <div className="text-center py-6 text-gray-500 text-sm dark:text-gray-400">暂无评论</div>
        ) : (
          comments.map((comment) => (
            <div key={comment.comment_id} className="flex gap-3">
              {comment.avatar_url ? (
                <img
                  src={comment.avatar_url}
                  alt={comment.username}
                  className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0 dark:bg-gray-700">
                  <User className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                </div>
              )}
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-gray-900 text-sm dark:text-white">{comment.username}</span>
                  <span className="text-xs text-gray-400">{comment.created_at}</span>
                </div>
                <p className="text-gray-600 text-sm dark:text-gray-300">{comment.comment_text}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

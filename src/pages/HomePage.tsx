import { useState, useEffect } from 'react';
import { WorkGrid } from '../components/WorkGrid';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { userApi } from '../utils/api';
import type { Work } from '../types';

export function HomePage() {
  const [works, setWorks] = useState<Work[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAllWorks();
  }, []);

  const fetchAllWorks = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const firstPageResponse = await userApi.getUserWorks(1000, 1);
      
      if (firstPageResponse.code !== 200 || !firstPageResponse.data) {
        setError('获取作品失败');
        return;
      }
      
      const totalPages = firstPageResponse.data.total_pages || 1;
      const allWorks: Work[] = [...(firstPageResponse.data.work_list || [])];
      
      if (totalPages > 1) {
        for (let page = 2; page <= totalPages; page++) {
          const response = await userApi.getUserWorks(1000, page);
          if (response.code === 200 && response.data) {
            allWorks.push(...(response.data.work_list || []));
          }
          await new Promise(resolve => setTimeout(resolve, 200));
        }
      }
      
      setWorks(allWorks);
    } catch (error) {
      console.error('获取作品失败:', error);
      setError('获取作品失败，请稍后重试');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">发现作品</h1>
          <p className="text-gray-500 text-sm mt-1 dark:text-gray-400">浏览社区内的AI绘画作品</p>
        </div>

        {error && (
          <div className="flex justify-center py-12">
            <div className="text-center">
              <p className="text-red-500 mb-3">{error}</p>
              <button onClick={fetchAllWorks} className="btn-primary text-sm">重试</button>
            </div>
          </div>
        )}

        {!error && (isLoading && works.length === 0 ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="md" text="加载中..." />
          </div>
        ) : (
          <WorkGrid works={works} />
        ))}
      </div>
    </div>
  );
}

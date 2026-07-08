import { WorkCard } from './WorkCard';
import type { Work } from '../types';

interface WorkGridProps {
  works: Work[];
}

export function WorkGrid({ works }: WorkGridProps) {
  if (works.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <span className="text-4xl mb-3">🎨</span>
        <p className="text-gray-500">暂无作品</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
      {works.map((work) => (
        <WorkCard key={work.work_id} work={work} />
      ))}
    </div>
  );
}

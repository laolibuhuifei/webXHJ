import { useNavigate } from 'react-router-dom';
import { Eye } from 'lucide-react';
import type { Work } from '../types';

interface WorkCardProps {
  work: Work;
}

export function WorkCard({ work }: WorkCardProps) {
  const navigate = useNavigate();

  return (
    <div
      className="card cursor-pointer"
      onClick={() => navigate(`/work/${work.work_id}`)}
    >
      <div className="relative">
        <img
          src={work.work_url}
          alt={`作品 ${work.work_id}`}
          className="w-full aspect-square object-cover"
          loading="lazy"
        />
        
        <div className="absolute bottom-2 right-2 flex items-center gap-1 px-2 py-1 bg-white/80 backdrop-blur-sm rounded-full text-gray-600 text-xs dark:bg-gray-900/80 dark:text-gray-300">
          <Eye className="w-3 h-3" />
          <span>{work.views}</span>
        </div>
      </div>
    </div>
  );
}

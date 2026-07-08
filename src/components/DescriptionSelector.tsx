import { useState } from 'react';
import { Search, Plus, X } from 'lucide-react';
import type { Description } from '../types';

interface DescriptionSelectorProps {
  descriptions: Description[];
  selectedIds: number[];
  onSelect: (ids: number[]) => void;
}

export function DescriptionSelector({ descriptions, selectedIds, onSelect }: DescriptionSelectorProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredDescriptions = descriptions.filter((desc) =>
    desc.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const categories = [...new Set(descriptions.map((d) => d.category_name))];

  const handleToggle = (id: number) => {
    if (selectedIds.includes(id)) {
      onSelect(selectedIds.filter((selectedId) => selectedId !== id));
    } else if (selectedIds.length < 5) {
      onSelect([...selectedIds, id]);
    }
  };

  return (
    <div className="bg-dark-100 rounded-2xl p-6">
      <h3 className="text-lg font-semibold mb-4">选择描述词</h3>
      
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="搜索描述词..."
          className="w-full bg-dark-300 border border-dark-100 rounded-xl pl-10 pr-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-primary-500"
        />
      </div>

      <div className="space-y-4">
        {categories.map((category) => (
          <div key={category}>
            <h4 className="text-sm font-medium text-gray-400 mb-2">{category}</h4>
            <div className="flex flex-wrap gap-2">
              {filteredDescriptions
                .filter((d) => d.category_name === category)
                .map((desc) => (
                  <button
                    key={desc.id}
                    onClick={() => handleToggle(desc.id)}
                    className={`px-3 py-1.5 rounded-full text-sm transition-all duration-300 ${
                      selectedIds.includes(desc.id)
                        ? 'bg-primary-500 text-white'
                        : 'bg-dark-300 text-gray-300 hover:bg-dark-100'
                    }`}
                  >
                    {desc.description}
                  </button>
                ))}
            </div>
          </div>
        ))}
      </div>

      {selectedIds.length > 0 && (
        <div className="mt-4 pt-4 border-t border-dark-300">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-400">已选 ({selectedIds.length}/5)</span>
            <button
              onClick={() => onSelect([])}
              className="text-xs text-primary-400 hover:text-primary-300"
            >
              清除全部
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {selectedIds.map((id) => {
              const desc = descriptions.find((d) => d.id === id);
              return (
                <span
                  key={id}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-primary-500/30 to-purple-500/30 rounded-full text-sm text-white"
                >
                  <Plus className="w-3 h-3 text-primary-400" />
                  {desc?.description}
                  <button
                    onClick={() => handleToggle(id)}
                    className="ml-1 hover:text-red-400"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
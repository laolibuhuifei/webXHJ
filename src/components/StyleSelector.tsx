import type { Style } from '../types';

interface StyleSelectorProps {
  styles: Style[];
  selectedId: number | null;
  onSelect: (id: number) => void;
}

export function StyleSelector({ styles, selectedId, onSelect }: StyleSelectorProps) {
  return (
    <div className="bg-dark-100 rounded-2xl p-6">
      <h3 className="text-lg font-semibold mb-4">选择风格</h3>
      
      <div className="flex gap-4 overflow-x-auto pb-2">
        {styles.map((style) => (
          <button
            key={style.id}
            onClick={() => onSelect(style.id)}
            className={`flex-shrink-0 w-32 rounded-xl overflow-hidden transition-all duration-300 ${
              selectedId === style.id
                ? 'ring-2 ring-primary-500 shadow-lg shadow-primary-500/30'
                : 'hover:ring-1 hover:ring-gray-500'
            }`}
          >
            <div className="aspect-square bg-dark-300">
              {style.sample_image_url ? (
                <img
                  src={style.sample_image_url}
                  alt={style.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-2xl">🎨</span>
                </div>
              )}
            </div>
            <div className={`p-2 text-center ${selectedId === style.id ? 'bg-primary-500' : 'bg-dark-300'}`}>
              <span className="text-sm font-medium text-white">{style.name}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
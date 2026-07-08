import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Image } from 'lucide-react';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { CardExhaustedModal } from '../components/CardExhaustedModal';
import { creationApi } from '../utils/api';
import { useUserStore } from '../store/userStore';
import type { Description, Style } from '../types';

interface DescriptionCategory {
  id: number;
  category_name: string;
  must: string;
  creation_description_options: Description[];
}

export function CreatePage() {
  const navigate = useNavigate();
  const { user, isLoggedIn, resetAccount } = useUserStore();
  
  const [categories, setCategories] = useState<DescriptionCategory[]>([]);
  const [styles, setStyles] = useState<Style[]>([]);
  const [selectedRules, setSelectedRules] = useState<Record<string, string>>({});
  const [selectedStyleId, setSelectedStyleId] = useState<number | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoadingOptions, setIsLoadingOptions] = useState(true);
  const [showCardExhaustedModal, setShowCardExhaustedModal] = useState(false);

  useEffect(() => {
    fetchOptions();
  }, []);

  const fetchOptions = async () => {
    setIsLoadingOptions(true);
    try {
      const [descResponse, styleResponse] = await Promise.all([
        creationApi.getDescriptions(),
        creationApi.getStyles(),
      ]);
      
      if (descResponse.code === 200 && descResponse.data) {
        setCategories(descResponse.data);
      }
      if (styleResponse.code === 200 && styleResponse.data) {
        setStyles(styleResponse.data);
        if (styleResponse.data.length > 0) {
          setSelectedStyleId(styleResponse.data[0].id);
        }
      }
    } catch (error) {
      console.error('获取选项失败:', error);
      setError('获取选项失败，请稍后重试');
    } finally {
      setIsLoadingOptions(false);
    }
  };

  const handleCategorySelect = (categoryName: string, rule: string) => {
    setSelectedRules((prev) => ({
      ...prev,
      [categoryName]: rule,
    }));
  };

  const handleResetAccount = async () => {
    resetAccount();
    setShowCardExhaustedModal(false);
    navigate('/');
  };

  const handleGenerate = async () => {
    if (!isLoggedIn) {
      alert('请先登录');
      return;
    }
    
    const mustCategories = categories.filter((c) => c.must === '1');
    const missingCategories = mustCategories.filter(
      (c) => !selectedRules[c.category_name]
    );
    
    if (missingCategories.length > 0) {
      alert(`请选择：${missingCategories.map((c) => c.category_name).join('、')}`);
      return;
    }
    
    if (!selectedStyleId) {
      alert('请选择一个风格');
      return;
    }

    setIsGenerating(true);
    setError(null);
    setGeneratedImage(null);

    try {
      const descriptionCombination = Object.values(selectedRules).join(',');
      const response = await creationApi.submit(
        user!.id,
        descriptionCombination,
        selectedStyleId
      );

      if (response.code === 200 && response.data) {
        setGeneratedImage(response.data.record);
      } else {
        const errorMsg = response.msg || response.message || '生成失败';
        console.error('生成失败:', response);
        
        if (response.code === 102 || errorMsg.includes('画卡') || errorMsg.includes('不足') || errorMsg.includes('次数')) {
          setShowCardExhaustedModal(true);
        } else {
          setError(`生成失败: ${errorMsg}`);
        }
      }
    } catch (error) {
      console.error('生成失败:', error);
      const errorMsg = error instanceof Error ? error.message : '未知错误';
      setError(`生成失败: ${errorMsg}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSave = () => {
    if (generatedImage) {
      const link = document.createElement('a');
      link.href = generatedImage;
      link.download = `xh-art-${Date.now()}.png`;
      link.click();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">AI绘画生成</h1>
          <p className="text-gray-500 text-sm mt-1 dark:text-gray-400">选择角色、动作、场景和风格</p>
        </div>

        {isLoadingOptions ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="md" text="加载选项中..." />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              {categories.map((category) => (
                <div key={category.id} className="bg-white border border-gray-100 rounded-md p-4 dark:bg-gray-800 dark:border-gray-700">
                  <div className="flex items-center gap-2 mb-3">
                    <h3 className="font-medium text-gray-900 dark:text-white">{category.category_name}</h3>
                    {category.must === '1' && (
                      <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full dark:bg-gray-700 dark:text-gray-300">必选</span>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {category.creation_description_options.map((option) => (
                      <button
                        key={option.id}
                        onClick={() => handleCategorySelect(category.category_name, option.rule)}
                        className={`px-3 py-1.5 rounded-md text-sm transition-colors ${
                          selectedRules[category.category_name] === option.rule
                            ? 'bg-gray-900 text-white dark:bg-white dark:text-gray-900'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                        }`}
                      >
                        {option.description}
                      </button>
                    ))}
                  </div>
                </div>
              ))}

              <div className="bg-white border border-gray-100 rounded-md p-4 dark:bg-gray-800 dark:border-gray-700">
                <h3 className="font-medium text-gray-900 dark:text-white mb-3">选择风格</h3>
                <div className="flex flex-wrap gap-2">
                  {styles.map((style) => (
                    <button
                      key={style.id}
                      onClick={() => setSelectedStyleId(style.id)}
                      className={`px-3 py-1.5 rounded-md text-sm transition-colors ${
                        selectedStyleId === style.id
                          ? 'bg-gray-900 text-white dark:bg-white dark:text-gray-900'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                      }`}
                    >
                      {style.name}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={handleGenerate}
                disabled={isGenerating}
                className="w-full btn-primary flex items-center justify-center gap-2 py-3"
              >
                {isGenerating ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin dark:border-gray-900 dark:border-t-transparent" />
                    <span>生成中...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>开始生成</span>
                  </>
                )}
              </button>

              {error && (
                <div className="p-3 bg-red-50 border border-red-100 rounded-md text-red-600 text-sm dark:bg-red-900/20 dark:border-red-800 dark:text-red-400">
                  {error}
                </div>
              )}
            </div>

            <div className="bg-white border border-gray-100 rounded-md p-4 dark:bg-gray-800 dark:border-gray-700">
              <h3 className="font-medium text-gray-900 dark:text-white mb-3">预览</h3>
              
              {generatedImage ? (
                <div className="space-y-3">
                  <div className="aspect-square rounded-md overflow-hidden bg-gray-50 dark:bg-gray-900">
                    <img
                      src={generatedImage}
                      alt="生成的绘画"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={handleSave}
                      className="flex-1 btn-primary flex items-center justify-center gap-2"
                    >
                      <Image className="w-4 h-4" />
                      <span>保存图片</span>
                    </button>
                    <button
                      onClick={() => setGeneratedImage(null)}
                      className="flex-1 btn-secondary"
                    >
                      重新生成
                    </button>
                  </div>
                </div>
              ) : isGenerating ? (
                <div className="aspect-square rounded-md bg-gray-50 flex flex-col items-center justify-center dark:bg-gray-900">
                  <LoadingSpinner size="md" text="AI正在创作中..." />
                </div>
              ) : (
                <div className="aspect-square rounded-md bg-gray-50 flex flex-col items-center justify-center dark:bg-gray-900">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-3 dark:bg-gray-700">
                    <Sparkles className="w-8 h-8 text-gray-400 dark:text-gray-500" />
                  </div>
                  <p className="text-gray-500 text-sm text-center dark:text-gray-400">
                    选择角色、动作、场景和风格后<br />点击生成按钮开始创作
                  </p>
                </div>
              )}

              {Object.keys(selectedRules).length > 0 && selectedStyleId && !generatedImage && (
                <div className="mt-4 p-3 bg-gray-50 rounded-md dark:bg-gray-900">
                  <h4 className="text-xs font-medium text-gray-500 mb-2 dark:text-gray-400">生成参数</h4>
                  <div className="space-y-1">
                    {categories.map((category) => {
                      const selectedRule = selectedRules[category.category_name];
                      const option = category.creation_description_options.find(
                        (o) => o.rule === selectedRule
                      );
                      return (
                        <div key={category.id} className="text-xs">
                          <span className="text-gray-400 dark:text-gray-500">{category.category_name}：</span>
                          <span className="text-gray-700 dark:text-gray-300">{option?.description || '未选择'}</span>
                        </div>
                      );
                    })}
                    <div className="text-xs">
                      <span className="text-gray-400 dark:text-gray-500">风格：</span>
                      <span className="text-gray-700 dark:text-gray-300">
                        {styles.find((s) => s.id === selectedStyleId)?.name}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {showCardExhaustedModal && (
        <CardExhaustedModal
          onClose={() => setShowCardExhaustedModal(false)}
          onResetAccount={handleResetAccount}
        />
      )}
    </div>
  );
}

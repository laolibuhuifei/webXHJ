import { useNavigate } from 'react-router-dom';
import { Brush, User, LogIn, Sun, Moon } from 'lucide-react';
import { useUserStore } from '../store/userStore';
import { useTheme } from '../hooks/useTheme';
import { authApi } from '../utils/api';

export function Header() {
  const navigate = useNavigate();
  const { user, isLoggedIn, setUser } = useUserStore();
  const { theme, toggleTheme } = useTheme();

  const handleLogin = async () => {
    try {
      const openid = `test_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
      const response = await authApi.login(openid, 'dw');
      if (response.code === 200 && response.data) {
        setUser({
          id: response.data.user_id,
          username: response.data.username,
          avatar_img: response.data.avatar_img,
          art_star_count: 0,
          user_type: 'guest',
          is_vip: false,
        });
      }
    } catch (error) {
      console.error('登录失败:', error);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-sm border-b border-gray-100 dark:bg-gray-900/80 dark:border-gray-800">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
            <Brush className="w-6 h-6 text-gray-900 dark:text-white" />
            <span className="text-lg font-semibold text-gray-900 dark:text-white">小画家网页版</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/create')}
              className="btn-primary text-sm"
            >
              <Brush className="w-4 h-4 inline mr-2" />
              生成
            </button>

            <button
              onClick={toggleTheme}
              className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:text-gray-900 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-700"
              aria-label={theme === 'dark' ? '切换到浅色模式' : '切换到暗色模式'}
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4" />
              ) : (
                <Moon className="w-4 h-4" />
              )}
            </button>

            {isLoggedIn ? (
              <button
                onClick={() => navigate(`/user/${user?.id}`)}
                className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center dark:bg-gray-700"
              >
                <User className="w-4 h-4 text-gray-600 dark:text-gray-300" />
              </button>
            ) : (
              <button
                onClick={handleLogin}
                className="btn-secondary text-sm"
              >
                <LogIn className="w-4 h-4 inline mr-2" />
                登录
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

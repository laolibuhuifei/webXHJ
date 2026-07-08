import { AlertCircle, RefreshCw, LogOut } from 'lucide-react';

interface CardExhaustedModalProps {
  onClose: () => void;
  onResetAccount: () => void;
}

export function CardExhaustedModal({ onClose, onResetAccount }: CardExhaustedModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative bg-white rounded-lg shadow-xl w-full max-w-md p-6 dark:bg-gray-800">
        <div className="flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mb-4 dark:bg-yellow-900/30">
            <AlertCircle className="w-8 h-8 text-yellow-600 dark:text-yellow-500" />
          </div>
          
          <h3 className="text-xl font-semibold text-gray-900 mb-2 dark:text-white">画卡已用完</h3>
          <p className="text-gray-500 mb-6 dark:text-gray-400">
            今日画卡已全部用完，请选择以下操作：
          </p>
          
          <div className="flex flex-col gap-3 w-full">
            <button
              onClick={onResetAccount}
              className="w-full py-3 px-4 bg-gray-900 text-white rounded-md font-medium flex items-center justify-center gap-2 hover:bg-gray-800 transition-colors dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100"
            >
              <RefreshCw className="w-4 h-4" />
              <span>删除账号并重新注册</span>
            </button>
            
            <button
              onClick={onClose}
              className="w-full py-3 px-4 bg-gray-100 text-gray-700 rounded-md font-medium flex items-center justify-center gap-2 hover:bg-gray-200 transition-colors dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
            >
              <LogOut className="w-4 h-4" />
              <span>明天再来</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

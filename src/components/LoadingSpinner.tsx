interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
}

export function LoadingSpinner({ size = 'md', text }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-5 h-5 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4',
  };

  return (
    <div className="flex flex-col items-center justify-center gap-3">
      <div className={`${sizeClasses[size]} border-gray-200 border-t-gray-900 rounded-full animate-spin dark:border-gray-700 dark:border-t-white`} />
      {text && (
        <p className="text-gray-500 text-sm dark:text-gray-400">{text}</p>
      )}
    </div>
  );
}

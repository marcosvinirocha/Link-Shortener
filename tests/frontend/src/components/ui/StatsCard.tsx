import React from 'react';
import { cn } from '@/lib/utils';

interface StatsCardProps {
  label: string;
  value: string | number;
  icon?: React.ReactNode;
  className?: string;
}

export const StatsCard: React.FC<StatsCardProps> = ({
  label,
  value,
  icon,
  className,
}) => {
  return (
    <div className={cn(
      'bg-white rounded-xl border border-gray-200 p-6 shadow-sm',
      className
    )}>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-500">{label}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
        </div>
        {icon && (
          <div className="p-3 bg-indigo-50 rounded-lg">
            {icon}
          </div>
        )}
      </div>
    </div>
  );
};

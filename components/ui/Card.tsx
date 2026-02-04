'use client';

import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  title?: string;
  subtitle?: string;
  icon?: ReactNode;
}

export function Card({ children, className = '', title, subtitle, icon }: CardProps) {
  return (
    <div className={`bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-4 sm:p-6 ${className}`}>
      {(title || icon) && (
        <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
          {icon && <div className="text-emerald-500 flex-shrink-0">{icon}</div>}
          <div className="min-w-0">
            {title && <h3 className="text-base sm:text-lg font-semibold text-white truncate">{title}</h3>}
            {subtitle && <p className="text-xs sm:text-sm text-gray-400 truncate">{subtitle}</p>}
          </div>
        </div>
      )}
      {children}
    </div>
  );
}

interface StatCardProps {
  title: string;
  value: string | number;
  icon?: ReactNode;
  trend?: { value: number; isPositive: boolean };
  className?: string;
}

export function StatCard({ title, value, icon, trend, className = '' }: StatCardProps) {
  return (
    <div className={`bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-sm border border-gray-700/50 rounded-xl p-4 sm:p-6 ${className}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-xs sm:text-sm text-gray-400 mb-1 truncate">{title}</p>
          <p className="text-2xl sm:text-3xl font-bold text-white">{value.toLocaleString()}</p>
          {trend && (
            <p className={`text-xs sm:text-sm mt-2 ${trend.isPositive ? 'text-emerald-400' : 'text-red-400'}`}>
              {trend.isPositive ? '↑' : '↓'} {trend.value}%
            </p>
          )}
        </div>
        {icon && (
          <div className="p-2 sm:p-3 bg-emerald-500/10 rounded-lg text-emerald-500 flex-shrink-0">
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}

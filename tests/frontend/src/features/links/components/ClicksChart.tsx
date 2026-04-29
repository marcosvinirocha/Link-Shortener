import React, { memo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import type { Link } from '@/types/links';

interface ClicksChartProps {
  links: Link[];
  isLoading?: boolean;
}

interface ChartData {
  shortCode: string;
  clickCount: number;
  originalUrl: string;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    payload: ChartData;
  }>;
}

const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-200">
        <p className="text-xs text-gray-500 mb-1">ShortCode: <span className="font-medium text-gray-900">{data.shortCode}</span></p>
        <p className="font-semibold text-gray-900">{data.clickCount} cliques</p>
        <p className="text-xs text-gray-400 mt-2 max-w-[250px] break-all">
          {data.originalUrl}
        </p>
      </div>
    );
  }
  return null;
};

const EmptyState: React.FC = () => (
  <div className="h-80 flex items-center justify-center bg-gray-50 rounded-xl border border-gray-200">
    <div className="text-center">
      <div className="flex justify-center mb-4">
        <div className="p-4 bg-gray-100 rounded-full">
          <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        </div>
      </div>
      <h3 className="text-lg font-medium text-gray-900">Nenhum dado disponível</h3>
      <p className="text-gray-500 mt-1">Crie links para ver a performance aqui</p>
    </div>
  </div>
);

const LoadingSkeleton: React.FC = () => (
  <div className="bg-white rounded-xl border border-gray-200 p-6">
    <div className="h-6 bg-gray-200 rounded w-40 mb-6 animate-pulse"></div>
    <div className="h-80 bg-gray-100 rounded-xl animate-pulse"></div>
  </div>
);

export const ClicksChart: React.FC<ClicksChartProps> = memo(({ links, isLoading }) => {
  if (isLoading) {
    return <LoadingSkeleton />;
  }

  if (links.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Cliques por Link
        </h3>
        <EmptyState />
      </div>
    );
  }

  const chartData: ChartData[] = links.map((link) => ({
    shortCode: link.shortCode,
    clickCount: link.clickCount,
    originalUrl: link.originalUrl,
  }));

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Cliques por Link
      </h3>
      <ResponsiveContainer width="100%" height={320}>
        <BarChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
          <XAxis 
            dataKey="shortCode" 
            tick={{ fill: '#6b7280', fontSize: 12 }}
            tickLine={false}
            axisLine={{ stroke: '#e5e7eb' }}
          />
          <YAxis 
            tick={{ fill: '#6b7280', fontSize: 12 }}
            tickLine={false}
            axisLine={false}
            allowDecimals={false}
          />
          <Tooltip 
            content={<CustomTooltip />}
            cursor={{ fill: '#f3f4f6' }}
          />
          <Bar dataKey="clickCount" radius={[6, 6, 0, 0]} maxBarSize={60}>
            {chartData.map((_, index) => (
              <Cell key={`cell-${index}`} fill="#6366f1" />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
});

ClicksChart.displayName = 'ClicksChart';

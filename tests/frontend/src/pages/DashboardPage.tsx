import React, { useState, useEffect, useCallback } from 'react';
import { DashboardLayout } from '@/components/layout';
import { useAuth } from '@/features/auth';
import { StatsCard } from '@/components/ui/StatsCard';
import { ClicksChart } from '@/features/links/components/ClicksChart';
import { linksService } from '@/features/links/services/links.service';
import type { Link, Pagination, LinksResponse } from '@/types/links';

const LinkIcon = () => (
  <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
  </svg>
);

const CursorClickIcon = () => (
  <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
  </svg>
);

export const DashboardPage: React.FC = () => {
  const { user, logout } = useAuth();
  const [links, setLinks] = useState<Link[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [pagination, setPagination] = useState<Pagination | null>(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const response: LinksResponse = await linksService.getLinks(1, 10);
      setLinks(response.data);
      setPagination(response.pagination);
    } catch {
      setLinks([]);
      setPagination(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const totalLinks = pagination?.total || 0;
  const totalClicks = links.reduce((acc, link) => acc + link.clickCount, 0);

  return (
    <DashboardLayout
      title="Dashboard"
      userName={user?.name || 'Usuário'}
      onLogout={logout}
    >
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <StatsCard
            label="Total de Links"
            value={totalLinks}
            icon={<LinkIcon />}
          />
          <StatsCard
            label="Total de Cliques"
            value={totalClicks.toLocaleString('pt-BR')}
            icon={<CursorClickIcon />}
          />
        </div>

        <ClicksChart links={links} isLoading={isLoading} />
      </div>
    </DashboardLayout>
  );
};

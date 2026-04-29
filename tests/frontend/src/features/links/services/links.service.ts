import { api } from '@/lib/api';
import type { Link, LinksResponse } from '@/types/links';

export const linksService = {
  async getLinks(page: number = 1, limit: number = 10): Promise<LinksResponse> {
    const response = await api.get<LinksResponse>('/links', {
      params: { page, limit },
    });
    return response.data;
  },

  async createLink(url: string): Promise<Link> {
    const response = await api.post<{ data: Link }>('/links', { url });
    return response.data.data;
  },

  async deleteLink(linkId: string): Promise<void> {
    await api.delete(`/links/${linkId}`);
  },
};

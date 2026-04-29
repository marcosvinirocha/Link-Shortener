import RedisClient from "../config/redis";
import {
  ILinkRepository,
  LinkRepository,
} from "../repositories/link.repository";
import { LinkNotFoundError } from "../errors/link.errors";

const CACHE_TTL_SECONDS = 3600;
const CACHE_KEY_PREFIX = "link:";

export interface RedirectResult {
  originalUrl: string;
}

export interface CachedLink {
  id: string;
  originalUrl: string;
}

export interface IRedirectService {
  redirect(
    shortCode: string,
    ipAddress?: string | string[],
    userAgent?: string,
  ): Promise<RedirectResult>;
}

export class RedirectService implements IRedirectService {
  constructor(private readonly repository: ILinkRepository) {}

  async redirect(
    shortCode: string,
    ipAddress?: string | string[],
    userAgent?: string,
  ): Promise<RedirectResult> {
    const cached = await this.getFromCache(shortCode);
    let link: CachedLink;

    if (cached) {
      link = cached;
    } else {
      const dbLink = await this.repository.findByShortCode(shortCode);

      if (!dbLink) {
        throw new LinkNotFoundError(shortCode);
      }

      link = {
        id: dbLink.id,
        originalUrl: dbLink.originalUrl,
      };

      await this.saveToCache(shortCode, link);
    }

    const normalizedIp = this.normalizeIp(ipAddress);
    await this.registerClick(link.id, normalizedIp, userAgent);

    return {
      originalUrl: link.originalUrl,
    };
  }

  private normalizeIp(ip?: string | string[]): string | undefined {
    if (!ip) return undefined;
    if (Array.isArray(ip)) return ip[0];
    return ip;
  }

  private async getFromCache(shortCode: string): Promise<CachedLink | null> {
    try {
      const cached = await RedisClient.get(`${CACHE_KEY_PREFIX}${shortCode}`);
      if (cached) {
        return JSON.parse(cached) as CachedLink;
      }
      return null;
    } catch {
      return null;
    }
  }

  private async saveToCache(
    shortCode: string,
    link: CachedLink,
  ): Promise<void> {
    try {
      await RedisClient.set(
        `${CACHE_KEY_PREFIX}${shortCode}`,
        JSON.stringify(link),
        CACHE_TTL_SECONDS,
      );
    } catch {
      // Silently fail if Redis is unavailable
    }
  }

  private async registerClick(
    linkId: string,
    ipAddress?: string,
    userAgent?: string,
  ): Promise<void> {
    try {
      await this.repository.createClick({
        linkId,
        ipAddress: ipAddress || undefined,
        userAgent: userAgent || undefined,
      });
    } catch {
      // Don't fail redirect if click registration fails
    }
  }
}

export const redirectService = new RedirectService(new LinkRepository());

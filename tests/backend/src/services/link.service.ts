import {
  ILinkRepository,
  LinkRepository,
} from "../repositories/link.repository";
import {
  LinkNotFoundError,
  LinkAccessDeniedError,
} from "../errors/link.errors";
import { CreateLinkDTO } from "../dto/link/create-link.dto";
import { PaginationDTO } from "../dto/link/pagination.dto";
import {
  LinkResponse,
  LinkListResponse,
  LinkStats,
  ClickStats,
} from "../types/link.types";
import Environment from "../config/env";

const SHORT_CODE_CHARS =
  "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
const SHORT_CODE_LENGTH = 6;

export interface ILinkService {
  createLink(userId: string, dto: CreateLinkDTO): Promise<LinkResponse>;
  listLinks(
    userId: string,
    pagination: PaginationDTO,
  ): Promise<LinkListResponse>;
  getStatsByShortCode(userId: string, shortCode: string): Promise<LinkStats>;
  deleteLink(userId: string, linkId: string): Promise<void>;
}

export class LinkService implements ILinkService {
  constructor(private readonly repository: ILinkRepository) {}

  async createLink(userId: string, dto: CreateLinkDTO): Promise<LinkResponse> {
    const shortCode = await this.generateUniqueShortCode();

    const link = await this.repository.create({
      userId,
      originalUrl: dto.url,
      shortCode,
    });

    const baseUrl = Environment.get("BASE_URL");

    return {
      id: link.id,
      shortCode: link.shortCode,
      originalUrl: link.originalUrl,
      shortUrl: `${baseUrl}/${link.shortCode}`,
      createdAt: link.createdAt,
    };
  }

  async listLinks(
    userId: string,
    pagination: PaginationDTO,
  ): Promise<LinkListResponse> {
    const { links, total } = await this.repository.findByUserIdPaginated(
      userId,
      pagination.page,
      pagination.limit,
    );

    const baseUrl = Environment.get("BASE_URL");

    const data = links.map((link) => ({
      id: link.id,
      shortCode: link.shortCode,
      originalUrl: link.originalUrl,
      shortUrl: `${baseUrl}/${link.shortCode}`,
      createdAt: link.createdAt,
      clickCount: link._count.clicks,
    }));

    return {
      data,
      pagination: {
        page: pagination.page,
        limit: pagination.limit,
        total,
        totalPages: Math.ceil(total / pagination.limit),
      },
    };
  }

  async getStatsByShortCode(
    userId: string,
    shortCode: string,
  ): Promise<LinkStats> {
    const link = await this.repository.findByShortCode(shortCode);

    if (!link) {
      throw new LinkNotFoundError(shortCode);
    }

    if (link.userId !== userId) {
      throw new LinkAccessDeniedError();
    }

    const [totalClicks, dailyClicksRaw] = await Promise.all([
      this.repository.getTotalClicks(link.id),
      this.repository.getDailyClicks(link.id, 7),
    ]);

    const dailyClicks: ClickStats[] = dailyClicksRaw.map((item) => ({
      date: item.date.toISOString().split("T")[0],
      count: item.count,
    }));

    return {
      totalClicks,
      dailyClicks,
    };
  }

  async deleteLink(userId: string, linkId: string): Promise<void> {
    const link = await this.repository.findById(linkId);

    if (!link) {
      throw new LinkNotFoundError(linkId);
    }

    if (link.userId !== userId) {
      throw new LinkAccessDeniedError();
    }

    await this.repository.delete(linkId);
  }

  private async generateUniqueShortCode(): Promise<string> {
    const maxAttempts = 10;

    for (let i = 0; i < maxAttempts; i++) {
      const code = this.generateRandomCode();
      const existing = await this.repository.findByShortCode(code);

      if (!existing) {
        return code;
      }
    }

    throw new Error("Failed to generate unique short code");
  }

  private generateRandomCode(): string {
    let code = "";
    for (let i = 0; i < SHORT_CODE_LENGTH; i++) {
      const randomIndex = Math.floor(Math.random() * SHORT_CODE_CHARS.length);
      code += SHORT_CODE_CHARS[randomIndex];
    }
    return code;
  }
}

export const linkService = new LinkService(new LinkRepository());

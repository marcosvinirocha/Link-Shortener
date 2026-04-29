import Database from "../config/database";
import { Link, Click } from "@prisma/client";

export interface LinkWithClickCount extends Link {
  _count: {
    clicks: number;
  };
}

export interface DailyClickCount {
  date: Date;
  count: number;
}

export interface ILinkRepository {
  findById(id: string): Promise<Link | null>;
  findByShortCode(shortCode: string): Promise<Link | null>;
  findByUserIdPaginated(
    userId: string,
    page: number,
    limit: number,
  ): Promise<{ links: LinkWithClickCount[]; total: number }>;
  create(data: {
    userId: string;
    originalUrl: string;
    shortCode: string;
  }): Promise<Link>;
  delete(id: string): Promise<void>;
  createClick(data: {
    linkId: string;
    ipAddress?: string;
    userAgent?: string;
  }): Promise<Click>;
  getTotalClicks(linkId: string): Promise<number>;
  getDailyClicks(linkId: string, days: number): Promise<DailyClickCount[]>;
}

export class LinkRepository implements ILinkRepository {
  private get db() {
    return Database.getInstance();
  }

  async findById(id: string): Promise<Link | null> {
    return this.db.link.findUnique({
      where: { id },
    });
  }

  async findByShortCode(shortCode: string): Promise<Link | null> {
    return this.db.link.findUnique({
      where: { shortCode },
    });
  }

  async findByUserIdPaginated(
    userId: string,
    page: number,
    limit: number,
  ): Promise<{ links: LinkWithClickCount[]; total: number }> {
    const [links, total] = await Promise.all([
      this.db.link.findMany({
        where: { userId },
        include: {
          _count: {
            select: { clicks: true },
          },
        },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.db.link.count({ where: { userId } }),
    ]);

    return { links, total };
  }

  async create(data: {
    userId: string;
    originalUrl: string;
    shortCode: string;
  }): Promise<Link> {
    return this.db.link.create({
      data,
    });
  }

  async delete(id: string): Promise<void> {
    await this.db.$transaction([
      this.db.click.deleteMany({ where: { linkId: id } }),
      this.db.link.delete({ where: { id } }),
    ]);
  }

  async createClick(data: {
    linkId: string;
    ipAddress?: string;
    userAgent?: string;
  }): Promise<Click> {
    return this.db.click.create({
      data: {
        linkId: data.linkId,
        ipAddress: data.ipAddress,
        userAgent: data.userAgent,
      },
    });
  }

  async getTotalClicks(linkId: string): Promise<number> {
    const result = await this.db.click.count({ where: { linkId } });
    return result;
  }

  async getDailyClicks(
    linkId: string,
    days: number,
  ): Promise<DailyClickCount[]> {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days + 1);
    startDate.setHours(0, 0, 0, 0);

    const clicks = await this.db.click.groupBy({
      by: ["clickedAt"],
      where: {
        linkId,
        clickedAt: {
          gte: startDate,
        },
      },
      _count: true,
    });

    const dailyMap = new Map<string, number>();

    for (let i = 0; i < days; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const key = date.toISOString().split("T")[0];
      dailyMap.set(key, 0);
    }

    clicks.forEach((click) => {
      const key = click.clickedAt.toISOString().split("T")[0];
      if (dailyMap.has(key)) {
        dailyMap.set(key, dailyMap.get(key)! + click._count);
      }
    });

    const result: DailyClickCount[] = [];
    dailyMap.forEach((count, date) => {
      result.push({ date: new Date(date), count });
    });

    return result.sort((a, b) => a.date.getTime() - b.date.getTime());
  }
}

export const linkRepository = new LinkRepository();

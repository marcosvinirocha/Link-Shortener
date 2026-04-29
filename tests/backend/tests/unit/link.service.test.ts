import { CreateLinkDTO } from "../../src/dto/link/create-link.dto";
import { PaginationDTO } from "../../src/dto/link/pagination.dto";
import {
  LinkNotFoundError,
  LinkAccessDeniedError,
} from "../../src/errors/link.errors";

jest.mock("../../src/config/env", () => ({
  __esModule: true,
  default: {
    get: jest.fn((key: string) => {
      if (key === "BASE_URL") return "http://localhost:3001";
      return undefined;
    }),
  },
}));

import { LinkService } from "../../src/services/link.service";
import { ILinkRepository } from "../../src/repositories/link.repository";

describe("LinkService", () => {
  let linkService: LinkService;
  let mockRepository: jest.Mocked<ILinkRepository>;

  const mockLink = {
    id: "link-123",
    userId: "user-123",
    originalUrl: "https://example.com",
    shortCode: "abc123",
    createdAt: new Date("2024-01-01"),
  };

  beforeEach(() => {
    mockRepository = {
      findById: jest.fn(),
      findByShortCode: jest.fn(),
      findByUserIdPaginated: jest.fn(),
      create: jest.fn(),
      delete: jest.fn(),
      createClick: jest.fn(),
      getTotalClicks: jest.fn(),
      getDailyClicks: jest.fn(),
    };
    linkService = new LinkService(mockRepository);
    jest.clearAllMocks();
  });

  describe("createLink", () => {
    const createLinkDto: CreateLinkDTO = { url: "https://example.com" };

    it("should create link successfully", async () => {
      mockRepository.findByShortCode.mockResolvedValue(null);
      mockRepository.create.mockResolvedValue(mockLink);

      const result = await linkService.createLink("user-123", createLinkDto);

      expect(result).toEqual({
        id: mockLink.id,
        shortCode: mockLink.shortCode,
        originalUrl: mockLink.originalUrl,
        shortUrl: "http://localhost:3001/abc123",
        createdAt: mockLink.createdAt,
      });
      expect(mockRepository.create).toHaveBeenCalledWith({
        userId: "user-123",
        originalUrl: "https://example.com",
        shortCode: expect.any(String),
      });
    });

    it("should generate unique short code", async () => {
      mockRepository.findByShortCode
        .mockResolvedValueOnce({} as never)
        .mockResolvedValueOnce(null);
      mockRepository.create.mockResolvedValue(mockLink);

      await linkService.createLink("user-123", createLinkDto);

      expect(mockRepository.findByShortCode).toHaveBeenCalledTimes(2);
    });
  });

  describe("listLinks", () => {
    const paginationDto: PaginationDTO = { page: 1, limit: 10 };

    it("should return paginated links for user", async () => {
      const mockLinksWithCount = [{ ...mockLink, _count: { clicks: 5 } }];
      mockRepository.findByUserIdPaginated.mockResolvedValue({
        links: mockLinksWithCount,
        total: 1,
      });

      const result = await linkService.listLinks("user-123", paginationDto);

      expect(result).toEqual({
        data: [
          {
            id: mockLink.id,
            shortCode: mockLink.shortCode,
            originalUrl: mockLink.originalUrl,
            shortUrl: "http://localhost:3001/abc123",
            createdAt: mockLink.createdAt,
            clickCount: 5,
          },
        ],
        pagination: {
          page: 1,
          limit: 10,
          total: 1,
          totalPages: 1,
        },
      });
    });
  });

  describe("getStatsByShortCode", () => {
    it("should return stats for users link", async () => {
      mockRepository.findByShortCode.mockResolvedValue(mockLink);
      mockRepository.getTotalClicks.mockResolvedValue(10);
      mockRepository.getDailyClicks.mockResolvedValue([
        { date: new Date("2024-01-01"), count: 5 },
        { date: new Date("2024-01-02"), count: 3 },
      ]);

      const result = await linkService.getStatsByShortCode(
        "user-123",
        "abc123",
      );

      expect(result).toEqual({
        totalClicks: 10,
        dailyClicks: [
          { date: "2024-01-01", count: 5 },
          { date: "2024-01-02", count: 3 },
        ],
      });
    });

    it("should throw LinkNotFoundError when link does not exist", async () => {
      mockRepository.findByShortCode.mockResolvedValue(null);

      await expect(
        linkService.getStatsByShortCode("user-123", "non-existent"),
      ).rejects.toThrow(LinkNotFoundError);
    });

    it("should throw LinkAccessDeniedError when user does not own link", async () => {
      mockRepository.findByShortCode.mockResolvedValue(mockLink);

      await expect(
        linkService.getStatsByShortCode("other-user", "abc123"),
      ).rejects.toThrow(LinkAccessDeniedError);
    });
  });

  describe("deleteLink", () => {
    it("should delete link successfully", async () => {
      mockRepository.findById.mockResolvedValue(mockLink);
      mockRepository.delete.mockResolvedValue(undefined);

      await expect(
        linkService.deleteLink("user-123", "link-123"),
      ).resolves.toBeUndefined();
      expect(mockRepository.delete).toHaveBeenCalledWith("link-123");
    });

    it("should throw LinkNotFoundError when link does not exist", async () => {
      mockRepository.findById.mockResolvedValue(null);

      await expect(
        linkService.deleteLink("user-123", "non-existent"),
      ).rejects.toThrow(LinkNotFoundError);
    });

    it("should throw LinkAccessDeniedError when user does not own link", async () => {
      mockRepository.findById.mockResolvedValue(mockLink);

      await expect(
        linkService.deleteLink("other-user", "link-123"),
      ).rejects.toThrow(LinkAccessDeniedError);
    });
  });
});

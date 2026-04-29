import { LinkNotFoundError } from "../../src/errors/link.errors";

const mockRedisGet = jest.fn();
const mockRedisSet = jest.fn();

jest.mock("../../src/config/redis", () => ({
  __esModule: true,
  default: {
    get: mockRedisGet,
    set: mockRedisSet,
  },
}));

import { RedirectService } from "../../src/services/redirect.service";
import { ILinkRepository } from "../../src/repositories/link.repository";

describe("RedirectService", () => {
  let redirectService: RedirectService;
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
    redirectService = new RedirectService(mockRepository);
    jest.clearAllMocks();
  });

  describe("redirect", () => {
    it("should redirect from cache and register click", async () => {
      const cachedData = JSON.stringify({
        id: mockLink.id,
        originalUrl: mockLink.originalUrl,
      });
      mockRedisGet.mockResolvedValue(cachedData);
      mockRepository.createClick.mockResolvedValue({} as never);

      const result = await redirectService.redirect(
        "abc123",
        "192.168.1.1",
        "Mozilla/5.0",
      );

      expect(result).toEqual({ originalUrl: mockLink.originalUrl });
      expect(mockRedisGet).toHaveBeenCalledWith("link:abc123");
      expect(mockRepository.findByShortCode).not.toHaveBeenCalled();
      expect(mockRepository.createClick).toHaveBeenCalledWith({
        linkId: "link-123",
        ipAddress: "192.168.1.1",
        userAgent: "Mozilla/5.0",
      });
    });

    it("should redirect from database and cache result", async () => {
      mockRedisGet.mockResolvedValue(null);
      mockRepository.findByShortCode.mockResolvedValue(mockLink);
      mockRepository.createClick.mockResolvedValue({} as never);

      const result = await redirectService.redirect("abc123");

      expect(result).toEqual({ originalUrl: mockLink.originalUrl });
      expect(mockRedisGet).toHaveBeenCalledWith("link:abc123");
      expect(mockRepository.findByShortCode).toHaveBeenCalledWith("abc123");
      expect(mockRedisSet).toHaveBeenCalledWith(
        "link:abc123",
        JSON.stringify({ id: mockLink.id, originalUrl: mockLink.originalUrl }),
        3600,
      );
      expect(mockRepository.createClick).toHaveBeenCalled();
    });

    it("should throw LinkNotFoundError for non-existent shortCode", async () => {
      mockRedisGet.mockResolvedValue(null);
      mockRepository.findByShortCode.mockResolvedValue(null);

      await expect(redirectService.redirect("nonexistent")).rejects.toThrow(
        LinkNotFoundError,
      );
      expect(mockRepository.createClick).not.toHaveBeenCalled();
    });

    it("should handle missing ipAddress and userAgent gracefully", async () => {
      mockRedisGet.mockResolvedValue(null);
      mockRepository.findByShortCode.mockResolvedValue(mockLink);
      mockRepository.createClick.mockResolvedValue({} as never);

      const result = await redirectService.redirect("abc123");

      expect(result).toEqual({ originalUrl: mockLink.originalUrl });
      expect(mockRepository.createClick).toHaveBeenCalledWith({
        linkId: "link-123",
        ipAddress: undefined,
        userAgent: undefined,
      });
    });

    it("should handle array ipAddress", async () => {
      const cachedData = JSON.stringify({
        id: mockLink.id,
        originalUrl: mockLink.originalUrl,
      });
      mockRedisGet.mockResolvedValue(cachedData);
      mockRepository.createClick.mockResolvedValue({} as never);

      await redirectService.redirect(
        "abc123",
        ["192.168.1.1", "192.168.1.2"],
        "Mozilla/5.0",
      );

      expect(mockRepository.createClick).toHaveBeenCalledWith({
        linkId: "link-123",
        ipAddress: "192.168.1.1",
        userAgent: "Mozilla/5.0",
      });
    });

    it("should not fail redirect if click registration fails", async () => {
      mockRedisGet.mockResolvedValue(null);
      mockRepository.findByShortCode.mockResolvedValue(mockLink);
      mockRepository.createClick.mockRejectedValue(new Error("DB error"));

      const result = await redirectService.redirect("abc123");

      expect(result).toEqual({ originalUrl: mockLink.originalUrl });
    });

    it("should not fail redirect if Redis get fails", async () => {
      mockRedisGet.mockRejectedValue(new Error("Redis error"));
      mockRepository.findByShortCode.mockResolvedValue(mockLink);
      mockRepository.createClick.mockResolvedValue({} as never);

      const result = await redirectService.redirect("abc123");

      expect(result).toEqual({ originalUrl: mockLink.originalUrl });
      expect(mockRepository.findByShortCode).toHaveBeenCalledWith("abc123");
    });
  });
});

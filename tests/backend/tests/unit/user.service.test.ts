import bcrypt from "bcryptjs";
import { UserService } from "../../src/services/user.service";
import { IUserRepository } from "../../src/repositories/user.repository";
import {
  EmailAlreadyExistsError,
  InvalidCredentialsError,
  UserNotFoundError,
} from "../../src/errors/user.errors";
import { CreateUserDTO } from "../../src/dto/user/create-user.dto";
import { LoginDTO } from "../../src/dto/user/login.dto";
import * as jwt from "jsonwebtoken";

jest.mock("bcryptjs");
jest.mock("jsonwebtoken");
jest.mock("../../src/config/env", () => ({
  __esModule: true,
  default: {
    get: jest.fn((key: string) => {
      if (key === "JWT_SECRET") return "test-secret-key";
      return undefined;
    }),
  },
}));

describe("UserService", () => {
  let userService: UserService;
  let mockRepository: jest.Mocked<IUserRepository>;

  const mockUser = {
    id: "user-123",
    name: "John Doe",
    email: "john@example.com",
    passwordHash: "hashedPassword",
    createdAt: new Date("2024-01-01"),
  };

  beforeEach(() => {
    mockRepository = {
      findByEmail: jest.fn(),
      findById: jest.fn(),
      create: jest.fn(),
    };
    userService = new UserService(mockRepository);
    jest.clearAllMocks();
  });

  describe("register", () => {
    const registerDto: CreateUserDTO = {
      name: "John Doe",
      email: "john@example.com",
      password: "password123",
    };

    it("should register a new user successfully", async () => {
      mockRepository.findByEmail.mockResolvedValue(null);
      (bcrypt.hash as jest.Mock).mockResolvedValue("hashedPassword");
      mockRepository.create.mockResolvedValue(mockUser);
      (jwt.sign as jest.Mock).mockReturnValue("mock-token");

      const result = await userService.register(registerDto);

      expect(mockRepository.findByEmail).toHaveBeenCalledWith(
        registerDto.email,
      );
      expect(bcrypt.hash).toHaveBeenCalledWith(registerDto.password, 12);
      expect(mockRepository.create).toHaveBeenCalledWith({
        name: registerDto.name,
        email: registerDto.email,
        passwordHash: "hashedPassword",
      });
      expect(result).toEqual({
        user: {
          id: mockUser.id,
          name: mockUser.name,
          email: mockUser.email,
          createdAt: mockUser.createdAt,
        },
        token: "mock-token",
      });
    });

    it("should throw EmailAlreadyExistsError when email is already registered", async () => {
      mockRepository.findByEmail.mockResolvedValue(mockUser);

      await expect(userService.register(registerDto)).rejects.toThrow(
        EmailAlreadyExistsError,
      );
      expect(mockRepository.create).not.toHaveBeenCalled();
    });
  });

  describe("login", () => {
    const loginDto: LoginDTO = {
      email: "john@example.com",
      password: "password123",
    };

    it("should login successfully with valid credentials", async () => {
      mockRepository.findByEmail.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      (jwt.sign as jest.Mock).mockReturnValue("mock-token");

      const result = await userService.login(loginDto);

      expect(mockRepository.findByEmail).toHaveBeenCalledWith(loginDto.email);
      expect(bcrypt.compare).toHaveBeenCalledWith(
        loginDto.password,
        mockUser.passwordHash,
      );
      expect(result).toEqual({
        user: {
          id: mockUser.id,
          name: mockUser.name,
          email: mockUser.email,
          createdAt: mockUser.createdAt,
        },
        token: "mock-token",
      });
    });

    it("should throw InvalidCredentialsError when user not found", async () => {
      mockRepository.findByEmail.mockResolvedValue(null);

      await expect(userService.login(loginDto)).rejects.toThrow(
        InvalidCredentialsError,
      );
    });

    it("should throw InvalidCredentialsError when password is incorrect", async () => {
      mockRepository.findByEmail.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(userService.login(loginDto)).rejects.toThrow(
        InvalidCredentialsError,
      );
    });
  });

  describe("getProfile", () => {
    it("should return user profile successfully", async () => {
      mockRepository.findById.mockResolvedValue(mockUser);

      const result = await userService.getProfile(mockUser.id);

      expect(mockRepository.findById).toHaveBeenCalledWith(mockUser.id);
      expect(result).toEqual({
        id: mockUser.id,
        name: mockUser.name,
        email: mockUser.email,
        createdAt: mockUser.createdAt,
      });
    });

    it("should throw UserNotFoundError when user does not exist", async () => {
      mockRepository.findById.mockResolvedValue(null);

      await expect(userService.getProfile("non-existent-id")).rejects.toThrow(
        UserNotFoundError,
      );
    });
  });
});

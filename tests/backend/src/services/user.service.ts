import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import {
  IUserRepository,
  UserRepository,
} from "../repositories/user.repository";
import {
  EmailAlreadyExistsError,
  InvalidCredentialsError,
  UserNotFoundError,
} from "../errors/user.errors";
import { CreateUserDTO } from "../dto/user/create-user.dto";
import { LoginDTO } from "../dto/user/login.dto";
import { AuthResponse, UserResponse, JwtPayload } from "../types/user.types";
import Environment from "../config/env";

const BCRYPT_SALT_ROUNDS = 12;
const JWT_EXPIRES_IN = "7d";

export interface IUserService {
  register(dto: CreateUserDTO): Promise<AuthResponse>;
  login(dto: LoginDTO): Promise<AuthResponse>;
  getProfile(userId: string): Promise<UserResponse>;
}

export class UserService implements IUserService {
  constructor(private readonly repository: IUserRepository) {}

  async register(dto: CreateUserDTO): Promise<AuthResponse> {
    const existingUser = await this.repository.findByEmail(dto.email);
    if (existingUser) {
      throw new EmailAlreadyExistsError(dto.email);
    }

    const passwordHash = await bcrypt.hash(dto.password, BCRYPT_SALT_ROUNDS);

    const user = await this.repository.create({
      name: dto.name,
      email: dto.email,
      passwordHash,
    });

    const token = this.generateToken(user.id, user.email);

    return {
      user: this.toUserResponse(user),
      token,
    };
  }

  async login(dto: LoginDTO): Promise<AuthResponse> {
    const user = await this.repository.findByEmail(dto.email);
    if (!user) {
      throw new InvalidCredentialsError();
    }

    const isPasswordValid = await bcrypt.compare(
      dto.password,
      user.passwordHash,
    );
    if (!isPasswordValid) {
      throw new InvalidCredentialsError();
    }

    const token = this.generateToken(user.id, user.email);

    return {
      user: this.toUserResponse(user),
      token,
    };
  }

  async getProfile(userId: string): Promise<UserResponse> {
    const user = await this.repository.findById(userId);
    if (!user) {
      throw new UserNotFoundError(userId);
    }

    return this.toUserResponse(user);
  }

  private generateToken(userId: string, email: string): string {
    const secret = Environment.get("JWT_SECRET");
    const payload: JwtPayload = { id: userId, email };

    return jwt.sign(payload, secret, { expiresIn: JWT_EXPIRES_IN });
  }

  private toUserResponse(user: {
    id: string;
    name: string;
    email: string;
    createdAt: Date;
  }): UserResponse {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
    };
  }
}

export const userService = new UserService(new UserRepository());

import Database from "../config/database";
import { User } from "@prisma/client";

export interface IUserRepository {
  findByEmail(email: string): Promise<User | null>;
  findById(id: string): Promise<User | null>;
  create(data: {
    name: string;
    email: string;
    passwordHash: string;
  }): Promise<User>;
}

export class UserRepository implements IUserRepository {
  private get db() {
    return Database.getInstance();
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.db.user.findUnique({
      where: { email },
    });
  }

  async findById(id: string): Promise<User | null> {
    return this.db.user.findUnique({
      where: { id },
    });
  }

  async create(data: {
    name: string;
    email: string;
    passwordHash: string;
  }): Promise<User> {
    return this.db.user.create({
      data,
    });
  }
}

export const userRepository = new UserRepository();

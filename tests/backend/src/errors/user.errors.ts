import { ConflictError, UnauthorizedError, NotFoundError } from "./app-error";

export class EmailAlreadyExistsError extends ConflictError {
  constructor(email: string) {
    super(`Email ${email} is already registered`);
  }
}

export class InvalidCredentialsError extends UnauthorizedError {
  constructor() {
    super("Invalid email or password");
  }
}

export class UserNotFoundError extends NotFoundError {
  constructor(id?: string) {
    super(id ? `User with id ${id} not found` : "User not found");
  }
}

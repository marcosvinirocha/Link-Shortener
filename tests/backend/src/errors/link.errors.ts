import { NotFoundError, UnauthorizedError } from "./app-error";

export class LinkNotFoundError extends NotFoundError {
  constructor(identifier?: string) {
    super(identifier ? `Link not found: ${identifier}` : "Link not found");
  }
}

export class LinkAccessDeniedError extends UnauthorizedError {
  constructor() {
    super("You do not have permission to access this link");
  }
}

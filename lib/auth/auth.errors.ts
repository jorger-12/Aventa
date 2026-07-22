export class AuthError extends Error {
  readonly operation: string;
  readonly code: string;
  readonly cause?: unknown;

  constructor(
    message: string,
    operation: string,
    code = "AUTH_ERROR",
    cause?: unknown,
  ) {
    super(message);

    this.name = "AuthError";

    this.operation = operation;
    this.code = code;
    this.cause = cause;
  }
}

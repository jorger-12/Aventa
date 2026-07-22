export class ServiceError extends Error {
  readonly operation: string;
  readonly code: string;
  readonly cause?: unknown;

  constructor(
    message: string,
    operation: string,
    code = "SERVICE_ERROR",
    cause?: unknown,
  ) {
    super(message);

    this.name = "ServiceError";
    this.operation = operation;
    this.code = code;
    this.cause = cause;
  }
}

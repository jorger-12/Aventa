export class RepositoryError extends Error {
  readonly operation: string;
  readonly cause?: unknown;

  constructor(message: string, operation: string, cause?: unknown) {
    super(message);

    this.name = "RepositoryError";
    this.operation = operation;
    this.cause = cause;
  }
}

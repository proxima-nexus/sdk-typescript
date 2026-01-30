/**
 * Custom error classes for the enhanced SDK client.
 * Axios errors are transformed into these domain-specific errors.
 */

/**
 * Base class for enhanced client errors.
 */
export class EnhancedClientError extends Error {
  constructor(
    message: string,
    public readonly statusCode?: number,
    public readonly cause?: unknown
  ) {
    super(message);
    this.name = this.constructor.name;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

/**
 * Thrown when an entity is not found (HTTP 404).
 */
export class NotFoundError extends EnhancedClientError {
  constructor(
    message: string = 'Resource not found',
    statusCode: number = 404,
    cause?: unknown
  ) {
    super(message, statusCode, cause);
  }
}

/**
 * Thrown when the user lacks permission (HTTP 401 or 403).
 */
export class UnauthorizedError extends EnhancedClientError {
  constructor(
    message: string = 'Unauthorized',
    statusCode: number = 401,
    cause?: unknown
  ) {
    super(message, statusCode, cause);
  }
}

/**
 * Thrown for invalid parameters or validation failures (HTTP 400 or 422).
 */
export class ValidationError extends EnhancedClientError {
  constructor(
    message: string = 'Validation failed',
    statusCode?: number,
    cause?: unknown
  ) {
    super(message, statusCode, cause);
  }
}

/**
 * Transforms an axios error into an enhanced client error.
 */
export function transformAxiosError(error: unknown): never {
  if (error && typeof error === 'object' && 'isAxiosError' in error) {
    const axiosError = error as { response?: { status?: number; data?: unknown }; message?: string };
    const status = axiosError.response?.status;
    const message =
      typeof axiosError.response?.data === 'object' &&
      axiosError.response?.data !== null &&
      'message' in (axiosError.response.data as object)
        ? String((axiosError.response.data as { message: unknown }).message)
        : axiosError.message ?? 'Request failed';

    if (status === 404) {
      throw new NotFoundError(message, status, error);
    }
    if (status === 401 || status === 403) {
      throw new UnauthorizedError(message, status ?? 401, error);
    }
    if (status === 400 || status === 422) {
      throw new ValidationError(message, status, error);
    }
    throw new EnhancedClientError(message, status, error);
  }
  throw error;
}

/**
 * Unwraps an axios response and transforms errors.
 */
export async function unwrap<T>(promise: Promise<{ data: T }>): Promise<T> {
  try {
    const response = await promise;
    return response.data;
  } catch (error) {
    transformAxiosError(error);
    return undefined as never;
  }
}

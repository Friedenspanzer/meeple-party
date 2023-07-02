export interface ApiErrorMessage {
  success: false;
  reason: string;
}

type ErrorCode = 401 | 404 | 405 | 500;

export class ApiError {
  message: string;
  code: ErrorCode;
  constructor(reason: string, code: ErrorCode = 500) {
    this.message = reason;
    this.code = code;
  }
}

export class ApiErrorMethodUnknown extends ApiError {
  constructor() {
    super("Method not allowed", 405);
  }
}

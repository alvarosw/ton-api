type ExceptionOptions = {
  message?: string;
  statusCode?: number;
  internalErrorMessage?: string;
};

export class Exception extends Error {
  message: string;
  statusCode: number;
  errStack?: string[];
  errMessage?: string;

  constructor({ message, statusCode, internalErrorMessage }: ExceptionOptions) {
    super(message);
    this.message = message || 'Something went wrong';
    this.statusCode = statusCode || 500;

    if (process.env.STAGE === 'dev') {
      this.errStack = this.formatErrorStack();
      this.errMessage = internalErrorMessage;
    }
  }

  private formatErrorStack() {
    return this.stack
      ?.split('\n')
      .slice(1)
      .map((trace) => trace.trim());
  }
}

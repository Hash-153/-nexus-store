export class Result<T, E = string> {
  public readonly isSuccess: boolean;
  public readonly isFailure: boolean;
  private readonly _value?: T;
  private readonly _error?: E;

  private constructor(isSuccess: boolean, value?: T, error?: E) {
    if (isSuccess && error) {
      throw new Error("InvalidOperation: A result cannot be successful and contain an error");
    }
    if (!isSuccess && !error) {
      throw new Error("InvalidOperation: A failing result must contain an error");
    }

    this.isSuccess = isSuccess;
    this.isFailure = !isSuccess;
    this._value = value;
    this._error = error;

    Object.freeze(this);
  }

  public getValue(): T {
    if (!this.isSuccess) {
      throw new Error(`Cannot retrieve value from a failed result: ${String(this._error)}`);
    }
    return this._value as T;
  }

  public getError(): E {
    if (this.isSuccess) {
      throw new Error("Cannot retrieve error from a successful result");
    }
    return this._error as E;
  }

  public static ok<U, F = string>(value?: U): Result<U, F> {
    return new Result<U, F>(true, value, undefined);
  }

  public static fail<U, F = string>(error: F): Result<U, F> {
    return new Result<U, F>(false, undefined, error);
  }

  public static combine(results: Result<unknown, unknown>[]): Result<unknown, unknown> {
    for (const result of results) {
      if (result.isFailure) {
        return result;
      }
    }
    return Result.ok();
  }
}

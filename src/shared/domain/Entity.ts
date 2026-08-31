import { randomUUID } from "node:crypto";

export abstract class Entity<T> {
  protected readonly _id: string;
  protected readonly props: T;
  protected readonly _createdAt: Date;
  protected _updatedAt: Date;

  constructor(props: T, id?: string, createdAt?: Date, updatedAt?: Date) {
    this._id = id ?? randomUUID();
    this.props = props;
    this._createdAt = createdAt ?? new Date();
    this._updatedAt = updatedAt ?? new Date();
  }

  get id(): string {
    return this._id;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  public equals(object?: Entity<T>): boolean {
    if (object == null) {
      return false;
    }

    if (this === object) {
      return true;
    }

    if (!(object instanceof Entity)) {
      return false;
    }

    return this._id === object._id;
  }
}

import { Entity } from "../domain/Entity.ts";

export interface IRepository<T extends Entity<unknown>> {
  findById(id: string): Promise<T | null>;
  save(entity: T): Promise<void>;
  delete(id: string): Promise<void>;
  findAll?(): Promise<T[]>;
}

export abstract class InMemoryRepository<T extends Entity<unknown>> implements IRepository<T> {
  protected items: Map<string, T> = new Map();

  public async findById(id: string): Promise<T | null> {
    const item = this.items.get(id);
    return item ? item : null;
  }

  public async save(entity: T): Promise<void> {
    this.items.set(entity.id, entity);
  }

  public async delete(id: string): Promise<void> {
    this.items.delete(id);
  }

  public async findAll(): Promise<T[]> {
    return Array.from(this.items.values());
  }

  public async clear(): Promise<void> {
    this.items.clear();
  }
}

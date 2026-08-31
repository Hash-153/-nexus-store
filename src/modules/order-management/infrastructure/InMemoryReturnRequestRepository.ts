import { InMemoryRepository } from "../../../shared/infrastructure/Repository.ts";
import { ReturnRequest } from "../domain/ReturnRequest.ts";
import type { IReturnRequestRepository, IReturnRequestFilterOptions } from "../domain/IReturnRequestRepository.ts";

/**
 * InMemory Repository for ReturnRequest
 * Thread-safe simulated repository with comprehensive query filtering.
 */
export class InMemoryReturnRequestRepository extends InMemoryRepository<ReturnRequest> implements IReturnRequestRepository {
  public async findByName(name: string): Promise<ReturnRequest | null> {
    const target = name.trim().toLowerCase();
    for (const item of this.items.values()) {
      if (item.name && item.name.toLowerCase() === target) {
        return item;
      }
    }
    return null;
  }

  public async findByCode(code: string): Promise<ReturnRequest | null> {
    const target = code.trim().toUpperCase();
    for (const item of this.items.values()) {
      if (item.code && item.code.toUpperCase() === target) {
        return item;
      }
    }
    return null;
  }

  public async findFiltered(options: IReturnRequestFilterOptions = {}): Promise<ReturnRequest[]> {
    let result = Array.from(this.items.values());

    if (options.status !== undefined) {
      result = result.filter((i) => i.status === options.status);
    }
    if (options.isActive !== undefined) {
      result = result.filter((i) => i.isActive === options.isActive);
    }
    if (options.tag !== undefined) {
      result = result.filter((i) => i.tags.includes(options.tag!.toLowerCase()));
    }
    if (options.searchTerm !== undefined) {
      const q = options.searchTerm.toLowerCase();
      result = result.filter((i) =>
        (i.name && i.name.toLowerCase().includes(q)) ||
        (i.title && i.title.toLowerCase().includes(q)) ||
        (i.description && i.description.toLowerCase().includes(q))
      );
    }

    if (options.sortBy) {
      const dir = options.sortDirection === "desc" ? -1 : 1;
      result.sort((a: any, b: any) => {
        const valA = a[options.sortBy!] ?? "";
        const valB = b[options.sortBy!] ?? "";
        if (valA < valB) return -1 * dir;
        if (valA > valB) return 1 * dir;
        return 0;
      });
    }

    const offset = options.offset ?? 0;
    const limit = options.limit ?? 100;
    return result.slice(offset, offset + limit);
  }

  public async count(options: IReturnRequestFilterOptions = {}): Promise<number> {
    const filtered = await this.findFiltered({ ...options, limit: 1000000, offset: 0 });
    return filtered.length;
  }

  public async exists(id: string): Promise<boolean> {
    return this.items.has(id);
  }

  public async saveBatch(entities: ReturnRequest[]): Promise<void> {
    for (const entity of entities) {
      await this.save(entity);
    }
  }

  public async deleteById(id: string): Promise<boolean> {
    const hasItem = this.items.has(id);
    if (hasItem) {
      this.items.delete(id);
      return true;
    }
    return false;
  }
}

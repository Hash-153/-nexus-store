import { InMemoryRepository } from "../../../shared/infrastructure/Repository.ts";
import { User } from "../domain/User.ts";
import type { IUserRepository } from "../domain/IUserRepository.ts";

export class InMemoryUserRepository extends InMemoryRepository<User> implements IUserRepository {
  public async findByEmail(email: string): Promise<User | null> {
    const normalized = email.trim().toLowerCase();
    for (const user of this.items.values()) {
      if (user.email.value === normalized) {
        return user;
      }
    }
    return null;
  }

  public async exists(email: string): Promise<boolean> {
    const user = await this.findByEmail(email);
    return user !== null;
  }

  public async findByName(name: string): Promise<User | null> {
    for (const user of this.items.values()) {
      if (user.fullName.toLowerCase() === name.toLowerCase()) {
        return user;
      }
    }
    return null;
  }

  public async findFiltered(): Promise<User[]> {
    return Array.from(this.items.values());
  }

  public async count(): Promise<number> {
    return this.items.size;
  }

  public async saveBatch(entities: User[]): Promise<void> {
    for (const e of entities) {
      await this.save(e);
    }
  }

  public async deleteById(id: string): Promise<boolean> {
    return this.items.delete(id);
  }
}

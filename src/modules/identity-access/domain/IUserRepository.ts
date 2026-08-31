import type { IRepository } from "../../../shared/infrastructure/Repository.ts";
import { User } from "./User.ts";

export interface IUserRepository extends IRepository<User> {
  findByEmail(email: string): Promise<User | null>;
  exists(email: string): Promise<boolean>;
  findByName?(name: string): Promise<User | null>;
  findFiltered?(): Promise<User[]>;
  count?(): Promise<number>;
  saveBatch?(entities: User[]): Promise<void>;
  deleteById?(id: string): Promise<boolean>;
}

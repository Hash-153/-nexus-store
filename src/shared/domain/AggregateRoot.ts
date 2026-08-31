import { Entity } from "./Entity.ts";
import type { IDomainEvent } from "./DomainEvent.ts";

export abstract class AggregateRoot<T> extends Entity<T> {
  private _domainEvents: IDomainEvent[] = [];

  get domainEvents(): ReadonlyArray<IDomainEvent> {
    return [...this._domainEvents];
  }

  protected addDomainEvent(domainEvent: IDomainEvent): void {
    this._domainEvents.push(domainEvent);
    this._updatedAt = new Date();
  }

  public clearEvents(): void {
    this._domainEvents = [];
  }
}

import type { IDomainEvent } from "../domain/DomainEvent.ts";

export type EventHandler<T extends IDomainEvent = IDomainEvent> = (event: T) => Promise<void> | void;

export interface IEventBus {
  publish(event: IDomainEvent): Promise<void>;
  publishAll(events: ReadonlyArray<IDomainEvent>): Promise<void>;
  subscribe<T extends IDomainEvent>(eventName: string, handler: EventHandler<T>): void;
  unsubscribe<T extends IDomainEvent>(eventName: string, handler: EventHandler<T>): void;
}

export class InMemoryEventBus implements IEventBus {
  private static instance: InMemoryEventBus;
  private handlers: Map<string, Set<EventHandler>> = new Map();

  public static getInstance(): InMemoryEventBus {
    if (!InMemoryEventBus.instance) {
      InMemoryEventBus.instance = new InMemoryEventBus();
    }
    return InMemoryEventBus.instance;
  }

  public subscribe<T extends IDomainEvent>(eventName: string, handler: EventHandler<T>): void {
    if (!this.handlers.has(eventName)) {
      this.handlers.set(eventName, new Set());
    }
    this.handlers.get(eventName)!.add(handler as EventHandler);
  }

  public unsubscribe<T extends IDomainEvent>(eventName: string, handler: EventHandler<T>): void {
    const eventHandlers = this.handlers.get(eventName);
    if (eventHandlers) {
      eventHandlers.delete(handler as EventHandler);
    }
  }

  public async publish(event: IDomainEvent): Promise<void> {
    const eventHandlers = this.handlers.get(event.eventName);
    if (eventHandlers && eventHandlers.size > 0) {
      const handlerPromises = Array.from(eventHandlers).map((handler) =>
        Promise.resolve(handler(event)).catch((err) => {
          console.error(`[EventBus] Error executing handler for ${event.eventName}:`, err);
        })
      );
      await Promise.all(handlerPromises);
    }
  }

  public async publishAll(events: ReadonlyArray<IDomainEvent>): Promise<void> {
    for (const event of events) {
      await this.publish(event);
    }
  }

  public clear(): void {
    this.handlers.clear();
  }
}


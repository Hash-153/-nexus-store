export interface IDomainEvent {
  dateTimeOccurred: Date;
  eventId: string;
  eventName: string;
  getAggregateId(): string;
}

export abstract class DomainEvent implements IDomainEvent {
  public readonly dateTimeOccurred: Date;
  public readonly eventId: string;
  public abstract readonly eventName: string;

  constructor() {
    this.dateTimeOccurred = new Date();
    this.eventId = crypto.randomUUID();
  }

  public abstract getAggregateId(): string;
}

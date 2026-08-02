export interface EntityMetadata {
  id?: string;
  createdAt: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
}

export abstract class Entity<T> {
  protected readonly props: T;
  private readonly _id?: string;
  private readonly _createdAt?: Date;
  private readonly _updatedAt?: Date;
  protected _deletedAt: Date | null;

  constructor(props: T, metadata?: EntityMetadata) {
    this.props = props;
    this._id = metadata?.id;
    this._createdAt = metadata?.createdAt;
    this._updatedAt = metadata?.updatedAt;
    this._deletedAt = metadata?.deletedAt ?? null;
  }

  get id(): string | undefined {
    return this._id;
  }

  get createdAt(): Date | undefined {
    return this._createdAt;
  }

  get updatedAt(): Date | undefined {
    return this._updatedAt;
  }

  get deletedAt(): Date | null {
    return this._deletedAt;
  }

  get isDeleted(): boolean {
    return this._deletedAt !== null;
  }
}

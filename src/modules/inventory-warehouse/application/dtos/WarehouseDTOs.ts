export interface CreateWarehouseRequestDTO {
  readonly name?: string;
  readonly code?: string;
  readonly title?: string;
  readonly description?: string;
  readonly status?: string;
  readonly priority?: number;
  readonly tags?: string[];
  readonly metadata?: Record<string, unknown>;
  readonly notes?: string;
  [key: string]: any;
}

export interface UpdateWarehouseRequestDTO {
  readonly id: string;
  readonly name?: string;
  readonly description?: string;
  readonly status?: string;
  readonly priority?: number;
  readonly tags?: string[];
  readonly metadata?: Record<string, unknown>;
  readonly notes?: string;
  [key: string]: any;
}

export interface WarehouseResponseDTO {
  readonly id: string;
  readonly name?: string;
  readonly code?: string;
  readonly title?: string;
  readonly status: string;
  readonly isActive: boolean;
  readonly isEnabled: boolean;
  readonly description?: string;
  readonly priority: number;
  readonly tags: string[];
  readonly metadata: Record<string, unknown>;
  readonly versionNumber: number;
  readonly createdAt: string;
  readonly updatedAt: string;
  [key: string]: any;
}

export interface PaginatedWarehouseListDTO {
  readonly items: WarehouseResponseDTO[];
  readonly total: number;
  readonly limit: number;
  readonly offset: number;
  readonly hasMore: boolean;
}

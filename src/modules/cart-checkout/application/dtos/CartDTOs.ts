export interface CreateCartRequestDTO {
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

export interface UpdateCartRequestDTO {
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

export interface CartResponseDTO {
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

export interface PaginatedCartListDTO {
  readonly items: CartResponseDTO[];
  readonly total: number;
  readonly limit: number;
  readonly offset: number;
  readonly hasMore: boolean;
}

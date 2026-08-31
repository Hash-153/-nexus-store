export enum UserRole {
  CUSTOMER = "CUSTOMER",
  STAFF = "STAFF",
  STORE_MANAGER = "STORE_MANAGER",
  ADMIN = "ADMIN",
}

export interface Permission {
  resource: string;
  action: "read" | "write" | "delete" | "manage";
}

export const RolePermissions: Record<UserRole, Permission[]> = {
  [UserRole.CUSTOMER]: [
    { resource: "catalog", action: "read" },
    { resource: "cart", action: "manage" },
    { resource: "orders", action: "read" },
    { resource: "orders", action: "write" },
    { resource: "reviews", action: "write" },
  ],
  [UserRole.STAFF]: [
    { resource: "catalog", action: "read" },
    { resource: "orders", action: "read" },
    { resource: "orders", action: "write" },
    { resource: "inventory", action: "read" },
    { resource: "support", action: "manage" },
  ],
  [UserRole.STORE_MANAGER]: [
    { resource: "catalog", action: "manage" },
    { resource: "orders", action: "manage" },
    { resource: "inventory", action: "manage" },
    { resource: "discounts", action: "manage" },
    { resource: "analytics", action: "read" },
  ],
  [UserRole.ADMIN]: [
    { resource: "*", action: "manage" },
  ],
};

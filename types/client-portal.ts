export interface ClientPortalAccess {
  hasAccount: boolean;
  userId: string | null;
  email: string | null;
  loginUrl: string | null;
}

export interface UpsertClientPortalPayload {
  email: string;
  password?: string;
}

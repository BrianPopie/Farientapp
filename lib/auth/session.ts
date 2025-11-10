export const SESSION_COOKIE_NAME = "farient_session";
export const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

export type SessionPayload = {
  email: string;
  createdAt: number;
};

export function serializeSession(session: SessionPayload): string {
  return encodeURIComponent(JSON.stringify(session));
}

export function parseSession(value: string | null | undefined): SessionPayload | null {
  if (!value) return null;
  try {
    return JSON.parse(decodeURIComponent(value)) as SessionPayload;
  } catch {
    return null;
  }
}

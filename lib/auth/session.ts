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
  const candidates: string[] = [];

  const safePush = (raw: string) => {
    if (!candidates.includes(raw)) {
      candidates.push(raw);
    }
  };

  safePush(value);
  try {
    safePush(decodeURIComponent(value));
  } catch {
    // ignore
  }
  try {
    safePush(decodeURIComponent(decodeURIComponent(value)));
  } catch {
    // ignore
  }

  for (const candidate of candidates) {
    try {
      return JSON.parse(candidate) as SessionPayload;
    } catch {
      // continue
    }
  }
  return null;
}

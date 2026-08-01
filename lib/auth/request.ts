/**
 * Ableitung des zweiten Sperrschlüssels (neben der E-Mail) aus dem Request.
 *
 * `x-forwarded-for` ist fälschbar, wenn kein Proxy davorsteht — deshalb ist
 * das ausdrücklich nur eine ZUSÄTZLICHE Bremse und nie die einzige: die
 * Sperre pro E-Mail-Adresse greift unabhängig davon. Hinter Cloud Run
 * setzt der Load Balancer den Header verlässlich.
 *
 * Bewusst kein `NextRequest`-Import: die Funktion braucht nur Header und
 * eine optionale IP und ist damit ohne Next-Kontext testbar.
 */
export type RateLimitRequestLike = {
  headers: { get(name: string): string | null };
  ip?: string;
};

export function clientRateLimitKey(request: RateLimitRequestLike): string {
  const forwarded = request.headers.get("x-forwarded-for");

  if (forwarded) {
    return forwarded.split(",")[0]?.trim() || "unbekannt";
  }

  return request.ip ?? "unbekannt";
}

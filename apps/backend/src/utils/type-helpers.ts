// Type casting helpers for Prisma to shared type conversions
// Prisma generates its own enums which don't directly match our shared enums

export function toPrismaJson<T>(data: T): any {
  return data as any;
}

export function fromPrismaResult<T>(result: any): T {
  return result as T;
}

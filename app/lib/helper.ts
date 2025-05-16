import type { ZodSchema } from "zod";

export function getEnumKey(enumClass: any, value: string) {
  for (const [key, val] of Object.entries(enumClass)) {
    if (val === value) {
      return key;
    }
  }
}

export function generateUnqueString(prefix: string = "PRD"): string {
  const timestamp = Date.now().toString(36); // base36: shorter & compact
  const random = Math.random().toString(8).substring(2).toUpperCase();
  return `${prefix}-${timestamp}-${random}`.toUpperCase();
}

export async function validateSchema<T>(
  schema: ZodSchema<T>,
  data: Record<string, any>
) {
  const result = await schema.safeParseAsync(data);
  const errors: Record<string, string> = {};
  if (!result.success) {
    for (const issue of result.error.issues) {
      errors[issue.path[0]] = issue.message;
    }
    return { errors };
  }
  return { data: result.data };
}

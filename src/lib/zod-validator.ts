import { ZodError, z } from "zod";

export class ValidationError extends Error {
  public details: Record<string, string[] | undefined>;
  public status: number;

  constructor(error: ZodError) {
    super("Validation Error");
    this.name = "ValidationError";
    this.status = 400;
    const fieldErrors: Record<string, string[] | undefined> = {};

    error.issues.forEach((issue) => {
      const path = issue.path.map((p) => String(p)).join(".");
      if (!fieldErrors[path]) {
        fieldErrors[path] = [];
      }
      fieldErrors[path]?.push(issue.message);
    });

    this.details = fieldErrors;
  }
}

export function validate<T extends z.ZodType>(
  schema: T,
  data: unknown,
): z.output<T> {
  try {
    return schema.parse(data);
  } catch (err) {
    if (err instanceof ZodError) {
      throw new ValidationError(err);
    }
    throw err;
  }
}

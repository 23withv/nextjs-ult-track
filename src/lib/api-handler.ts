import { NextResponse } from "next/server";
import { ValidationError } from "./zod-validator";

export type ErrorDetails = string | Error | Record<string, unknown>;
export const successRes = <T>(message: string, status = 200, data?: T) => {
  return { message, status, data };
};

export const errorRes = (
  message: string,
  status = 500,
  details?: ErrorDetails,
) => {
  return { message, status, details };
};

export class SetError extends Error {
  status: number;
  details?: ErrorDetails;

  constructor(message: string, status = 400, details?: ErrorDetails) {
    super(message);
    this.name = "SetError";
    this.status = status;
    this.details = details;
  }
}

// Buat Server Action
export const APIHandler = async <T>(
  fn: () => Promise<T>,
  onError?: (error: unknown) => Promise<void>,
) => {
  try {
    return await fn();
  // Tangkap dan terjemahkan exception mentah untuk dikembalikan ke lapisan atas
  } catch (error: unknown) {
    if (onError) {
      try {
        await onError(error);
      } catch (cleanupErr) {
        console.error("[ORIGINAL_ERROR]:", error);
        console.error("[CLEANUP_ERROR]:", cleanupErr);
      }
    }
    if (error instanceof SetError) {
      return errorRes(error.message, error.status, error.details);
    }
    if (error instanceof ValidationError) {
      return errorRes("Data validation error.", 400, error.details);
    }
    console.error("[SYSTEM_ERROR]:", error);
    return errorRes("Internal server error.", 500);
  }
};

// Buat API
export const RouteHandler = async (fn: () => Promise<NextResponse>) => {
  try {
    return await fn();
  // Tangkap dan terjemahkan exception mentah untuk dikembalikan ke lapisan atas
  } catch (error: unknown) {
    console.error("[ROUTE_HANDLER_ERROR]:", error);
    if (error instanceof ValidationError) {
      return NextResponse.json(
        { message: "Struktur data tidak valid", details: error.details },
        { status: 400 },
      );
    }

    if (error instanceof SetError) {
      return NextResponse.json(
        { message: error.message, details: error.details },
        { status: error.status },
      );
    }

    return NextResponse.json(
      { message: "Terjadi gangguan pada server internal" },
      { status: 500 },
    );
  }
};

import { ZodError } from "zod";

function formatZodError(error: ZodError) {
  return error.errors.map(err => ({
    field: err.path.join('.'),
    message: err.message,
  }));
}

export default formatZodError
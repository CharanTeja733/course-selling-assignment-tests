import { z } from "zod";

export const userTokenValidation = z.object({
  id: z.string()
})
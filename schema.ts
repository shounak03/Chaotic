import { z } from "zod";

export const thoughtSchema = z.object({
    title: z.string(),
    thoughts: z.array(z.string()),
    img: z.array(z.string()),
});
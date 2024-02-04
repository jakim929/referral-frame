import { z } from 'zod'

const frameDataSchema = z.object({
  buttonIndex: z.number(),
  castId: z.object({
    fid: z.number(),
    hash: z.string(),
  }),
  inputText: z.string().optional(),
  fid: z.number(),
  messageHash: z.string(),
  network: z.number(),
  timestamp: z.number(),
  url: z.string(),
})

export const frameRequestSchema = z.object({
  untrustedData: frameDataSchema,
  trustedData: z.object({
    messageBytes: z.string(),
  }),
})

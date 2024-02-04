import { Env } from '@/env'
import { z } from 'zod'

const endpointResponseSchema = z.object({
  users: z
    .array(
      z.object({
        fid: z.number(),
        username: z.string(),
        display_name: z.string(),
      }),
    )
    .min(1),
})

export const getFarcasterName = async (env: Env, fid: number) => {
  const result = await fetch(
    `https://api.neynar.com/v2/farcaster/user/bulk?fids=${fid}`,
    {
      headers: {
        accept: 'application/json',
        'api-key': env.NEYNAR_API_KEY,
      },
    },
  )
  return endpointResponseSchema
    .transform(({ users }) => {
      return users[0].display_name
    })
    .parse(await result.json())
}

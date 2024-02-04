import { Env } from '@/env'
import { frameRequestSchema } from '@/schemas/frameRequestSchema'
import { FrameValidationData, getFrameMessage } from '@coinbase/onchainkit'
import { IRequest, error } from 'itty-router'

export const withFrameAction = async (request: IRequest, env: Env) => {
  const requestBody = await request.json()
  const parseResult = frameRequestSchema.safeParse(requestBody)

  if (!parseResult.success) {
    return error(400, 'Invalid request')
  }

  // not sure, but onchainkit might have wrong type here. Frame action can have inputText as undefined
  // @ts-ignore
  const { isValid, message } = await getFrameMessage(parseResult.data, {
    neynarApiKey: env.NEYNAR_API_KEY,
  })

  if (!isValid) {
    return error(401, 'Unauthorized')
  }

  request.frameAction = message
}

export type WithFrameAction = {
  frameAction: FrameValidationData
}

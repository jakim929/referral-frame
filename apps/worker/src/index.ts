import { Env } from '@/env'
import { router } from '@/router'
import { error, json } from 'itty-router'

export default {
  async fetch(
    request: Request,
    env: Env,
    ctx: ExecutionContext,
  ): Promise<Response> {
    return router
      .handle(request, env, ctx)
      .then(json)
      .catch(() => error(500))
  },
}

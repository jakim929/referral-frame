import { Env } from '@/env'
import { KyselyDatabase, createKysely } from '@/models/kysely'
import { IRequest } from 'itty-router'

export const withDb = async (request: IRequest, env: Env) => {
  // Initializes db connection pool
  request.db = createKysely(env.DB)
}

export type WithDb = {
  db: KyselyDatabase
}

import { CamelCasePlugin, Kysely, ColumnType } from 'kysely'
import { D1Dialect } from 'kysely-d1'

type ProjectInKysely = {
  id: string
  name: string
  ownerFid: string
  createdAt: ColumnType<Date, never, never>
  updatedAt: ColumnType<Date, never, string | undefined>
}

type ReferralInKysely = {
  id: string
  projectId: string
  recipientFid: string
  referrerFid: string
  createdAt: ColumnType<Date, never, never>
  updatedAt: ColumnType<Date, never, string | undefined>
}

type ProjectUserInKysely = {
  id: string
  projectId: string
  userFid: string
  createdAt: ColumnType<Date, never, never>
  updatedAt: ColumnType<Date, never, string | undefined>
}

export type Database = {
  projects: ProjectInKysely
  referrals: ReferralInKysely
  project_users: ProjectUserInKysely
}

export type KyselyDatabase = Kysely<Database>

export function createKysely(d1: D1Database): KyselyDatabase {
  return new Kysely<Database>({
    dialect: new D1Dialect({ database: d1 }),
    plugins: [new CamelCasePlugin()],
  })
}

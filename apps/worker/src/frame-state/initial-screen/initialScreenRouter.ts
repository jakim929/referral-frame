import { getSuccessfullyJoinedResponse } from '@/frame-state/successfully-joined/successfullyJoinedRouter'
import { InitialScreen } from '@/layouts/InitialScreen'
import { WithDb, withDb } from '@/middlewares/withDb'
import { WithFrameAction, withFrameAction } from '@/middlewares/withFrameAction'
import { CF } from '@/types'
import { IRequest, Router, html, status } from 'itty-router'
import { ImageResponse } from 'workers-og'

const INITIAL_SCREEN_BASE_PATH = '/:projectId/:referrerFid/initial-screen'

const initialScreenRouter = Router({ base: INITIAL_SCREEN_BASE_PATH })

initialScreenRouter.get('/', withDb, async ({ params, db }, env) => {
  const { projectId, referrerFid } = params

  const [project, projectUser] = await Promise.all([
    db
      .selectFrom('projects')
      .selectAll()
      .where('id', '=', projectId)
      .executeTakeFirst(),
    db
      .selectFrom('project_users')
      .selectAll()
      .where('projectId', '=', projectId)
      .where('userFid', '=', referrerFid)
      .executeTakeFirst(),
  ])

  if (!project || !projectUser) {
    return status(404)
  }

  const baseRoute = `${env.PUBLIC_URL}/${projectId}/${referrerFid}/initial-screen`
  const postActionHandlerUrl = `${baseRoute}/handle-action`
  const imageUrl = `${baseRoute}/image`
  const title = `${referrerFid} invites you to ${project.name}`
  return html(
    `
			<!DOCTYPE html>
			<html>
				<head>
					<meta property="og:title" content="${title}">
					<meta property="og:image" content="${imageUrl}" />
					<meta property="fc:frame" content="vNext" />
					<meta property="fc:frame:image" content="${imageUrl}" />
					<meta property="fc:frame:button:1" content="Accept invite" />
					<meta property="fc:frame:post_url" content="${postActionHandlerUrl}" />
				</head>
				<body>
					${title}
				</body>
			</html>
		`,
  )
})

initialScreenRouter.get<IRequest, CF>(
  '/image',
  withDb,
  async ({ params, db }) => {
    // TODO: consider changing this function to be stateless

    const { projectId, referrerFid } = params
    const [project, projectUser] = await Promise.all([
      db
        .selectFrom('projects')
        .selectAll()
        .where('id', '=', projectId)
        .executeTakeFirst(),
      db
        .selectFrom('project_users')
        .selectAll()
        .where('projectId', '=', projectId)
        .where('userFid', '=', referrerFid)
        .executeTakeFirst(),
    ])

    if (!project || !projectUser) {
      return status(404)
    }

    return new ImageResponse(
      // TODO: use user farcaster name instead of fid
      InitialScreen({
        inviter: referrerFid.toString(),
        projectName: project.name,
      }),
      {
        width: 1910,
        height: 1000,
      },
    )
  },
)

initialScreenRouter.post<IRequest & WithDb & WithFrameAction, CF>(
  '/handle-action',
  withDb,
  withFrameAction,
  async ({ params, db, frameAction }, env) => {
    const { projectId, referrerFid } = params
    const { fid: interactorFid } = frameAction.interactor

    // TODO: consider using number for fid storage

    // TODO: figure out if there's batching at connection pool level
    const [project, projectUser, existingReferral] = await Promise.all([
      db
        .selectFrom('projects')
        .selectAll()
        .where('id', '=', projectId)
        .executeTakeFirst(),
      db
        .selectFrom('project_users')
        .selectAll()
        .where('projectId', '=', projectId)
        .where('userFid', '=', referrerFid)
        .executeTakeFirst(),
      db
        .selectFrom('referrals')
        .selectAll()
        .where('projectId', '=', projectId)
        .where('referrerFid', '=', referrerFid)
        .where('recipientFid', '=', interactorFid.toString())
        .executeTakeFirst(),
    ])

    // TODO: if any of these conditions is bad, return a frame telling people why
    // 1. project must exist
    // 2. referrer must be an existing project user
    if (!project || !projectUser) {
      return status(400)
    }

    if (existingReferral !== undefined) {
      return status(401)
    }

    // TODO: convert following inserts to a single transaction or stored procedure

    await Promise.all([
      db.insertInto('referrals').values({
        id: crypto.randomUUID(),
        projectId: projectId,
        referrerFid: referrerFid,
        recipientFid: interactorFid.toString(),
      }),
      db.insertInto('project_users').values({
        id: crypto.randomUUID(),
        projectId: projectId,
        userFid: interactorFid.toString(),
      }),
    ])

    return html(getSuccessfullyJoinedResponse(env.PUBLIC_URL))
  },
)

export { initialScreenRouter, INITIAL_SCREEN_BASE_PATH }

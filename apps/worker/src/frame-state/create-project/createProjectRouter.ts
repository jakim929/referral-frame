import { CreateProject } from '@/layouts/CreateProject'
import { WithDb, withDb } from '@/middlewares/withDb'
import { WithFrameAction, withFrameAction } from '@/middlewares/withFrameAction'
import { CF } from '@/types'
import { sanitizeInput } from '@/utils/sanitizeInput'
import { getFrameHtmlResponse } from '@coinbase/onchainkit'
import { IRequest, Router, error, html, status } from 'itty-router'
import { ImageResponse } from 'workers-og'

export const CREATE_PROJECT_BASE_PATH = '/create-project'

export const getCreateProjectResponse = (publicUrl: string) => {
  return html(
    getFrameHtmlResponse({
      image: `${publicUrl}/${CREATE_PROJECT_BASE_PATH}/image`,
      post_url: `${publicUrl}/${CREATE_PROJECT_BASE_PATH}/handle-action`,
      input: {
        text: 'Name of your project',
      },
      buttons: [
        {
          label: 'Create my project and post invite link',
          action: 'post_redirect',
        },
      ],
    }),
  )
}

export const createProjectRouter = Router({
  base: CREATE_PROJECT_BASE_PATH,
})

createProjectRouter
  .get('/', async (req, env) => {
    const baseRoute = `${env.PUBLIC_URL}/create-project`
    const postActionHandlerUrl = `${baseRoute}/handle-action`
    const imageUrl = `${baseRoute}/image`
    const title = 'Create a referral campaign'
    return html(
      `
			<!DOCTYPE html>
			<html>
				<head>
					<meta property="og:title" content="${title}">
					<meta property="og:image" content="${imageUrl}" />
					<meta property="fc:frame" content="vNext" />
					<meta property="fc:frame:image" content="${imageUrl}" />
					<meta property="fc:frame:input:text" content="Name of your project" />
					<meta property="fc:frame:button:1" content="${title}" />
					<meta property="fc:frame:button:1:action" content="post_redirect" />
					<meta property="fc:frame:post_url" content="${postActionHandlerUrl}" />
				</head>
				<body>
					${title}
				</body>
			</html>
		`,
    )
  })
  .get<IRequest, CF>('/image', async () => {
    return new ImageResponse(CreateProject(), {
      width: 1910,
      height: 1000,
    })
  })
  .post<IRequest & WithDb & WithFrameAction, CF>(
    '/handle-action',
    withDb,
    withFrameAction,
    async ({ params, frameAction, db }, env) => {
      const { input } = frameAction
      const { fid: interactorFid } = frameAction.interactor

      const sanitizedInput = sanitizeInput(input)

      if (sanitizedInput.length < 7) {
        return error(400)
      }

      const { id: projectId } = (
        await db
          .insertInto('projects')
          .values({
            id: crypto.randomUUID(),
            name: sanitizedInput,
            ownerFid: interactorFid.toString(),
          })
          .returning(['id'])
          .execute()
      )[0]

      await db
        .insertInto('project_users')
        .values({
          id: crypto.randomUUID(),
          projectId,
          userFid: interactorFid.toString(),
        })
        .execute()

      const newInviteFrameLink = `${env.PUBLIC_URL}/${projectId}/${interactorFid}/initial-screen`

      const castNewInviteFrameLink = `https://warpcast.com/~/compose?text=&embeds[]=${newInviteFrameLink}`

      // Redirect to warpcast cast intent
      return status(302, {
        headers: {
          Location: castNewInviteFrameLink,
        },
      })
    },
  )
  .all('*', () => error(404))

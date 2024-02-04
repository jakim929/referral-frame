import { getCreateProjectResponse } from '@/frame-state/create-project/createProjectRouter'
import { SuccessfullyJoined } from '@/layouts/SuccessfullyJoined'
import { WithDb, withDb } from '@/middlewares/withDb'
import { WithFrameAction, withFrameAction } from '@/middlewares/withFrameAction'
import { CF } from '@/types'
import { getFrameHtmlResponse } from '@coinbase/onchainkit'
import { IRequest, Router, html, status } from 'itty-router'
import { ImageResponse } from 'workers-og'

export const SUCCESSFULLY_JOINED_BASE_PATH =
  '/:projectId/:referrerFid/sucessfully-joined'

export const getSuccessfullyJoinedResponse = (publicUrl: string) => {
  return html(
    getFrameHtmlResponse({
      image: `${publicUrl}/${SUCCESSFULLY_JOINED_BASE_PATH}/image`,
      post_url: `${publicUrl}/${SUCCESSFULLY_JOINED_BASE_PATH}/handle-action`,
      buttons: [
        {
          label: 'Invite my friends',
          action: 'post_redirect',
        },
        {
          label: 'Create my own project',
          action: 'post',
        },
      ],
    }),
  )
}

export const successfullyJoinedRouter = Router({
  base: SUCCESSFULLY_JOINED_BASE_PATH,
})

successfullyJoinedRouter.get<IRequest, CF>('/image', async ({ params, db }) => {
  return new ImageResponse(SuccessfullyJoined(), {
    width: 1910,
    height: 1000,
  })
})

successfullyJoinedRouter.post<IRequest & WithDb & WithFrameAction, CF>(
  '/handle-action',
  withDb,
  withFrameAction,
  async ({ params, frameAction }, env) => {
    const { projectId } = params
    const { fid: interactorFid } = frameAction.interactor

    if (frameAction.button === 0) {
      const newInviteFrameLink = `${env.PUBLIC_URL}/${projectId}/${interactorFid}/initial-screen`

      const castNewInviteFrameLink = `https://warpcast.com/~/compose?text=&embeds[]=${newInviteFrameLink}`

      // Redirect to warpcast cast intent
      return status(302, {
        headers: {
          Location: castNewInviteFrameLink,
        },
      })
    }

    if (frameAction.button === 1) {
      return html(getCreateProjectResponse(env.PUBLIC_URL))
    }

    return status(400)
  },
)

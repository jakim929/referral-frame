import { Router, error } from 'itty-router'
import {
  INITIAL_SCREEN_BASE_PATH,
  initialScreenRouter,
} from '@/frame-state/initial-screen/initialScreenRouter'
import {
  SUCCESSFULLY_JOINED_BASE_PATH,
  successfullyJoinedRouter,
} from '@/frame-state/successfully-joined/successfullyJoinedRouter'
import {
  CREATE_PROJECT_BASE_PATH,
  createProjectRouter,
} from '@/frame-state/create-project/createProjectRouter'

const router = Router()

router.all(`${INITIAL_SCREEN_BASE_PATH}/*`, initialScreenRouter.handle)
router.all(
  `${SUCCESSFULLY_JOINED_BASE_PATH}/*`,
  successfullyJoinedRouter.handle,
)
router.all(`${CREATE_PROJECT_BASE_PATH}/*`, createProjectRouter.handle)
router.all('*', () => error(404))

export { router }

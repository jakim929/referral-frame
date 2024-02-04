import { BaseLayout } from '@/layouts/BaseLayout'

export const InitialScreen = ({
  inviter,
  projectName,
}: {
  inviter: string
  projectName: string
}) => {
  return (
    <BaseLayout>
      {inviter} is inviting you to try out {projectName}
    </BaseLayout>
  )
}

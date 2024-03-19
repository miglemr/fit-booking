import { Session } from '@server/entities'

export const generateEmailContent = (name: string, session: Session) => ({
  subject: 'Training session cancellation',
  html: `<p>Dear ${name},</p>
  <p>We regret to inform you that the ${session.sport.name} class scheduled for ${session.date} from ${session.timeStart} to ${session.timeEnd} with trainer ${session.trainer.firstName} ${session.trainer.lastName} has been cancelled.</p>
  `,
})

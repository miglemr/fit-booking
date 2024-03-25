import sgMail from '@sendgrid/mail'
import { type MailDataRequired } from '@sendgrid/mail'
import config from '@server/config'
import logger from '@server/logger'

type Content = {
  subject: string
  html: string
}

export default async function sendEmail(userEmail: string, content: Content) {
  const { subject, html } = content

  if (config.env === 'test') {
    logger.info('Email sending is skipped in test environment.')
    return
  }

  sgMail.setApiKey(process.env.SEND_GRID_API_KEY as string)

  const senderEmail = process.env.SENDGRID_SENDER_EMAIL

  const message = {
    to: userEmail,
    from: senderEmail,
    subject,
    html,
  } as MailDataRequired

  await sgMail.send(message)
}

import sgMail, { MailDataRequired } from '@sendgrid/mail'

type Content = {
  subject: string
  html: string
}

export default async function sendEmail(userEmail: string, content: Content) {
  const { subject, html } = content

  sgMail.setApiKey(process.env.SEND_GRID_API_KEY as string)

  const myEmail = process.env.MY_EMAIL

  const message = {
    to: userEmail,
    from: myEmail,
    subject,
    html,
  } as MailDataRequired

  await sgMail.send(message)
}

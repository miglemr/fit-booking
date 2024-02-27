import sgMail from '@sendgrid/mail'
import sendEmail from './sendEmail'

vi.mock('@sendgrid/mail', () => ({
  default: {
    setApiKey: vi.fn(),
    send: vi.fn(),
  },
}))

process.env.SEND_GRID_API_KEY = 'testApiKey'
process.env.MY_EMAIL = 'sender@test.com'

const userEmail = 'user@test.com'

const emailContent = {
  subject: 'Test subject',
  html: '<p>Some test html.</p>',
}

it('should send mail with specefic value', async () => {
  await sendEmail(userEmail, emailContent)

  expect(sgMail.send).toBeCalledWith({
    to: userEmail,
    from: 'sender@test.com',
    ...emailContent,
  })
})

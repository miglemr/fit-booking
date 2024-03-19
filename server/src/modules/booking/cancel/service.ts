export const generateEmailContent = (name: string) => ({
  subject: 'Booking cancellation',
  html: `<p>Dear ${name},</p>
  
    <p>Your booking has been cancelled succesfully.</p>
    `,
})

import nodemailer from 'nodemailer'

export async function sendMail({from, to, subject, body}) {
  const transporter = nodemailer.createTransport({
    secure: false,
    requireTLS: true,
    host: process.env.PROTON_SMTP_SERVER || 'smtp.ethereal.email',
    port: process.env.PROTON_SMTP_PORT || 587,
    auth: {
      user: process.env.PROTON_SMTP_USERNAME || '[USERNAME]',
      pass: process.env.PROTON_SMTP_TOKEN || '[PASSWORD]'
    }
  })
  return await transporter.sendMail({
    from,
    to,
    subject,
    html: body
  })
}

export async function sendAdminMail(to, subject, body) {
  const transporter = nodemailer.createTransport({
    secure: false,
    requireTLS: true,
    host: process.env.PROTON_SMTP_SERVER || 'smtp.ethereal.email',
    port: process.env.PROTON_SMTP_PORT || 587,
    auth: {
      user: process.env.PROTON_SMTP_USERNAME || '[USERNAME]',
      pass: process.env.PROTON_SMTP_TOKEN || '[PASSWORD]'
    }
  })
  // console.log('About to send a mail...')
  // console.dir({
  //   secure: !process.env.DEBUG_APP,
  //   host: process.env.PROTON_SMTP_SERVER || 'smtp.ethereal.email',
  //   port: process.env.PROTON_SMTP_PORT || 587,
  //   auth: {
  //     user: process.env.PROTON_SMTP_USERNAME || '[USERNAME]'
  //   }
  // })
  return await transporter.sendMail({
    from: '"Else N. Forba" <forb@nnel.se>',
    to,
    subject,
    html: body
  })
}

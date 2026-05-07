import nodemailer from 'nodemailer'


export const  sendEmail =async ({from=process.env.EMAIL,to,subject,text,cc,bcc,html,attachments=[]}={})=>{


const transporter = nodemailer.createTransport({
  service:'gmail',
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD_GMAIL,
  },
});


  const info = await transporter.sendMail({
    from: `"route 👻" <${from}>`, // sender address
    to, // list of receivers
    subject, // Subject line
    text,
    bcc, // plain text body
    cc,
    html, // html body
    attachments
  });

  return info.rejected.length?false:true;
  
}


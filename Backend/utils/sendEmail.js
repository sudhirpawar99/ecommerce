const nodeMailer = require('nodemailer');

const sendEmail = async(options)=>{
    const transaporter = nodeMailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth:{
            user :"psudhir5299mit@gmail.com",
            pass:"nxqhvxjfetlxbhlj"
        }
    })
    const mailOption = {
        from :process.env.SMTP_MAIL,
        to : options.email,
        subject :options.subject,
        text : options.message
    }
    await transaporter.sendMail(mailOption);
}
module.exports = sendEmail;
import nodemailer from 'nodemailer';

const trasporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        type: 'OAuth2',
        user: process.env.EMAIL,
        clientId: process.env.EMAIL_CLIENT_ID,
        clientSecret: process.env.EMAIL_CLIENT_SECRET,
        refreshToken: process.env.EMAIL_REFRESH_TOKEN
    }
});

trasporter.verify((error, success) => {
    if(error){
        console.log(error); 
    }else{
        console.log("Email service is ready to send emails");
    }
});

const sendEmail = async (to, subject, text) => {
    const mailOptions = {
        from: process.env.EMAIL,    
        to,
        subject,
        text
    };  
    try {
        await trasporter.sendMail(mailOptions);
        console.log("Email sent successfully");
    } catch (error) {
        console.error("Error sending email:", error);
    }       
}

async function sendRegisterEmail( userEmail, userName ) {
    const subject = "Welcome to Our Banking App!";
    const text = `Hi ${userName},\n\nThank you for registering with our banking app! We're excited to have you on board. If you have any questions or need assistance, feel free to reach out to our support team.\n\nBest regards,\nThe Banking App Team`;
    await sendEmail(userEmail, subject, text);
}

export { sendEmail , sendRegisterEmail};
export default trasporter;
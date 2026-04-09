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

const hasEmailConfig = Boolean(
    process.env.EMAIL &&
    process.env.EMAIL_CLIENT_ID &&
    process.env.EMAIL_CLIENT_SECRET &&
    process.env.EMAIL_REFRESH_TOKEN
);

if (hasEmailConfig) {
    trasporter.verify((error) => {
        if(error){
            console.log("Email service verification failed:", error.message); 
        }else{
            console.log("Email service is ready to send emails");
        }
    });
}

const sendEmail = async (to, subject, text) => {
    if (!hasEmailConfig) {
        console.warn("Email config missing. Skipping email send.");
        return;
    }

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

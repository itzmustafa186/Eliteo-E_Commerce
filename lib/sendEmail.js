import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: true,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

export const sendEmail = async ({
    to,
    subject,
    html,
}) => {
    try {
        const info = await transporter.sendMail({
            from: `"Eliteo" <${process.env.SMTP_USER}>`,
            to,
            subject,
            html,
        });

        console.log("Email Sent:", info.messageId);

        return {
            success: true,
            messageId: info.messageId,
        };
    } catch (error) {
        console.error("Email Error:", error);

        return {
            success: false,
            error: error.message,
        };
    }
};
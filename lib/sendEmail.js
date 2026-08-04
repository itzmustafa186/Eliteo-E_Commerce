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

export const sendEmail = async ({ to, subject, html }) => {
    try {
        console.log("📩 Sending email to:", to);

        const info = await transporter.sendMail({
            from: `"Eliteo" <${process.env.SMTP_USER}>`,
            to,
            subject,
            html,
        });

        console.log("✅ Email sent");
        console.log(info);

        return { success: true };
    } catch (error) {
        console.error("❌ Email Error:", error);
        throw error;
    }
};
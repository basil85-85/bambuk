import nodemailer, { Transporter } from 'nodemailer';     
import dotenv from 'dotenv';
dotenv.config();

class Mailer {
    private transporter: Transporter;

    constructor() {
        this.transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: Number(process.env.SMTP_PORT),
            secure: false, // true if port 465
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS
            }
        });
    }

    public async sendMailToUser(to: string, subject: string, text: string, html?: string) {
        try {
            const info = await this.transporter.sendMail({
                from: process.env.SMTP_USER,
                to,
                subject,
                text,
                html
            });
            console.log('Email sent:', info.messageId);
            return info;
        } catch (error) {
            console.error('Error sending email:', error);
            throw error;
        }
    }
     public async sendMailToAdmin (from: string, subject: string, text: string, html?: string) {
        try {
            const info = await this.transporter.sendMail({
                from:from,
                to:process.env.SMTP_USER,
                subject,
                text,
                html
            });
            console.log('Email sent:', info.messageId);
            return info;
        } catch (error) {
            console.error('Error sending email:', error);
            throw error;
        }
    }
}

   

export default Mailer;

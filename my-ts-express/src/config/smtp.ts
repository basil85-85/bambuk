// src/config/smtp.ts
import nodemailer, { Transporter } from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

interface EmailOptions {
  to: string;
  subject: string;
  text: string;
  html?: string;
  from?: string;
}

class Mailer {
  private transporter: Transporter;
  private defaultFromAddress: string;

  constructor() {
    this.defaultFromAddress = process.env.SMTP_USER || '';
    
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: process.env.SMTP_PORT === '465', 
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      },
      // Add additional options for better reliability
      pool: true,
      maxConnections: 5,
      maxMessages: 100,
      rateLimit: 14 // max emails per second
    });

    // Verify connection configuration
    this.verifyConnection();
  }

  private async verifyConnection(): Promise<void> {
    try {
      await this.transporter.verify();
      console.log('SMTP connection verified successfully');
    } catch (error) {
      console.error('SMTP connection failed:', error);
    }
  }

  public async sendMailToUser(to: string, subject: string, text: string, html?: string) {
    const emailOptions: EmailOptions = {
      to,
      subject,
      text,
      html,
      from: `Bambuk Team <${this.defaultFromAddress}>`
    };

    return this.sendEmail(emailOptions);
  }

  public async sendMailToAdmin(userEmail: string, subject: string, text: string, html?: string) {
    const adminEmail = process.env.ADMIN_EMAIL || this.defaultFromAddress;
    
    const emailOptions: EmailOptions = {
      to: adminEmail,
      subject,
      text,
      html,
      from: `Bambuk System <${this.defaultFromAddress}>`,
    };

    return this.sendEmail(emailOptions);
  }

  public async sendWelcomeCoupon(to: string, couponCode: string) {
    const subject = "🎁 Welcome Gift: Your Exclusive Bambuk Coupon!";
    const text = `Welcome to Bambuk! Use coupon code ${couponCode} for 10% off your first order.`;
    const html = `
      <div style="font-family: Arial, sans-serif; font-size: 15px; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto;">
        <div style="text-align: center; padding: 20px 0; border-bottom: 2px solid #e63946;">
          <h1 style="color: #e63946; margin: 0;">Bambuk</h1>
        </div>
        
        <div style="padding: 30px 20px; text-align: center;">
          <h2 style="color: #e63946;">🎁 Welcome Gift Inside!</h2>
          <p>As a thank you for joining our community, here's a special welcome gift:</p>
          
          <div style="background: linear-gradient(135deg, #e63946, #f77f00); color: white; padding: 25px; border-radius: 15px; margin: 30px 0; display: inline-block;">
            <h3 style="margin: 0 0 10px 0; font-size: 24px;">10% OFF</h3>
            <p style="margin: 0 0 15px 0; font-size: 18px;">Your First Order</p>
            <div style="background: white; color: #333; padding: 15px; border-radius: 8px; font-weight: bold; letter-spacing: 2px; font-size: 20px;">
              ${couponCode}
            </div>
          </div>
          
          <p><strong>How to use:</strong></p>
          <ol style="text-align: left; display: inline-block;">
            <li>Browse our collection when we launch on November 1st</li>
            <li>Add your favorite pieces to cart</li>
            <li>Enter code <strong>${couponCode}</strong> at checkout</li>
            <li>Enjoy 10% off your order!</li>
          </ol>
          
          <p style="margin-top: 30px;"><em>*Valid for 30 days from the launch date. Cannot be combined with other offers.</em></p>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
            <p>Happy shopping!<br><strong>The Bambuk Team 👗</strong></p>
          </div>
        </div>
      </div>
    `;

    const emailOptions: EmailOptions = {
      to,
      subject,
      text,
      html,
      from: `Bambuk Team <${this.defaultFromAddress}>`
    };

    return this.sendEmail(emailOptions);
  }

  private async sendEmail(options: EmailOptions) {
    try {
      const info = await this.transporter.sendMail({
        from: options.from || this.defaultFromAddress,
        to: options.to,
        subject: options.subject,
        text: options.text,
        html: options.html
      });

      console.log(`Email sent successfully to ${options.to}:`, info.messageId);
      return info;

    } catch (error) {
      console.error(`Failed to send email to ${options.to}:`, error);
      throw error;
    }
  }

  // Utility method to send bulk emails
  public async sendBulkEmails(emails: EmailOptions[]): Promise<void> {
    const promises = emails.map(email => this.sendEmail(email));
    
    try {
      await Promise.allSettled(promises);
      console.log(`Bulk email sending completed for ${emails.length} emails`);
    } catch (error) {
      console.error('Error in bulk email sending:', error);
      throw error;
    }
  }

  // Clean up connections when shutting down
  public close(): void {
    this.transporter.close();
    console.log('SMTP transporter closed');
  }
}

export default Mailer;
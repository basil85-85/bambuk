// src/services/subscriptionService.ts
import SubscriberRepository from "../repositories/email.repositories";
import Mailer from "../config/smtp";
import { ISubscriber } from "../models/Subscriber";

const mailer = new Mailer();

class SubscriptionService {
  async addSubscriber(email: string): Promise<ISubscriber> {
    try {
      // Check if email already exists
      const existing = await SubscriberRepository.findByEmail(email);
      if (existing) {
        throw new Error("Email already subscribed");
      }

      // Save subscriber to database
      const subscriber = await SubscriberRepository.create(email);
      console.log("Subscriber saved to database:", subscriber.email);

      // Send confirmation email to user (non-blocking)
      this.sendConfirmationEmail(email).catch(error => {
        console.error("Failed to send confirmation email:", error);
      });

      // Send notification to admin (non-blocking)
      this.sendAdminNotification(email).catch(error => {
        console.error("Failed to send admin notification:", error);
      });

      return subscriber;

    } catch (error) {
      console.error("Error in addSubscriber:", error);
      throw error; // Re-throw to let controller handle
    }
  }

  private async sendConfirmationEmail(email: string): Promise<void> {
    const subject = "🎉 You're Subscribed to Bambuk!";
    const textContent = `Hi there! Thank you for subscribing with ${email}.`;
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; font-size: 15px; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto;">
        <div style="text-align: center; padding: 20px 0; border-bottom: 2px solid #e63946;">
          <h1 style="color: #e63946; margin: 0;">Bambuk</h1>
        </div>
        
        <div style="padding: 30px 20px;">
          <h2 style="color: #e63946; margin-top: 0;">Welcome to the Bambuk Family!</h2>
          <p>Hi there,</p>
          <p>Thank you for subscribing with <strong>${email}</strong>!</p>
          <p>We're excited to have you on board. You'll be the first to know when our exclusive <strong>Bambuk Dress Collection</strong> launches on <strong>November 1st</strong>.</p>
          
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p style="margin-top: 0;"><strong>✨ Here's what to expect:</strong></p>
            <ul style="margin: 10px 0;">
              <li>Early access to our launch</li>
              <li>Special subscriber-only offers</li>
              <li>Style tips and sneak peeks</li>
              <li>Exclusive discount codes</li>
            </ul>
          </div>

          <p><strong>Follow us for the latest updates:</strong></p>
          <p>📸 <a href="https://instagram.com/bambukcollection" style="color: #e63946; text-decoration: none;">Instagram</a></p>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
            <p>Thanks again, and stay stylish!<br><strong>The Bambuk Team 👗</strong></p>
          </div>
        </div>
      </div>
    `;

    await mailer.sendMailToUser(email, subject, textContent, htmlContent);
  }

  private async sendAdminNotification(email: string): Promise<void> {
    const subject = "📥 New Bambuk Subscriber";
    const textContent = `A new user just subscribed to Bambuk with email: ${email}`;
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; font-size: 15px; line-height: 1.6; color: #333;">
        <h2 style="color: #1d3557;">📬 New Subscriber Alert</h2>
        <p>A new subscriber has joined the Bambuk mailing list:</p>
        
        <div style="background: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <ul style="list-style: none; padding: 0; margin: 0;">
            <li style="margin: 5px 0;"><strong>Email:</strong> ${email}</li>
            <li style="margin: 5px 0;"><strong>Subscribed on:</strong> ${new Date().toLocaleString()}</li>
            <li style="margin: 5px 0;"><strong>Source:</strong> Coming Soon Page</li>
          </ul>
        </div>
        
        <p>Make sure to check your subscriber database or CRM to verify this contact was properly captured.</p>
        
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
        <p style="font-size: 13px; color: #888; margin: 0;">
          This is an automated notification from the Bambuk website.
        </p>
      </div>
    `;

    await mailer.sendMailToAdmin(email, subject, textContent, htmlContent);
  }

  async getSubscribers(): Promise<ISubscriber[]> {
    try {
      return await SubscriberRepository.findAll();
    } catch (error) {
      console.error("Error fetching subscribers:", error);
      throw new Error("Failed to fetch subscribers");
    }
  }

  async getSubscriberCount(): Promise<number> {
    try {
      const subscribers = await this.getSubscribers();
      return subscribers.length;
    } catch (error) {
      console.error("Error getting subscriber count:", error);
      throw new Error("Failed to get subscriber count");
    }
  }

//   async unsubscribe(email: string): Promise<boolean> {
//     try {
//       const result = await SubscriberRepository.deleteByEmail(email);
//       if (result) {
//         console.log("Subscriber unsubscribed:", email);
//       }
//       return result;
//     } catch (error) {
//       console.error("Error unsubscribing:", error);
//       throw new Error("Failed to unsubscribe");
//     }
//   }
}

export default new SubscriptionService();
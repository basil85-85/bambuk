// src/controller/commingSoon.ts
import { Request, Response } from "express";
import Mailer from "../config/smtp";

const mailer = new Mailer();

class SoonController {
  // Public methods exposed to router
  public showCommingSoon = (req: Request, res: Response) =>
    this._showCommingSoon(req, res);
  public sendingToEmail = (req: Request, res: Response) =>
    this._sendingToEmail(req, res);

  private _showCommingSoon(req: Request, res: Response): void {
    res.render("commingSoon");
  }

  private async _sendingToEmail(req: Request, res: Response): Promise<void> {
    const { email } = req.body;

    if (!email) {
      res.status(400).send("Email is required.");
      return;
    }

    console.log("New subscriber email:", email);

    try {
      // Send a confirmation email to the subscriber
      await mailer.sendMailToUser(
        email,
        "🎉 You're Subscribed to Bambuk!",
        `Hi there! Thank you for subscribing with ${email}.`,
        `
                <div style="font-family:Arial, sans-serif; font-size:15px; line-height:1.6; color:#333;">
                <h2 style="color:#e63946;">Welcome to the Bambuk Family!</h2>
                <p>Hi there,</p>
                <p>Thank you for subscribing with <strong>${email}</strong>!</p>
                <p>We're excited to have you on board. You’ll be the first to know when our exclusive <strong>Bambuk Dress Collection</strong> launches on <strong>November 1st</strong>.</p>
                <p>✨ Here's what to expect:</p>
                <ul>
                    <li>Early access to our launch</li>
                    <li>Special subscriber-only offers</li>
                    <li>Style tips and sneak peeks </li>
                </ul>
                <p>Follow us for the latest updates:</p>
                <p>
        📸 <a href="https://instagram.com/yourbrand" style="color:#e63946;">Instagram</a><br>
        
      </p>
      <p>Thanks again, and stay stylish!<br>The Bambuk Team 👗</p>
    </div>
  `
      );

      // Optionally, notify admin
      await mailer.sendMailToAdmin(
        email,
        "📥 New Bambuk Subscriber",
        `A new user just subscribed to Bambuk with email: ${email}`,
        `
    <div style="font-family:Arial, sans-serif; font-size:15px; line-height:1.6; color:#333;">
      <h2 style="color:#1d3557;">📬 New Subscriber Alert</h2>
      <p>A new subscriber has joined the list:</p>
      <ul>
        <li><strong>Email:</strong> ${email}</li>
        <li><strong>Subscribed on:</strong> ${new Date().toLocaleString()}</li>
        <li><strong>Source:</strong> Coming Soon Page</li>
      </ul>
      <p>Check the subscriber database or CRM to make sure this contact is captured.</p>
      <hr>
      <p style="font-size:13px; color:#888;">This is an automated notification from the Bambuk website.</p>
    </div>
  `
      );

      res.send(`Thanks! ${email} has been added to our list.`);
    } catch (error) {
      console.error("Error sending email:", error);
      res
        .status(500)
        .send(
          "There was an error processing your subscription. Please try again later."
        );
    }
  }
}

export default new SoonController();

import { Request, Response } from "express";
import SubscriptionService from "../services/SubscriptionService";
import { validateEmail } from "../utils/validation";

class SoonController {
  // Public methods exposed to router
  public showCommingSoon = (req: Request, res: Response) =>
    this._showCommingSoon(req, res);
  
  public subscribeEmail = (req: Request, res: Response) =>
    this._subscribeEmail(req, res);

  private _showCommingSoon(req: Request, res: Response): void {
    res.render("commingSoon");
  }

  private async _subscribeEmail(req: Request, res: Response): Promise<void> {
    try {
      const { email } = req.body;

      // Validate input
      if (!email) {
        res.status(400).json({
          success: false,
          message: "Email is required."
        });
        return;
      }

      if (!validateEmail(email)) {
        res.status(400).json({
          success: false,
          message: "Please provide a valid email address."
        });
        return;
      }

      console.log("Processing new subscriber:", email);

      // Use service to handle subscription logic
      const subscriber = await SubscriptionService.addSubscriber(email);

      res.status(200).json({
        success: true,
        message: "Thank you for subscribing! Check your email for confirmation.",
        data: {
          email: subscriber.email,
          subscribedAt: subscriber.createdAt
        }
      });

    } catch (error: any) {
      console.error("Subscription error:", error);

      // Handle specific known errors
      if (error.message === "Email already subscribed") {
        res.status(409).json({
          success: false,
          message: "This email is already subscribed to our updates."
        });
        return;
      }

      // Generic error response
      res.status(500).json({
        success: false,
        message: "There was an error processing your subscription. Please try again later."
      });
    }
  }
}

export default new SoonController();
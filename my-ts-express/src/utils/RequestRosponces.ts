import { Response } from "express";

export default class ResponseHandler {
  static sendSuccess(res: Response, data: any, status = 200) {
    res.status(status).json({ success: true, data });
  }

  static sendError(res: Response, message: string | string[], status = 400) {
    res.status(status).json({ success: false, message });
  }
}
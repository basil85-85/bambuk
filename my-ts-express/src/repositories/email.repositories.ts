import Subscriber, { ISubscriber } from "../models/Subscriber";

class SubscriberRepository {
  async create(email: string): Promise<ISubscriber> {
    const subscriber = new Subscriber({ email });
    return subscriber.save();
  }

  async findByEmail(email: string): Promise<ISubscriber | null> {
    return Subscriber.findOne({ email });
  }

  async findAll(): Promise<ISubscriber[]> {
    return Subscriber.find().sort({ createdAt: -1 });
  }
}

export default new SubscriberRepository();
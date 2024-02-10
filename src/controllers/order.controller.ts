import orderService from "../services/order.service";
import { Request, Response } from "express";
import messages from "../utilities/messages";
const orderController = {
  store: async (req: Request, res: Response) => {
    try {
      let order = await orderService.store(req, res);
      return res.status(200).json({ data: order,message: messages.createdSuccessfully });
    } catch (error: unknown) {
      if (error instanceof Error) {
        return res.status(400).json({ error: error.message });
      } else {
        return res.status(500).json({ error: messages.serverError });
      }
    }
  },
};

export default orderController;

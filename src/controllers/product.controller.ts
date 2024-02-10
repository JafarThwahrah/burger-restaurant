import productService from "../services/product.service";
import { Request, Response } from "express";
import messages from "../utilities/messages";

const productController = {
  getAll: async (req: Request, res: Response) => {
    try {
        const page:number = parseInt(req.query.page as string) || 1;
        let products = await productService.getAll(page);
      return res.status(200).json({data: products, message: messages.productList });
    } catch (error:any) {
    //   if (error instanceof Error) {
        return res.status(400).json({ error: error.message });
    //   } 
    }
  },
};

export default productController;

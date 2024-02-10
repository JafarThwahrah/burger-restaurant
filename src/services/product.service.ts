import prisma from "./prisma.service";

const productService = {
    getAll: async (page: number) => {
        let pageSize = 5;
        const skip = (page - 1) * pageSize;
        const products = await prisma.product.findMany({
            skip: skip,
            take: pageSize,
        });
        return products;
    },
};

export default productService;

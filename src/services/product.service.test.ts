import prisma from "./prisma.service";
import productService from "./product.service";

// Mock Prisma methods
jest.mock("./prisma.service", () => ({
  __esModule: true,
  default: {
    product: {
      findMany: jest.fn(),
    },
  },
}));

describe("Product Service", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should fetch products with pagination", async () => {
    // Mock data
    const mockProducts = [
      { id: 1, name: "Product 1" },
      { id: 2, name: "Product 2" },
      { id: 3, name: "Product 3" },
    ];

    // Mock Prisma method to return mockProducts
    (prisma.product.findMany as jest.Mock).mockResolvedValueOnce(mockProducts);

    // Call getAll method with page 1
    const page = 1;
    const pageSize = 5;
    const skip = (page - 1) * pageSize;
    const expectedQueryOptions = {
      skip: skip,
      take: pageSize,
    };
    const products = await productService.getAll(page);

    // Assertions
    expect(prisma.product.findMany).toHaveBeenCalledWith(expectedQueryOptions);
    expect(products).toEqual(mockProducts);
  });
});

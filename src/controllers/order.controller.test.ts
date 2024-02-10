import orderService from "../services/order.service";
import { Request, Response } from "express";
import messages from "../utilities/messages";

// Mock the orderService.store function
const mockOrderServiceStore = orderService.store as jest.Mock;
jest.mock("../services/order.service", () => ({
  store: jest.fn(),
}));

import orderController from "./order.controller";

describe("POST /orders/store", () => {
  it("responds with JSON and calls orderService.store function", async () => {
    // Mock request and response objects
    const req = {} as Request;
    const res = {} as Response;
    res.status = jest.fn(() => res);
    res.json = jest.fn();

    // Mock the orderService.store function to return some data
    const mockOrderData = { id: 1, status: "pending" };
    mockOrderServiceStore.mockResolvedValueOnce(mockOrderData);

    // Make a POST request to the /orders/store endpoint
    await orderController.store(req, res);

    // Expect the response to have a JSON content type and a status code of 200
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      data: mockOrderData,
      message: messages.createdSuccessfully,
    });

    // Expect orderService.store function to have been called
    expect(mockOrderServiceStore).toHaveBeenCalled();
  });

  it("handles errors properly", async () => {
    // Mock request and response objects
    const req = {} as Request;
    const res = {} as Response;
    res.status = jest.fn(() => res);
    res.json = jest.fn();

    // Mock the orderService.store function to throw an error
    const mockError = new Error("Internal Server Error");
    mockOrderServiceStore.mockRejectedValueOnce(mockError);

    // Make a POST request to the /orders/store endpoint
    await orderController.store(req, res);

    // Expect the response to have a JSON content type and a status code of 400
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: mockError.message });

    // Expect orderService.store function to have been called
    expect(mockOrderServiceStore).toHaveBeenCalled();
  });
});

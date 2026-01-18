import express from "express";
import { validateRequestBody } from "../../validators/index.js";
import { createBookingSchema } from "../../validators/booking.validator.js";
import {
  confirmBookingHandler,
  createBookingHandler,
} from "../../controllers/booking.controller.js";

const bookingRouter = express.Router();

bookingRouter.post(
  "/",
  validateRequestBody(createBookingSchema),
  createBookingHandler,
);
bookingRouter.post("/confirm/:idempotencyKey", confirmBookingHandler);

export default bookingRouter;

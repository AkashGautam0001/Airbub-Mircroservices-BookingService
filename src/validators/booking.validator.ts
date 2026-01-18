import { z } from "zod";

export const createBookingSchema = z.object({
  userId: z.number({ message: "User id is required" }),
  hotelId: z.number({ message: "Hotel id is required" }),
  totalGuests: z.number({ message: "Total guests is required" }),
  bookingAmount: z.number({ message: "Booking amount is required" }),
});

import { Prisma } from "@prisma/client";
import prismaClient from "../prisma/client.js";

export async function createBooking(bookingInput: Prisma.BookingCreateInput) {
  const booking = await prismaClient.booking.create({
    data: bookingInput,
  });

  return booking;
}

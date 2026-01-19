import { CreateBookingDTO } from "../dto/booking.dto.js";
import {
  confirmBooking,
  createBooking,
  createIdempotencyKey,
  finalizeIdempotencyKey,
  getIdempotencyKeyWithLock,
} from "../repositories/booking.repository.js";
import { BadRequestError, NotFoundError } from "../utils/errors/app.error.js";
import { generateIdempotencyKey } from "../utils/generateIdempotencyKey.js";
import prismaClient from "../prisma/client.js";
import { redlock } from "../config/redis.config.js";
import logger from "../config/logger.config.js";

export async function createBookingService(createBookingDTO: CreateBookingDTO) {
  const ttl = 5 * 60 * 1000; // 5 minutes
  const bookingResource = `hotel:${createBookingDTO.hotelId}`;

  try {
    await redlock.acquire([bookingResource], ttl);
    const booking = await createBooking({
      userId: createBookingDTO.userId,
      hotelId: createBookingDTO.hotelId,
      totalGuests: createBookingDTO.totalGuests,
      bookingAmount: createBookingDTO.bookingAmount,
    });

    const idempotencyKey = generateIdempotencyKey();
    await createIdempotencyKey(idempotencyKey, booking.id);

    return { bookingId: booking.id, idempotencyKey };
  } catch (err) {
    logger.error(err);
    throw new BadRequestError("Could not acquire lock");
  }
}

export async function confirmBookingService(idempotencyKey: string) {
  return await prismaClient.$transaction(async (tx) => {
    const idempotencyKeyData = await getIdempotencyKeyWithLock(
      tx,
      idempotencyKey,
    );

    if (!idempotencyKeyData || !idempotencyKeyData.bookingId) {
      throw new NotFoundError("Idempotency key not found");
    }
    if (idempotencyKeyData.finalized) {
      throw new BadRequestError("Idempotency key already finalized");
    }

    const booking = await confirmBooking(tx, idempotencyKeyData.bookingId);
    await finalizeIdempotencyKey(tx, idempotencyKey);

    return booking;
  });
}

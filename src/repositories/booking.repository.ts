import { IdempotencyKey, Prisma } from "@prisma/client";
import prismaClient from "../prisma/client.js";
import { BadRequestError, NotFoundError } from "../utils/errors/app.error.js";
import { validate as isValidUUID } from "uuid";

export async function createBooking(bookingInput: Prisma.BookingCreateInput) {
  const booking = await prismaClient.booking.create({
    data: bookingInput,
  });

  return booking;
}
export async function createIdempotencyKey(key: string, bookingId: number) {
  const idempotencyKey = await prismaClient.idempotencyKey.create({
    data: {
      key,
      booking: {
        connect: {
          id: bookingId,
        },
      },
    },
  });

  return idempotencyKey;
}

export async function getIdempotencyKey(key: string) {
  const idempotencyKey = await prismaClient.idempotencyKey.findUnique({
    where: {
      key,
    },
  });
  return idempotencyKey;
}

export async function getIdempotencyKeyWithLock(
  tx: Prisma.TransactionClient,
  key: string,
) {
  if (!isValidUUID(key)) {
    throw new BadRequestError("Invalid idempotency key format");
  }
  const idempotencyKey: Array<IdempotencyKey> = await tx.$queryRaw`
    SELECT * FROM IdempotencyKey
    WHERE \`key\` = ${key}
    FOR UPDATE;
  `;

  if (!idempotencyKey || idempotencyKey.length === 0) {
    throw new NotFoundError("Idempotency key not found");
  }

  return idempotencyKey[0];
}

export async function getBookingById(bookingId: number) {
  const booking = await prismaClient.booking.findUnique({
    where: {
      id: bookingId,
    },
  });
  return booking;
}

export async function changeBookingStatus(
  bookingId: number,
  status: Prisma.EnumBookingStatusFieldUpdateOperationsInput,
) {
  const booking = await prismaClient.booking.update({
    where: {
      id: bookingId,
    },
    data: {
      status: status,
    },
  });
  return booking;
}

export async function confirmBooking(
  tx: Prisma.TransactionClient,
  bookingId: number,
) {
  const booking = await tx.booking.update({
    where: {
      id: bookingId,
    },
    data: {
      status: "CONFIRMED",
    },
  });
  return booking;
}

export async function cancelBooking(bookingId: number) {
  const booking = await prismaClient.booking.update({
    where: {
      id: bookingId,
    },
    data: {
      status: "CANCELLED",
    },
  });
  return booking;
}

export async function finalizeIdempotencyKey(
  tx: Prisma.TransactionClient,
  key: string,
) {
  const idempotencyKey = await tx.idempotencyKey.update({
    where: {
      key,
    },
    data: {
      finalized: true,
    },
  });
  return idempotencyKey;
}

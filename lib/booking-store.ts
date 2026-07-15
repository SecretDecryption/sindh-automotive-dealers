import type { Booking } from "@/lib/booking";

type RedisResponse<T> = {
  result?: T;
  error?: string;
};

const redisUrl = process.env.UPSTASH_REDIS_REST_URL ?? process.env.KV_REST_API_URL;
const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN ?? process.env.KV_REST_API_TOKEN;
const keyPrefix = "sindh:test-drives";

function dayKey(date: string) {
  return `${keyPrefix}:times:${date}`;
}

function bookingKey(date: string, time: string) {
  return `${keyPrefix}:booking:${date}:${time}`;
}

async function redisCommand<T>(command: Array<string | number>): Promise<T> {
  if (!redisUrl || !redisToken) {
    throw new Error("Booking storage is not configured.");
  }

  const response = await fetch(redisUrl, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${redisToken}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(command),
    cache: "no-store"
  });

  const payload = (await response.json()) as RedisResponse<T>;

  if (!response.ok || payload.error || payload.result === undefined) {
    throw new Error(payload.error ?? "Booking storage could not be reached.");
  }

  return payload.result;
}

export function isBookingStoreConfigured() {
  return Boolean(redisUrl && redisToken);
}

export async function getBookedTimes(date: string) {
  return redisCommand<string[]>(["SMEMBERS", dayKey(date)]);
}

export async function reserveBookingSlot(date: string, time: string) {
  const added = await redisCommand<number>(["SADD", dayKey(date), time]);
  return added === 1;
}

export async function saveBooking(booking: Booking) {
  await redisCommand<string>(["SET", bookingKey(booking.date, booking.time), JSON.stringify(booking)]);
}

export async function releaseBookingSlot(date: string, time: string) {
  await Promise.all([
    redisCommand<number>(["SREM", dayKey(date), time]),
    redisCommand<number>(["DEL", bookingKey(date, time)])
  ]);
}

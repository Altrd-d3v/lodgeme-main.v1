export const SERVICE_FEE_RATE = 0.02;

export const serviceFee = (rent: number) => Math.round(rent * SERVICE_FEE_RATE);

export const totalWithFee = (rent: number) => rent + serviceFee(rent);

export type BookingStatus =
  | "received"
  | "reviewing"
  | "unavailable"
  | "available"
  | "awaiting_payment"
  | "completed"
  | "cancelled";

export const statusLabels: Record<BookingStatus, string> = {
  received: "Request received",
  reviewing: "LodgeMe reviewing",
  unavailable: "Room unavailable",
  available: "Availability confirmed",
  awaiting_payment: "Awaiting payment",
  completed: "Completed",
  cancelled: "Cancelled",
};

export const statusBlurb: Record<BookingStatus, string> = {
  received: "We have your request and a booking reference. Our team picks it up next.",
  reviewing: "A LodgeMe agent is contacting the landlord to check the room is still free.",
  unavailable: "That room is gone. We're sending you similar rooms around the same campus.",
  available: "The landlord confirmed the room. We'll set up your inspection and payment.",
  awaiting_payment: "Inspection passed. Pay LodgeMe — never the landlord directly.",
  completed: "Payment confirmed and the room is yours. Confirmation sent to your email.",
  cancelled: "This request was cancelled.",
};

export const statusFlow: BookingStatus[] = [
  "received",
  "reviewing",
  "available",
  "awaiting_payment",
  "completed",
];

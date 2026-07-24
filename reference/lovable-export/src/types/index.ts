// Central domain types. These mirror the future Prisma schema — keep field
// names and enums stable so migration to Prisma models is a rename job.

export type ISODate = string; // YYYY-MM-DD
export type ISODateTime = string; // full ISO string
export type UUID = string;

// -------- Users & auth --------

export type UserRole = "EMPLOYEE" | "MANAGER" | "ADMIN";
export type UserStatus = "ACTIVE" | "INVITED" | "DEACTIVATED";
export type InvitationStatus = "PENDING" | "ACCEPTED" | "EXPIRED" | "REVOKED";

export interface User {
  id: UUID;
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  invitationStatus?: InvitationStatus;
  lastLoginAt?: ISODateTime;
  createdAt: ISODateTime;
}

export interface Session {
  user: User;
  expiresAt: ISODateTime;
}

// -------- Reservations --------

export type ReservationStatus =
  | "PENDING"
  | "CONFIRMED"
  | "SEATED"
  | "COMPLETED"
  | "CANCELLED"
  | "NO_SHOW";

export type ReservationSource =
  | "WEBSITE"
  | "TELEPHONE"
  | "EMAIL"
  | "WALK_IN"
  | "STAFF_ENTRY";

export type ReservationOccasion =
  | "NORMAL"
  | "BIRTHDAY"
  | "BUSINESS"
  | "FAMILY"
  | "ANNIVERSARY"
  | "OTHER";

export interface Customer {
  id: UUID;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  notes?: string;
}

export interface ReservationNote {
  id: UUID;
  reservationId: UUID;
  authorId: UUID;
  authorName: string;
  body: string;
  createdAt: ISODateTime;
}

export interface Reservation {
  id: UUID;
  reservationNumber: string; // human-friendly, e.g. STA-2026-000123
  date: ISODate;
  time: string; // HH:mm
  partySize: number;
  seatingAreaId?: UUID;
  customer: Customer;
  occasion: ReservationOccasion;
  message?: string;
  status: ReservationStatus;
  source: ReservationSource;
  assignedEmployeeId?: UUID;
  createdAt: ISODateTime;
  updatedAt: ISODateTime;
  deletedAt?: ISODateTime;
}

// -------- Events --------

export type EventStatus = "DRAFT" | "PUBLISHED" | "ARCHIVED" | "CANCELLED";
export type EventVisibility = "PUBLIC" | "STAFF_ONLY";

export interface RestaurantEvent {
  id: UUID;
  title: string;
  slug: string;
  shortDescription: string;
  fullDescription: string;
  startDate: ISODate;
  startTime: string;
  endDate: ISODate;
  endTime: string;
  imageUrl?: string;
  capacity?: number;
  reservationRequired: boolean;
  bookingLink?: string;
  visibility: EventVisibility;
  status: EventStatus;
  createdBy: UUID;
  updatedBy: UUID;
  createdAt: ISODateTime;
  updatedAt: ISODateTime;
  deletedAt?: ISODateTime;
}

// -------- Seating --------

export interface SeatingArea {
  id: UUID;
  name: string;
  description: string;
  capacity: number;
  minPartySize: number;
  maxPartySize: number;
  publiclyBookable: boolean;
  currentlyOpen: boolean;
  displayOrder: number;
}

// -------- Opening hours --------

export type Weekday = 0 | 1 | 2 | 3 | 4 | 5 | 6; // Sun..Sat

export interface OpeningSlot {
  open: string; // HH:mm
  close: string; // HH:mm
}

export interface DailyOpeningHours {
  weekday: Weekday;
  closed: boolean;
  slots: OpeningSlot[];
  bookingSlots?: OpeningSlot[];
  note?: string;
}

export interface SpecialOpeningDate {
  id: UUID;
  date: ISODate;
  closed: boolean;
  slots: OpeningSlot[];
  publicMessage?: string;
}

// -------- Audit & notifications --------

export type AuditAction =
  | "RESERVATION_CREATED"
  | "RESERVATION_UPDATED"
  | "RESERVATION_STATUS_CHANGED"
  | "RESERVATION_NOTE_ADDED"
  | "RESERVATION_DELETED"
  | "RESERVATION_RESTORED"
  | "EVENT_CREATED"
  | "EVENT_PUBLISHED"
  | "EVENT_HIDDEN"
  | "USER_INVITED"
  | "USER_ROLE_CHANGED"
  | "USER_DEACTIVATED"
  | "OPENING_HOURS_CHANGED"
  | "CAPACITY_CHANGED";

export interface AuditLog {
  id: UUID;
  actorId: UUID;
  actorName: string;
  action: AuditAction;
  entityType: "Reservation" | "Event" | "User" | "SeatingArea" | "OpeningHours";
  entityId: UUID;
  summary: string;
  details?: Record<string, unknown>;
  createdAt: ISODateTime;
}

export interface Notification {
  id: UUID;
  kind:
    | "NEW_RESERVATION"
    | "CANCELLATION"
    | "LARGE_GROUP"
    | "UNCONFIRMED"
    | "CUSTOMER_MESSAGE"
    | "CAPACITY_WARNING"
    | "UPCOMING_EVENT";
  title: string;
  body: string;
  createdAt: ISODateTime;
  read: boolean;
  link?: string;
}

// -------- Menu (frontend-only demo content) --------

export interface MenuCategory {
  id: string;
  title: string;
  description?: string;
  items: MenuItem[];
}

export interface MenuItem {
  id: string;
  name: string;
  description?: string;
  priceCHF?: number;
  labels?: string[]; // e.g. "vegetarisch", "regional"
  unverified?: boolean;
}

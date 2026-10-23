import { normalizeComplaints, type RoomComplaint } from "./complaints";
import {
  normalizeInventory,
  normalizeInventoryFiles,
  splitInventoryRows,
  type InventoryFile,
  type InventoryItem,
} from "./inventory";
import { bankRowsFromHotel, normalizeBankRows, type BankRow } from "./bank-recon";
import { guestCardsFromHotel, normalizeGuestCards, type GuestCard } from "./guest-cards";
import { gstBillsFromHotel, gstIdsFromHotel, withGuestGst } from "./invoice";
import { contactsFromHotel, normalizeContacts, type HotelContact } from "./contacts";
import { corporatesFromHotel, normalizeCorporates, type CorporateCompany } from "./corporates";
import { agentsFromHotel, normalizeAgents, type TravelAgent } from "./agents";
import { monthDrawsFromHotel, normalizeMonthDraws, type MonthDraw } from "./month-draw";
import { monthOpeningsFromHotel, normalizeMonthOpenings, type MonthOpening } from "./month-opening";
import {
  keepMonthArchives,
  monthArchivesFromHotel,
  normalizeMonthArchives,
  type MonthArchive,
} from "./month-archive";
import { normalizeReminders, remindersFromHotel, type HotelReminder } from "./reminders";
import {
  hotelFromCloud,
  lockRevFromHotel,
  locksFromHotel,
  openMonthsFromHotel,
  parseLockedDates,
  parseLockRev,
} from "./register-lock";
import { deletedFromHotel, mergeSealed, parseSealedIds, sealedFromHotel, type SealedIds } from "./sheet-seal";
import type {
  AdvanceRow,
  CreditGuest,
  GuestEntry,
  HotelInfo,
  JanFood,
  JanSale,
  ModeAmount,
  NamedAmount,
  OpeningBalances,
  OtaRow,
  RoomDef,
  StaffRow,
} from "./types";
import { normalizeStaffProfiles, type StaffProfile } from "./types";
import { normalizeCashCounts, type CashCount } from "./cash-count";
import { normalizePayrollFiles, type PayrollFile } from "./payroll-files";

export type LedgerSnapshot = {
  hotel: HotelInfo;
  opening: OpeningBalances;
  rooms: RoomDef[];
  guests: GuestEntry[];
  food: ModeAmount[];
  wholesale: ModeAmount[];
  expenses: NamedAmount[];
  balReceived: NamedAmount[];
  staff: StaffRow[];
  staffRegister?: StaffProfile[];
  payrollFiles?: PayrollFile[];
  advances: AdvanceRow[];
  ota: OtaRow[];
  janSales: JanSale[];
  janFood: JanFood[];
  creditGuests: CreditGuest[];
  selectedDate: string;
  openingDate: string;
  securityCode: string;
  lockedDates?: Record<string, true>;
  lockRev?: Record<string, number>;
  sealedIds?: SealedIds;
  deletedIds?: SealedIds;
  inventory?: InventoryItem[];
  inventoryFiles?: InventoryFile[];
  complaints?: RoomComplaint[];
  reminders?: HotelReminder[];
  contacts?: HotelContact[];
  corporates?: CorporateCompany[];
  agents?: TravelAgent[];
  monthDraws?: MonthDraw[];
  monthOpenings?: MonthOpening[];
  monthArchives?: MonthArchive[];
  openMonths?: string[];
  guestCards?: GuestCard[];
  bankRows?: BankRow[];
  cashCounts?: CashCount[];
  savedAt?: number;
  cloudUpdatedAt?: string;
};

const FLOORS: RoomDef["floor"][] = ["Ground", "First", "Second", "Third"];

function num(v: unknown): number {
  const n = typeof v === "number" ? v : Number(v);
  return Number.isFinite(n) ? n : 0;
}

function str(v: unknown): string {
  return typeof v === "string" ? v : v == null ? "" : String(v);
}

function dateStr(v: unknown, fallback = ""): string {
  if (typeof v === "string" && v) return v.slice(0, 10);
  return fallback;
}

function nullableDate(v: unknown): string | null {
  if (v == null || v === "") return null;
  if (typeof v === "string") return v.slice(0, 10);
  return null;
}

function floorOf(v: unknown): RoomDef["floor"] {
  const f = str(v);
  return (FLOORS as string[]).includes(f) ? (f as RoomDef["floor"]) : "Ground";
}

function staffOf(row: StaffRow, i: number): StaffRow {
  return {
    ...row,
    id: row.id || `st-${i}`,
    extra: row.extra ?? 0,
    salary: num(row.salary),
    absent: num(row.absent),
    working: num(row.working),
    advance: num(row.advance),
    weekOff: num(row.weekOff),
    total: num(row.total),
  };
}

function advanceOf(row: AdvanceRow, i: number): AdvanceRow {
  return {
    ...row,
    id: row.id || `adv-${i}`,
    cash: num(row.cash),
    qrs: num(row.qrs),
  };
}

export function snapshotFromUnknown(
  raw: unknown,
  fallback: LedgerSnapshot,
): LedgerSnapshot {
  const p = (raw ?? {}) as Partial<LedgerSnapshot> & { hotel?: unknown };
  const hotel = hotelFromCloud(p.hotel, fallback.hotel);
  const lockedDates =
    p.lockedDates !== undefined
      ? parseLockedDates(p.lockedDates)
      : locksFromHotel(p.hotel);
  const lockRev =
    p.lockRev !== undefined
      ? parseLockRev(p.lockRev)
      : lockRevFromHotel(p.hotel) ?? {};
  return {
    hotel,
    opening: {
      cash: num(p.opening?.cash ?? fallback.opening.cash),
      santosh: num(p.opening?.santosh ?? fallback.opening.santosh),
      pk: num(p.opening?.pk ?? fallback.opening.pk),
      online: num(p.opening?.online ?? fallback.opening.online),
      outstanding: num(p.opening?.outstanding ?? fallback.opening.outstanding),
    },
    rooms: (p.rooms?.length ? p.rooms : fallback.rooms).map((r) => ({
      no: str(r.no),
      floor: floorOf(r.floor),
    })),
    guests: withGuestGst(
      (p.guests ?? fallback.guests) as GuestEntry[],
      gstIdsFromHotel(p.hotel),
      gstBillsFromHotel(p.hotel),
    ),
    food: (p.food ?? fallback.food) as ModeAmount[],
    wholesale: (p.wholesale ?? fallback.wholesale) as ModeAmount[],
    expenses: (p.expenses ?? fallback.expenses) as NamedAmount[],
    balReceived: (p.balReceived ?? fallback.balReceived) as NamedAmount[],
    staff: (p.staff ?? fallback.staff).map(staffOf),
    staffRegister: normalizeStaffProfiles(
      (p as { staffRegister?: StaffProfile[] }).staffRegister ??
        fallback.staffRegister,
    ),
    payrollFiles: normalizePayrollFiles(
      (p as { payrollFiles?: PayrollFile[] }).payrollFiles ?? fallback.payrollFiles,
    ),
    advances: (p.advances ?? fallback.advances).map(advanceOf),
    ota: (p.ota ?? fallback.ota) as OtaRow[],
    janSales: (p.janSales ?? fallback.janSales) as JanSale[],
    janFood: (p.janFood ?? fallback.janFood) as JanFood[],
    creditGuests: (p.creditGuests ?? fallback.creditGuests) as CreditGuest[],
    selectedDate: dateStr(p.selectedDate, fallback.selectedDate),
    openingDate: dateStr(p.openingDate, fallback.openingDate),
    securityCode: str(p.securityCode ?? fallback.securityCode),
    lockedDates,
    lockRev,
    sealedIds: mergeSealed(sealedFromHotel(p.hotel), parseSealedIds(p.sealedIds)),
    deletedIds: parseSealedIds(
      (p as { deletedIds?: unknown }).deletedIds ?? deletedFromHotel(p.hotel),
    ),
    inventory: normalizeInventory(
      splitInventoryRows(
        (p as { inventory?: InventoryItem[] }).inventory ?? fallback.inventory,
      ).items,
    ),
    inventoryFiles: normalizeInventoryFiles(
      (p as { inventoryFiles?: InventoryFile[] }).inventoryFiles ??
        splitInventoryRows(
          (p as { inventory?: InventoryItem[] }).inventory ?? fallback.inventory,
        ).files,
    ),
    complaints: normalizeComplaints(
      (p as { complaints?: RoomComplaint[] }).complaints ?? fallback.complaints,
    ),
    reminders: Array.isArray((p as { reminders?: HotelReminder[] }).reminders)
      ? normalizeReminders((p as { reminders?: HotelReminder[] }).reminders)
      : remindersFromHotel(p.hotel).length
        ? remindersFromHotel(p.hotel)
        : normalizeReminders(fallback.reminders),
    contacts: Array.isArray((p as { contacts?: HotelContact[] }).contacts)
      ? normalizeContacts((p as { contacts?: HotelContact[] }).contacts)
      : contactsFromHotel(p.hotel).length
        ? contactsFromHotel(p.hotel)
        : normalizeContacts(fallback.contacts),
    corporates: Array.isArray((p as { corporates?: CorporateCompany[] }).corporates)
      ? normalizeCorporates((p as { corporates?: CorporateCompany[] }).corporates)
      : corporatesFromHotel(p.hotel).length
        ? corporatesFromHotel(p.hotel)
        : normalizeCorporates(fallback.corporates),
    agents: Array.isArray((p as { agents?: TravelAgent[] }).agents)
      ? normalizeAgents((p as { agents?: TravelAgent[] }).agents)
      : agentsFromHotel(p.hotel).length
        ? agentsFromHotel(p.hotel)
        : normalizeAgents(fallback.agents),
    monthDraws: Array.isArray((p as { monthDraws?: MonthDraw[] }).monthDraws)
      ? normalizeMonthDraws((p as { monthDraws?: MonthDraw[] }).monthDraws)
      : monthDrawsFromHotel(p.hotel).length
        ? monthDrawsFromHotel(p.hotel)
        : normalizeMonthDraws(fallback.monthDraws),
    monthOpenings: Array.isArray((p as { monthOpenings?: MonthOpening[] }).monthOpenings)
      ? normalizeMonthOpenings((p as { monthOpenings?: MonthOpening[] }).monthOpenings)
      : monthOpeningsFromHotel(p.hotel).length
        ? monthOpeningsFromHotel(p.hotel)
        : normalizeMonthOpenings(fallback.monthOpenings),
    monthArchives: keepMonthArchives([
      normalizeMonthArchives((p as { monthArchives?: MonthArchive[] }).monthArchives),
      monthArchivesFromHotel(p.hotel),
      normalizeMonthArchives(fallback.monthArchives),
    ]),
    openMonths: openMonthsFromHotel(p.hotel).length
      ? openMonthsFromHotel(p.hotel)
      : openMonthsFromHotel(fallback.hotel),
    guestCards: Array.isArray((p as { guestCards?: GuestCard[] }).guestCards)
      ? normalizeGuestCards((p as { guestCards?: GuestCard[] }).guestCards)
      : guestCardsFromHotel(p.hotel).length
        ? guestCardsFromHotel(p.hotel)
        : normalizeGuestCards(fallback.guestCards),
    bankRows: Array.isArray((p as { bankRows?: BankRow[] }).bankRows)
      ? normalizeBankRows((p as { bankRows?: BankRow[] }).bankRows)
      : bankRowsFromHotel(p.hotel).length
        ? bankRowsFromHotel(p.hotel)
        : normalizeBankRows(fallback.bankRows),
    cashCounts: normalizeCashCounts(
      (p as { cashCounts?: CashCount[] }).cashCounts ?? fallback.cashCounts,
    ),
    savedAt: num((p as { savedAt?: unknown }).savedAt) || fallback.savedAt,
  };
}

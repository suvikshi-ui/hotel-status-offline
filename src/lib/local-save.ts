import { ledgerOwnerKey, useLedger } from "./store";
import { parseLockRev, parseLockedDates, writeStoredLocks } from "./register-lock";
import type { LedgerSnapshot } from "./ledger-snapshot";

export async function saveAccountNow(): Promise<{ ok: true; cloud: false }> {
  return { ok: true, cloud: false };
}

export async function importBackupAndRefresh(
  _userId: string,
  snap: LedgerSnapshot,
): Promise<{ ok: true; cloud: false; message: string }> {
  useLedger.getState().applyCloudBooks({
    ...snap,
    lockedDates: parseLockedDates(snap.lockedDates),
    lockRev: parseLockRev(snap.lockRev),
    savedAt: Date.now(),
  });
  writeStoredLocks(ledgerOwnerKey(), parseLockedDates(snap.lockedDates));
  return { ok: true, cloud: false, message: "Saved on this computer." };
}

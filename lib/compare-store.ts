// ─── Compare Store (localStorage-backed, no React dependency) ─────────────────
// Max 4 items. Fires "comparechange" custom event on every mutation.

const STORAGE_KEY = "realhoms_compare";
const MAX_COMPARE = 4;

export interface CompareItem {
  id: string;
  slug: string;
  title: string;
  image: string;
  price: string;
}

function readItems(): CompareItem[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch {
    return [];
  }
}

function writeItems(items: CompareItem[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  window.dispatchEvent(new Event("comparechange"));
}

export function getCompareItems(): CompareItem[] {
  return readItems();
}

export function isInCompare(id: string): boolean {
  return readItems().some((item) => item.id === id);
}

export function addToCompare(item: CompareItem): { success: boolean; message?: string } {
  const items = readItems();
  if (items.some((i) => i.id === item.id)) {
    return { success: true }; // already in list
  }
  if (items.length >= MAX_COMPARE) {
    return {
      success: false,
      message: `You can compare up to ${MAX_COMPARE} properties at once. Remove one to add another.`,
    };
  }
  writeItems([...items, item]);
  return { success: true };
}

export function removeFromCompare(id: string) {
  writeItems(readItems().filter((item) => item.id !== id));
}

export function clearCompare() {
  writeItems([]);
}

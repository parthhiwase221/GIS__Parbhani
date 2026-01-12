// Utility functions for Collection Dashboard
// Extracted to prevent recreation on each render

export const CRORE_DIVISOR = 10000000;

export const formatCrores = (amount: number): string => 
  `₹${(amount / CRORE_DIVISOR).toFixed(2)}Cr`;

export const getCollectionBadgeClass = (percentage: number): string => {
  if (percentage >= 95) return 'bg-emerald-100 text-emerald-700';
  if (percentage >= 90) return 'bg-blue-100 text-blue-700';
  if (percentage >= 85) return 'bg-amber-100 text-amber-700';
  return 'bg-red-100 text-red-700';
};

// Reusable table cell class names
export const TABLE_CELL_BASE = "py-3 px-3";
export const TABLE_CELL_CENTER = `${TABLE_CELL_BASE} text-center`;
export const TABLE_CELL_RIGHT = `${TABLE_CELL_BASE} text-right`;
export const TABLE_CELL_BORDER_R = "border-r border-slate-200";
export const TABLE_CELL_BORDER_R_LIGHT = "border-r border-slate-100";

// Calculate zone totals
export const calculateZoneTotals = (zones: any[]) => {
  return zones.reduce((acc, zone) => ({
    wards: acc.wards + zone.wards,
    properties: acc.properties + zone.properties,
    pendingDemand: acc.pendingDemand + zone.pendingDemand,
    currentDemand: acc.currentDemand + zone.currentDemand,
    penalty: acc.penalty + zone.penalty,
    totalDemand: acc.totalDemand + zone.totalDemand,
    pendingCollection: acc.pendingCollection + zone.pendingCollection,
    currentCollection: acc.currentCollection + zone.currentCollection,
    penaltyCollection: acc.penaltyCollection + zone.penaltyCollection,
    totalCollection: acc.totalCollection + zone.totalCollection,
    pendingBalance: acc.pendingBalance + zone.pendingBalance,
    currentBalance: acc.currentBalance + zone.currentBalance,
    penaltyBalance: acc.penaltyBalance + zone.penaltyBalance,
    totalBalance: acc.totalBalance + zone.totalBalance,
  }), {
    wards: 0,
    properties: 0,
    pendingDemand: 0,
    currentDemand: 0,
    penalty: 0,
    totalDemand: 0,
    pendingCollection: 0,
    currentCollection: 0,
    penaltyCollection: 0,
    totalCollection: 0,
    pendingBalance: 0,
    currentBalance: 0,
    penaltyBalance: 0,
    totalBalance: 0,
  });
};

// Calculate scheme totals
export const calculateSchemeTotals = (slots: any[]) => {
  return slots.reduce((sum, slot) => ({
    properties: sum.properties + slot.properties,
    totalDemand: sum.totalDemand + slot.totalDemand,
    rebate: sum.rebate + slot.rebate,
    collected: sum.collected + slot.collected,
  }), { properties: 0, totalDemand: 0, rebate: 0, collected: 0 });
};

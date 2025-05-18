export enum StockCountResultStatus {
  PARTIAL = 'PARTIAL',
  FULL = 'FULL',
}

export enum StockCountProgressStatus {
  IN_PROGRESS = 'IN_PROGRESS',
  PAUSED = 'PAUSED',
  COMPLETED = 'COMPLETED',
}

export enum StockCountEntryStatus {
  COUNTED = 'COUNTED',
  UNCOUNTED = 'UNCOUNTED',
  INCLUDE = 'INCLUDE',
  EXCLUDE = 'EXCLUDE',
}

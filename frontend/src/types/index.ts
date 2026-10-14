// src/types/index.ts

export type TransactionType = 'Expense' | 'Income'

export interface Transaction {
  id: string | number
  type: TransactionType
  amount: number
  category: string
  date: string
  note?: string | null
}

export interface Budget {
  category: string
  limitAmount: number
}
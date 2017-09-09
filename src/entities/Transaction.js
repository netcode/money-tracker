import pick from 'lodash/pick'
import Currency from './Currency'

export const EXPENSE = 0
export const TRANSFER = 1
export const INCOME = 2
const KIND_LABEL = {
  [EXPENSE]: 'Expense',
  [TRANSFER]: 'Transfer',
  [INCOME]: 'Income'
}

const Transaction = {
  defaultKind: EXPENSE,
  recentListLimit: 5,
  kindLabel(kind) {
    return KIND_LABEL[kind]
  },
  fromForm(data) {
    return {
      ...data,
      id: data.id || `T${Date.now()}`,
      amount: Currency.toInt(
        data.amount * (data.kind === EXPENSE ? -1 : 1),
        data.currency
      ),
      linkedAmount:
        data.kind === TRANSFER
          ? Currency.toInt(data.linkedAmount, data.linkedCurrency)
          : undefined,
      tags: data.tags[data.kind] || []
    }
  },
  toForm(data) {
    return {
      ...data,
      amount: Currency.toFloat(
        data.amount * (data.kind === EXPENSE ? -1 : 1),
        data.currency
      ),
      linkedAmount:
        data.kind === TRANSFER
          ? Currency.toFloat(data.linkedAmount, data.linkedCurrency)
          : undefined,
      tags: { [data.kind]: data.tags }
    }
  },
  fromStorage(data) {
    return {
      id: data._id,
      ...pick(data, Transaction.persistentKeys(data))
    }
  },
  toStorage(data) {
    return pick(data, Transaction.persistentKeys(data))
  },
  persistentKeys(data) {
    const keys = [
      'kind',
      'date',
      'note',
      'tags',
      'accountId',
      'amount',
      'currency'
    ]
    if (data.kind === TRANSFER) {
      keys.push(...['linkedAccountId', 'linkedAmount', 'linkedCurrency'])
    }

    return keys
  }
}

export default Transaction
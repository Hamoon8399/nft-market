import { PersistentVector } from "near-sdk-core";
import { Transaction } from "../model/transaction";

class TransactionStorage {
  public store: PersistentVector<Transaction>;

  constructor() {
    this.store = new PersistentVector<Transaction>("t");
  }

  getTransactions(): Array<Transaction> {
    let result = new Array<Transaction>();
    for (let i = 0; i < this.store.length; i++) {
      const transaction: Transaction = this.store[i];
      result.push(transaction);
    }
    return result;
  }

  getByUser(userId: string): Array<Transaction> {
    let result = new Array<Transaction>();
    for (let i = 0; i < this.store.length; i++) {
      const transaction: Transaction = this.store[i];
      if (transaction.from == userId || transaction.to == userId) {
        result.push(transaction);
      }
    }

    return result;
  }

  getByToken(token: string): Array<Transaction> {
    let result = new Array<Transaction>();
    for (let i = 0; i < this.store.length; i++) {
      const transaction: Transaction = this.store[i];
      if (transaction.token == token) {
        result.push(transaction);
      }
    }
    return result;
  }

  push(transaction: Transaction): void {
    this.store.pushBack(transaction);
  }
}

export const transactionStorage = new TransactionStorage();

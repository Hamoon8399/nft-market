import { Transaction } from "../model/transaction";
import { transactionStorage } from "../storage/transaction";

export function getTransactions(): Array<Transaction> {
  return transactionStorage.getTransactions();
}

export function getByUser(userId: string): Array<Transaction> {
  return transactionStorage.getByUser(userId);
}

export function getByToken(token: string): Array<Transaction> {
  return transactionStorage.getByToken(token);
}

export function createNewTransaction(transaction: Transaction): u64 {
  const newTransaction = new Transaction(
    transaction.from,
    transaction.to,
    transaction.timeStamp,
    transaction.token,
    transaction.value
  );
  transactionStorage.push(newTransaction);
  return 1;
}

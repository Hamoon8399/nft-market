import { context, ContractPromiseBatch, u128 } from "near-sdk-core";
import * as NFTController from "./controller/nft";
import * as transactionController from "./controller/transaction";
import { Item, NFT } from "./model/nft";
import { Transaction } from "./model/transaction";
import { asYocto } from "./utils";

const categories = [
  "Ghibli",
  "One Punch Man",
  "Naruto",
  "One Piece",
  "Conan",
  "Other",
];

export function mintNft(
  createdAt: u64,
  item: Item,
  value: u64,
  token: string
): u64 {
  if (categories.includes(item.category)) {
    return NFTController.mintNft(createdAt, item, value, token);
  }
  return 0;
}

export function getNfts(): Array<NFT> {
  return NFTController.getNfts();
}

export function getExchanges(): Array<NFT> {
  return NFTController.getExchanges();
}

export function getByOwner(userId: string): Array<NFT> {
  return NFTController.getByOwner(userId);
}

export function getByCreatedBy(createdBy: string): Array<NFT> {
  return NFTController.getByCreatedBy(createdBy);
}

export function updateNFT(token: string, sale: u64, value: u64): u64 {
  const nfts: Array<NFT> = NFTController.getNfts();
  for (let i = 0; i < nfts.length; i++) {
    const nft: NFT = nfts[i];
    if (nft.token == token && nft.owner == context.sender) {
      nft.sale = sale;
      nft.value = value;
      return NFTController.updateNFT(nft);
    }
  }
  return 0;
}

export function getTransactions(): Array<Transaction> {
  return transactionController.getTransactions();
}

export function getByUser(userId: string): Array<Transaction> {
  return transactionController.getByUser(userId);
}

export function getByToken(token: string): Array<Transaction> {
  return transactionController.getByToken(token);
}

export function buyNFT(token: string, timeStamp: u64): u64 {
  const nfts: Array<NFT> = NFTController.getNfts();
  for (let i = 0; i < nfts.length; i++) {
    const nft: NFT = nfts[i];
    if (nft.token == token) {
      if (nft.sale == 0) {
        return 0;
      } else {
        if (nft.sale == 1) {
          if (asYocto(nft.value) == context.attachedDeposit) {
            ContractPromiseBatch.create(nft.createdBy).transfer(
              u128.from(u128.div(context.attachedDeposit, u128.from(10)))
            );
            ContractPromiseBatch.create(nft.owner).transfer(
              u128.from(
                u128.mul(
                  u128.div(context.attachedDeposit, u128.from(10)),
                  u128.from(9)
                )
              )
            );
            const newTransaction: Transaction = new Transaction(
              context.sender,
              nft.owner,
              timeStamp,
              token,
              nft.value
            );
            transactionController.createNewTransaction(newTransaction);

            nft.owner = context.sender;
            nft.sale = 0;
            NFTController.updateNFT(nft);

            return 1;
          }
          return 0;
        }
        return 0;
      }
    }
  }
  return 0;
}

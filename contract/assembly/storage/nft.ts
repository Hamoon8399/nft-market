import { NFT } from "../model/nft";
import { PersistentVector } from "near-sdk-core";

class NFTStorage {
  public store: PersistentVector<NFT>;

  constructor() {
    this.store = new PersistentVector<NFT>("n");
  }

  getNFTs(): Array<NFT> {
    let result = new Array<NFT>();
    for (let i = 0; i < this.store.length; i++) {
      const nft: NFT = this.store[i];
      result.push(nft);
    }
    return result;
  }

  getExchanges(): Array<NFT> {
    let result = new Array<NFT>();
    for (let i = 0; i < this.store.length; i++) {
      const nft: NFT = this.store[i];
      if (nft.sale == 1) {
        result.push(nft);
      }
    }
    return result;
  }

  getByOwner(userId: string): Array<NFT> {
    let result = new Array<NFT>();
    for (let i = 0; i < this.store.length; i++) {
      const nft: NFT = this.store[i];
      if (nft.owner == userId) {
        result.push(nft);
      }
    }
    return result;
  }

  getByCreatedBy(userId: string): Array<NFT> {
    let result = new Array<NFT>();
    for (let i = 0; i < this.store.length; i++) {
      const nft: NFT = this.store[i];
      if (nft.createdBy == userId) {
        result.push(nft);
      }
    }
    return result;
  }

  push(nft: NFT): void {
    this.store.pushBack(nft);
  }

  update(updateNft: NFT): void {
    for (let i = 0; i < this.store.length; i++) {
      const nft: NFT = this.store[i];
      if (nft.token == updateNft.token) {
        this.store.replace(i, updateNft);
      }
    }
  }
}

export const nftStorage = new NFTStorage();

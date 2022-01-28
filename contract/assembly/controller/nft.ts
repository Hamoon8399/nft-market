import { Item, NFT } from "../model/nft";
import { nftStorage } from "../storage/nft";

export function mintNft(
  createdAt: u64,
  item: Item,
  value: u64,
  token: string
): u64 {
  const newNft = new NFT(createdAt, item, value, token);
  nftStorage.push(newNft);
  return 1;
}

export function getNfts(): Array<NFT> {
  return nftStorage.getNFTs();
}

export function getExchanges(): Array<NFT> {
  return nftStorage.getExchanges();
}

export function getByOwner(userId: string): Array<NFT> {
  return nftStorage.getByOwner(userId);
}

export function getByCreatedBy(createdBy: string): Array<NFT> {
  return nftStorage.getByCreatedBy(createdBy);
}

export function updateNFT(nft: NFT): u64 {
  nftStorage.update(nft);
  return 1;
}
